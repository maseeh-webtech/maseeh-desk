import * as React from "react";
import { Table, Button } from "semantic-ui-react";
import { get, simpleFilter, post } from "~utilities";
import UserListRow from "~modules/UserListRow";
import ResidentRow from "~modules/ResidentListRow";
import ControlledTextInput from "~modules/ControlledTextField";
import AdminRequiredMessage from "~modules/AdminRequiredMessage";

import UserContext from "~context/UserContext";

import User from "~types/User";
import Resident from "~types/Resident";
import { RouteComponentProps } from "@reach/router";
import { FixedHeightLoader as FixedHeightLoader } from "~modules/FixedHeightLoader";

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

type NewResidentRowProps = {
  addResident: (addResident: Resident) => void;
  residents: Resident[];
};

const NewResidentRow = ({ addResident, residents }: NewResidentRowProps) => {
  // State for new input fields
  const [newResidentName, setNewResidentName] = useState("");
  const [newResidentKerberos, setNewResidentKerberos] = useState("");
  const [newResidentEmail, setNewResidentEmail] = useState("");
  const [newResidentRoom, setNewResidentRoom] = useState("");

  const handleNewResident = () => {
    for (const resident of residents) {
      if (
        newResidentName === resident.name ||
        newResidentKerberos === resident.kerberos ||
        newResidentEmail === resident.email
      ) {
        const confirm = window.confirm(
          `There is already a resident "${resident.name}" (${
            resident.kerberos || resident.email
          }). Are you sure you want to add "${newResidentName}" (${
            newResidentKerberos || newResidentEmail
          })?`
        );
        if (!confirm) return;
      }
    }

    post("/api/resident/new", {
      name: newResidentName,
      kerberos: newResidentKerberos,
      email: newResidentEmail,
      room: newResidentRoom,
    })
      .then((newResident: Resident) => {
        addResident(newResident);
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

  return (
    <Table.Row>
      <Table.HeaderCell>
        <ControlledTextInput
          placeholder="Name"
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
        <Button
          primary
          onClick={handleNewResident}
          disabled={!(newResidentName && newResidentKerberos && newResidentRoom)}
        >
          Add
        </Button>
      </Table.HeaderCell>
    </Table.Row>
  );
};

const ResidentListSection = () => {
  const [residents, setResidents] = useState<Resident[] | null>(null);
  const [residentQuery, setResidentQuery] = useState("");

  useEffect(() => {
    get("/api/residents").then((newResidents: Resident[]) => {
      setResidents(newResidents);
    });
  }, []);

  const addResident = (newResident: Resident) => {
    if (residents === null) return;
    const newResidents = insertToSorted(residents, newResident);
    setResidents(newResidents);
  };

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
            <NewResidentRow addResident={addResident} residents={residents} />
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
                return <ResidentRow key={resident._id} resident={resident} />;
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

const UserListSection = () => {
  const user = useContext(UserContext);
  const [userQuery, setUserQuery] = useState("");
  // Note: this state is not kept updated, so that the entire table doesn't re-render when one user is changed
  // TODO: see if this is a necessary optimization or not
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    get("/api/users").then((newUsers: User[]) => {
      setUsers(newUsers);
    });
  }, []);

  return (
    <>
      <h2>Users</h2>
      <p>
        Modify existing accounts here. Giving users the "Desk worker" permission gives access to
        check in/out packages. Giving the "Admin" permission allows users to access and modify this
        page.
      </p>
      <div className="filterbox">
        <ControlledTextInput
          icon="search"
          placeholder="Search..."
          value={userQuery}
          setValue={setUserQuery}
        />
      </div>
      {users === null ? (
        <FixedHeightLoader />
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell collapsing>Desk worker permission</Table.HeaderCell>
              <Table.HeaderCell collapsing>Admin permission</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.flatMap((u) => {
              if (simpleFilter(userQuery, u.username)) {
                return <UserListRow key={u.id} user={u} self={user} />;
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

const AdminPanel = (_props: RouteComponentProps) => {
  const user = useContext(UserContext);

  const adminPanel = (
    <>
      <h2>Settings</h2>
      <UserListSection />
      <ResidentListSection />
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
