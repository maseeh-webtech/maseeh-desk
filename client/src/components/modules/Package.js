import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

class Package extends Component {
  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.package.resident}</Table.Cell>
        <Table.Cell>{this.props.package.location}</Table.Cell>
        <Table.Cell>{this.props.package.trackingNumber}</Table.Cell>
        <Table.Cell>
          <Button onClick={null} primary>
            Check out
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Package;
