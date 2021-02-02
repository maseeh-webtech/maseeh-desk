import * as React from "react";
import { Table, Message, Button } from "semantic-ui-react";
import { CSVReader } from "react-papaparse";
import { get, simpleFilter } from "~utilities";
import ResidentRow from "~pages/AdminPanel/ResidentListRow";
import ControlledTextInput from "~modules/ControlledTextField";
import Resident from "~types/Resident";
import { FixedHeightLoader as FixedHeightLoader } from "~modules/FixedHeightLoader";
import { NewResidentRow } from "./NewResidentRow";
import { post } from "~utilities";

const { useEffect, useState, useRef } = React;

export const ResidentListSection = () => {
  const [residents, setResidents] = useState<Resident[] | null>(null);
  const [residentQuery, setResidentQuery] = useState("");

  const fetchResidents = () => {
    setResidents(null);
    get("/api/residents").then((newResidents: Resident[]) => {
      setResidents(newResidents);
    });
  };

  useEffect(fetchResidents, []);

  const deleteAllResidents = () => {
    // slightly gross map and reduce to get a newline-separated string of the non-admin usernames
    const confirm = window.confirm(
      `Are you sure you want to delete all residents? This will affect the following residents:\n${residents
        ?.map((resident) =>
          resident.numPackages && resident.numPackages > 0 ? null : `${resident.name}\n`
        )
        .reduce((acc, s) => (s ? acc + s : acc), "\n")}`
    );
    if (!confirm) {
      return;
    }
    post("/api/resident/delete_all")
      .then((res) => {
        if (res.success) {
          fetchResidents();
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  // CSV reader methods
  const buttonRef = useRef<CSVReader>(null);
  const [CSVData, setCSVData] = useState<Array<{ data: Array<string> }> | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleOpenDialog = (e: any) => {
    buttonRef.current?.open(e);
  };

  const handleRemoveFile = () => {
    buttonRef.current?.removeFile();
  };

  const handleFileLoaded = (data: any) => {
    setCSVData(data);
  };

  const handleUpload = () => {
    console.log(CSVData);
    if (!CSVData || CSVData.length === 0) {
      console.log("Something went wrong...");
      return;
    }

    try {
      // require a header row so it's impossible to get confused about which column is which.
      if (!CSVData[0].data[0].toLowerCase().includes("name")) {
        alert('Error: 1st column must be titled "name"');
        return;
      }
      if (!CSVData[0].data[1].toLowerCase().includes("email")) {
        alert('Error: 2nd column must be titled "email"');
        return;
      }
      if (!CSVData[0].data[2].toLowerCase().includes("room")) {
        alert('Error: 3rd column must be titled "room"');
        return;
      }

      const dataToUpload = CSVData.map((row, i) => {
        if (i === 0) return;
        if (row.data.length !== 3) return;
        return {
          name: row.data[0],
          // only include email if it isn't an MIT address
          email: row.data[1].split("@")[1].toLowerCase() === "mit.edu" ? null : row.data[1],
          // assume first part of email. for non-MIT addresses, this won't
          // be a valid kerb, but should still uniquely identify residents.
          kerberos: row.data[1].split("@")[0],
          room: row.data[2].replace(/\D/g, ""),
        };
      }).filter((item: any) => !!item);

      setUploading(true);
      setResidents(null);

      post("/api/resident/bulk", { residents: dataToUpload }).then(() => {
        fetchResidents();
        setUploading(false);
        handleRemoveFile();
      });
    } catch (error) {
      alert(
        "Something went wrong! Please alert Maseeh WebTech or check the console for more information."
      );
      console.log(error);
    }
  };

  return (
    <>
      <h2>Residents</h2>
      <p>Edit residents here. This affects who packages can be checked in to.</p>
      <p>
        If "Enabled" is turned on, they will show up when checking in packages. If it is disabled,
        they will not.
      </p>
      <Message warning>
        Deleting a single resident is permanent, and also deletes any packages currently checked in
        to them.
      </Message>
      <Message className="admin-delete-all">
        This button deletes all residents in the table who do not have any packages. It leaves
        residents with packages alone.
        <Button onClick={deleteAllResidents} negative>
          Delete all residents
        </Button>
      </Message>
      <Message className="admin-delete-all">
        Upload new residents here! <br />
        The CSV file should have exactly 3 columns (in this order): Name, Email, Room number. The
        Kerberos field will be set to everything before the @ in the email, and is what is used to
        detect duplicates. If an uploaded resident already exists, this will simply update the
        information of the existing one (keeping their packages intact). The upload process will
        take 30 seconds to a minute for a full roster. <br />
        If you have an Excel file, click File -&gt; Save As -&gt; and select the "CSV" option.
        <CSVReader
          ref={buttonRef}
          onFileLoad={handleFileLoaded}
          onError={() => console.log("papaparse error")}
          noClick
          noDrag
          noProgressBar
        >
          {(args: any) => {
            const file = args.file;
            return (
              <div className="admin-csv">
                <Button onClick={handleOpenDialog}>Select CSV</Button>
                {file && !uploading && file.name}
                {file && CSVData && !uploading && (
                  <Button primary onClick={handleUpload}>
                    Upload
                  </Button>
                )}
              </div>
            );
          }}
        </CSVReader>
      </Message>
      <div className="filterbox">
        <ControlledTextInput
          icon="search"
          placeholder="Search..."
          value={residentQuery}
          setValue={setResidentQuery}
        />
      </div>
      {residents === null ? (
        <FixedHeightLoader />
      ) : (
        <Table celled>
          <Table.Header>
            <NewResidentRow fetchResidents={fetchResidents} residents={residents} />
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Kerberos</Table.HeaderCell>
              <Table.HeaderCell>Email address</Table.HeaderCell>
              <Table.HeaderCell>Room</Table.HeaderCell>
              <Table.HeaderCell>Enabled</Table.HeaderCell>
              <Table.HeaderCell># of packages</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {residents.flatMap((resident: Resident) => {
              if (
                simpleFilter(
                  residentQuery,
                  resident.name + resident.kerberos + "00" + resident.room
                )
              ) {
                return (
                  <ResidentRow
                    fetchResidents={fetchResidents}
                    key={resident._id}
                    resident={resident}
                  />
                );
              } else {
                return [];
              }
            })}
          </Table.Body>
        </Table>
      )}
    </>
  );
};
