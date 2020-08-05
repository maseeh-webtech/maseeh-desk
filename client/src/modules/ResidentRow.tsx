import * as React from "react";
import { Table, Button } from "semantic-ui-react";

import { post } from "~utilities/utilities";
import Resident from "~types/Resident";

const { useState } = React;

type Props = {
  resident: Resident;
};

const ResidentRow = ({ resident }: Props) => {
  const [current, setCurrent] = useState(resident.current);

  const handleDelete = () => {
    post("/api/resident/delete", { id: resident._id })
      .then((res) => {
        if (res.success) {
          window.location.reload(false);
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleToggleCurrent = () => {
    post("/api/resident/current", { id: resident._id, current: !current })
      .then(() => setCurrent(!current))
      .catch((err) => console.log(err));
  };

  const email = resident.email ? resident.email : resident.kerberos + "@mit.edu";

  return (
    <Table.Row>
      <Table.Cell>{resident.name}</Table.Cell>
      <Table.Cell>{resident.kerberos}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>{resident.room && resident.room.toString().padStart(4, "0")}</Table.Cell>
      <Table.Cell collapsing>
        <Button onClick={handleToggleCurrent} primary={current}>
          Current
        </Button>
      </Table.Cell>
      <Table.Cell collapsing>
        <Button onClick={handleDelete} negative>
          Delete
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default React.memo(ResidentRow);
