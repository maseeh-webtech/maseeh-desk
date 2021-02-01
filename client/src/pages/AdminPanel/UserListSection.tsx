import * as React from "react";
import { Table } from "semantic-ui-react";
import { get, simpleFilter } from "~utilities";
import UserListRow from "~pages/AdminPanel/UserListRow";
import ControlledTextInput from "~modules/ControlledTextField";
import UserContext from "~context/UserContext";
import User from "~types/User";
import { FixedHeightLoader as FixedHeightLoader } from "~modules/FixedHeightLoader";

const { useEffect, useState, useContext } = React;

export const UserListSection = () => {
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
