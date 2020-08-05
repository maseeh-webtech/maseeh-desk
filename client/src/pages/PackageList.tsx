import * as React from "react";
import { Table, Modal, Button, Loader, Input } from "semantic-ui-react";

import Checkin from "./CheckIn";
import PackageListRow from "~modules/PackageListRow";

import { get, simpleFilter } from "~utilities/utilities";

import Resident from "~types/Resident";
import Package from "~types/Package";

const { useState, useEffect } = React;

type ResidentListItem = {
  key: number;
  value: string;
  text: string;
};

const PackageList = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Populate the main package list
    get("/api/packages", { noCheckedOut: true }).then((newPackages) => {
      setPackages(newPackages);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Populate the resident dropdown
    get("/api/residents", { current: true }).then((residents: Resident[]) => {
      const newResidents = residents.map((res, i) => ({
        key: i,
        value: res.kerberos,
        text: res.name + " | " + res.room,
      }));
      setResidents(newResidents);
    });
  }, []);

  const openCheckIn = () => {
    setCheckInOpen(true);
  };

  const closeCheckIn = () => {
    setCheckInOpen(false);
  };

  const addPackage = (pack: Package) => {
    setPackages(packages.concat([pack]));
  };

  return (
    <>
      <Modal open={checkInOpen} onClose={closeCheckIn}>
        <Checkin closeCheckIn={closeCheckIn} residents={residents} addPackage={addPackage} />
      </Modal>
      <div className="packages-header">
        <h1>Packages</h1>
        <Button primary className="packages-checkin-button" onClick={openCheckIn}>
          Check in packages
        </Button>
      </div>
      <div className="filterbox">
        <Input
          icon="search"
          placeholder="Search..."
          fluid
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {loading ? (
        <Loader active />
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Resident</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Tracking number</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {packages.flatMap((pack) => {
              if (simpleFilter(query, pack.resident.name + pack.resident.kerberos)) {
                return <PackageListRow key={pack._id} pack={pack} />;
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

export default PackageList;