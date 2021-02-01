import * as React from "react";
import { Table, Message, Button } from "semantic-ui-react";
import { get, simpleFilter } from "~utilities";
import ResidentRow from "~pages/AdminPanel/ResidentListRow";
import ControlledTextInput from "~modules/ControlledTextField";
import Resident from "~types/Resident";
import { FixedHeightLoader as FixedHeightLoader } from "~modules/FixedHeightLoader";
import { NewResidentRow } from "./NewResidentRow";
import { post } from "~utilities";

const { useEffect, useState } = React;

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
