import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import { post } from "../../utilities";

class Package extends Component {
  constructor(props) {
    super(props);
  }

  handleCheckout = () => {
    post("/api/checkout", { ...this.props.package, location: "Checked out" }).then((res) => {
      this.props.removePackage(res._id);
    });
  };

  render() {
    return (
      <Table.Row>
        <Table.Cell>{this.props.package.resident.name}</Table.Cell>
        <Table.Cell>{this.props.package.location}</Table.Cell>
        <Table.Cell>{this.props.package.trackingNumber}</Table.Cell>
        <Table.Cell>
          <Button onClick={this.handleCheckout} primary>
            Check out
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Package;
