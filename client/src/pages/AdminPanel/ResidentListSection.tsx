import * as React from "react";
import { Table } from "semantic-ui-react";
import { get, simpleFilter } from "~utilities";
import ResidentRow from "~pages/AdminPanel/ResidentListRow";
import ControlledTextInput from "~modules/ControlledTextField";
import Resident from "~types/Resident";
import { FixedHeightLoader as FixedHeightLoader } from "~modules/FixedHeightLoader";
import { NewResidentRow } from "./NewResidentRow";

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

  return (
    <>
      <h2>Residents</h2>
      <p>Edit residents here. This affects who packages can be checked in to.</p>
      <p>
        If "Enabled" is turned on, they will show up when checking in packages. If it is disabled,
        they will not. Deleting a resident is permanent, and also deletes any packages currently
        checked in to them.
      </p>
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
