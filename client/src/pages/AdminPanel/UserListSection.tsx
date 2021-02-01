import * as React from "react";
import { Table, Message, Button } from "semantic-ui-react";
import { get, simpleFilter } from "~utilities";
import UserListRow from "~pages/AdminPanel/UserListRow";
import ControlledTextInput from "~modules/ControlledTextField";
import UserContext from "~context/UserContext";
import User from "~types/User";
import { FixedHeightLoader as FixedHeightLoader } from "~modules/FixedHeightLoader";
import { post } from "~utilities";

const { useEffect, useState, useContext } = React;

export const UserListSection = () => {
  const user = useContext(UserContext);
  const [userQuery, setUserQuery] = useState("");
  // Note: this state is not kept updated, so that the entire table doesn't re-render when one user is changed
  // TODO: see if this is a necessary optimization or not
  const [users, setUsers] = useState<User[] | null>(null);

  const fetchUsers = () => {
    setUsers(null);
    get("/api/users").then((newUsers: User[]) => {
      setUsers(newUsers);
    });
  };

  useEffect(fetchUsers, []);

  const deleteAllUsers = () => {
    // slightly gross map and reduce to get a newline-separated string of the non-admin usernames
    const confirm = window.confirm(
      `Are you sure you want to delete all desk workers? This will affect the following users:\n${users
        ?.map((user) => (user.admin ? null : `${user.username}\n`))
        .reduce((acc, s) => (s ? acc + s : acc), "\n")}`
    );
    if (!confirm) {
      return;
    }
    post("/api/user/delete_all")
      .then((res) => {
        if (res.success) {
          fetchUsers();
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h2>Users</h2>
      <p>
        Modify existing accounts here. Giving users the "Desk worker" permission gives access to
        check in/out packages. Giving the "Admin" permission allows users to access and modify this
        page.
      </p>
      <Message className="admin-delete-all">
        This button deletes all users in the table who are not admins. It leaves admin users alone.
        <Button negative onClick={deleteAllUsers}>
          Delete all desk workers
        </Button>
      </Message>
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
