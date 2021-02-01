import * as React from "react";
import { Table, Button, Checkbox } from "semantic-ui-react";

import { post } from "~utilities";
import Resident from "~types/Resident";

const { useState } = React;

type Props = {
  fetchResidents: () => void;
  resident: Resident;
};

const ResidentRow = ({ fetchResidents, resident }: Props) => {
  const [current, setCurrent] = useState(resident.current);

  const handleDelete = () => {
    const confirm = window.confirm(
      `Are you sure you want to delete resident "${resident.name}" (${
        resident.kerberos || resident.email
      })?${
        // add a warning if the user has non-zero numPackages
        resident.numPackages && resident.numPackages > 0
          ? `\n\n WARNING: this will also delete all ${resident.numPackages} packages currently checked into  ${resident.name}.`
          : ""
      }`
    );
    if (!confirm) {
      return;
    }
    post("/api/resident/delete", { id: resident._id })
      .then((res) => {
        if (res.success) {
          fetchResidents();
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
      <Table.Cell disabled={!current}>{resident.name}</Table.Cell>
      <Table.Cell disabled={!current}>{resident.kerberos}</Table.Cell>
      <Table.Cell disabled={!current}>{email}</Table.Cell>
      <Table.Cell disabled={!current}>
        {resident.room && resident.room.toString().padStart(4, "0")}
      </Table.Cell>
      <Table.Cell collapsing>
        <Checkbox toggle checked={current} onChange={handleToggleCurrent} />
      </Table.Cell>
      <Table.Cell collapsing>{resident.numPackages}</Table.Cell>
      <Table.Cell collapsing>
        <Button onClick={handleDelete} negative>
          Delete
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default React.memo(ResidentRow);
