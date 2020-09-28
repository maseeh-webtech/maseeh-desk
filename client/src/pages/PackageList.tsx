import * as React from "react";
import { Table, Modal, Button, Loader, Input } from "semantic-ui-react";

import Checkin from "./CheckIn";
import PackageListRow from "~modules/PackageListRow";

import { get, simpleFilter } from "~utilities";

import { ResidentListItem } from "~types/Resident";
import Package from "~types/Package";

const { useState, useEffect, useRef } = React;

const PackageList = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [residents, setResidents] = useState<ResidentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const searchRef = useRef<Input>(null);

  useEffect(() => {
    // Populate the main package list
    get("/api/packages", { noCheckedOut: true }).then((newPackages) => {
      setPackages(newPackages);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    // Populate the resident dropdown
    get("/api/residents", { current: true }).then((newResidents) => {
      const residentListItems = newResidents.map((res: any, i: number) => ({
        key: i,
        value: res.kerberos,
        text: res.name + " | " + res.room,
      }));
      setResidents(residentListItems);
    });
  }, []);

  useEffect(() => {
    searchRef.current && searchRef.current.focus();
  }, []);

  const openCheckIn = () => {
    setCheckInOpen(true);
  };

  const closeCheckIn = () => {
    setCheckInOpen(false);
  };

  const addPackage = (pack: Package) => {
    setPackages(
      packages.concat([pack]).sort((a, b) => (a.resident.name >= b.resident.name ? 1 : -1))
    );
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
          ref={searchRef}
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
              <Table.HeaderCell>Checked in</Table.HeaderCell>
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
