import * as React from "react";
import { Table, Button } from "semantic-ui-react";
import { get, simpleFilter, post } from "~utilities/utilities";
import UserRow from "~modules/UserRow";
import ResidentRow from "~modules/ResidentRow";
import ControlledTextInput from "~modules/ControlledTextField";
import AdminRequiredMessage from "~modules/AdminRequiredMessage";

import UserContext from "~context/UserContext";

import User from "~types/User";
import Resident from "~types/Resident";
import { RouteComponentProps } from "@reach/router";

const { useEffect, useState, useContext } = React;

function insertToSorted(arr: Array<any>, item: any) {
  arr.splice(locationOf(arr, item, compareResidents, 0, arr.length), 0, item);
  return arr;
}

function compareResidents(a: Resident, b: Resident) {
  if (a.room < b.room) return -1;
  if (a.room > b.room) return 1;
  return 0;
}

function locationOf(
  arr: Array<any>,
  item: any,
  comparer: (a: any, b: any) => number,
  start: number,
  end: number
): number {
  if (arr.length === 0) return -1;

  var pivot = (start + end) >> 1;

  var c = comparer(item, arr[pivot]);
  if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

  switch (c) {
    case -1:
      return locationOf(arr, item, comparer, start, pivot);
    case 0:
      return pivot;
    case 1:
      return locationOf(arr, item, comparer, pivot, end);
  }
  throw new Error("Should never get here...");
}

const AdminPanel = (_props: RouteComponentProps) => {
  const user = useContext(UserContext);

  // State for list views
  const [residents, setResidents] = useState<Resident[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // State for new input fields
  const [newResidentName, setNewResidentName] = useState("");
  const [newResidentKerberos, setNewResidentKerberos] = useState("");
  const [newResidentEmail, setNewResidentEmail] = useState("");
  const [newResidentRoom, setNewResidentRoom] = useState("");

  // State for filters
  const [userQuery, setUserQuery] = useState("");
  const [residentQuery, setResidentQuery] = useState("");

  const handleNewResident = () => {
    post("/api/resident/new", {
      name: newResidentName,
      kerberos: newResidentKerberos,
      email: newResidentEmail,
      room: newResidentRoom,
    })
      .then((newResident: Resident) => {
        const newResidents = insertToSorted(residents, newResident);
        setResidents(newResidents);
        setNewResidentName("");
        setNewResidentKerberos("");
        setNewResidentEmail("");
        setNewResidentRoom("");
      })
      .catch((err: Error) => {
        console.log(err);
        alert(
          "Something went wrong!\nPlease try again, reload the page, or contact maseeh-webtech@mit.edu."
        );
      });
  };

  useEffect(() => {
    get("/api/users").then((newUsers: User[]) => {
      setUsers(newUsers);
    });
    get("/api/residents").then((newResidents: Resident[]) => {
      setResidents(newResidents);
    });
  }, []);

  const newResidentRow = (
    <Table.Row>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="name"
          value={newResidentName}
          setValue={setNewResidentName}
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Kerberos"
          value={newResidentKerberos}
          setValue={setNewResidentKerberos}
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Email (leave blank for <kerberos>@mit.edu)"
          value={newResidentEmail}
          setValue={setNewResidentEmail}
        />
      </Table.HeaderCell>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Room #"
          value={newResidentRoom}
          setValue={setNewResidentRoom}
        />
      </Table.HeaderCell>
      <Table.HeaderCell colSpan="2" textAlign="center">
        <Button primary onClick={handleNewResident}>
          Add
        </Button>
      </Table.HeaderCell>
    </Table.Row>
  );

  const adminPanel = (
    <>
      <h2>Settings</h2>
      <h2>Users</h2>
      <p>
        Modify existing accounts here. Toggling the "Desk worker" button gives access to check
        in/out packages. Toggling the "Admin" button gives users access to this page.
      </p>
      <div className="filterbox">
        <ControlledTextInput
          icon="search"
          placeholder="Search..."
          value={userQuery}
          setValue={setUserQuery}
        />
      </div>
      <Table>
        <Table.Body>
          {users.flatMap((u) => {
            if (simpleFilter(userQuery, u.username)) {
              return <UserRow key={u.id} user={u} self={user} />;
            } else {
              return [];
            }
          })}
        </Table.Body>
      </Table>
      <h2>Residents</h2>
      <p>Edit residents here. This affects who packages can be checked in to.</p>
      <p>
        If "Current" is active (blue), they will show up when checking in packages. If it is grey,
        they will not.
      </p>
      <div className="filterbox">
        <ControlledTextInput
          icon="search"
          placeholder="Search..."
          value={residentQuery}
          setValue={setResidentQuery}
        />
      </div>
      <Table>
        <Table.Header>
          {newResidentRow}
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Kerberos</Table.HeaderCell>
            <Table.HeaderCell>Email address</Table.HeaderCell>
            <Table.HeaderCell>Room</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {residents.flatMap((resident: Resident) => {
            if (
              simpleFilter(residentQuery, resident.name + resident.kerberos + "00" + resident.room)
            ) {
              return <ResidentRow key={resident._id} resident={resident} />;
            } else {
              return [];
            }
          })}
        </Table.Body>
      </Table>
    </>
  );

  return (
    <div>
      <h1>Admin Panel</h1>
      {user?.admin ? adminPanel : <AdminRequiredMessage />}
    </div>
  );
};

export default AdminPanel;
