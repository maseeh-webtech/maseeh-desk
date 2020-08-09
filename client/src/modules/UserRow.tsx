import * as React from "react";
import { Table, Button } from "semantic-ui-react";
import { post } from "~utilities";
import User from "~types/User";

type Props = {
  user: User;
  self: User | null;
};

const { useState } = React;

const UserRow = ({ user, self }: Props) => {
  const [admin, setAdmin] = useState(user.admin);
  const [deskworker, setDeskworker] = useState(user.deskworker);

  const handleDelete = () => {
    post("/api/user/delete", { id: user.id })
      .then((res) => {
        if (res.success) {
          window.location.reload(false);
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleToggleAdmin = () => {
    post("/api/user/admin", { id: user.id, admin: !admin })
      .then(() => setAdmin((prev) => !prev))
      .catch((err) => console.log(err));
  };

  const handleToggleWorker = () => {
    post("/api/user/deskworker", { id: user.id, deskworker: !deskworker })
      .then(() => {
        // If you turn off a desk worker's status, also remove their admin access so they aren't
        // in a weird undefined state
        if (deskworker && admin) {
          handleToggleAdmin();
        }
        setDeskworker((prev) => !prev);
      })
      .catch((err) => console.log(err));
  };

  // Set name up so it's self-aware and doesn't error if this.props.user doesn't exist yet
  const isSelf = (self && self.id === user.id) || false;
  let name;
  if (isSelf) {
    name = user.username + " (You)";
  } else {
    name = user.username;
  }

  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>

      <Table.Cell collapsing>
        <Button onClick={handleToggleWorker} primary={deskworker} disabled={isSelf}>
          Desk worker
        </Button>
      </Table.Cell>
      <Table.Cell collapsing>
        <Button onClick={handleToggleAdmin} primary={admin} disabled={isSelf}>
          Admin
        </Button>
      </Table.Cell>
      <Table.Cell collapsing>
        <Button onClick={handleDelete} negative disabled={isSelf}>
          Delete
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default UserRow;
