import * as React from "react";
import { Table, Button } from "semantic-ui-react";

import { post } from "~utilities";

import PackageListRow from "~types/Package";

const { useState } = React;

type Props = {
  pack: PackageListRow;
};

const PackageListRow = ({ pack }: Props) => {
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = () => {
    post("/api/checkout", { ...pack, location: "Checked out" }).then(() => {
      setCheckedOut(true);
    });
  };

  return (
    <Table.Row style={checkedOut ? { display: "none" } : null}>
      <Table.Cell>{pack.resident?.name}</Table.Cell>
      <Table.Cell>{pack.location}</Table.Cell>
      <Table.Cell>{pack.trackingNumber}</Table.Cell>
      <Table.Cell collapsing>
        <Button onClick={handleCheckout} primary>
          Check out
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default PackageListRow;
