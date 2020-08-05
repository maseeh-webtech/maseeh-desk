import React, { PureComponent } from "react";
import { Table, Button } from "semantic-ui-react";
import { post } from "~utilities/utilities";

class Package extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      show: true,
    };
  }

  handleCheckout = () => {
    post("/api/checkout", { ...this.props.package, location: "Checked out" }).then((res) => {
      this.setState({ show: false });
    });
  };

  render() {
    return (
      <Table.Row style={this.state.show ? null : { display: "none" }}>
        <Table.Cell>{this.props.package.resident?.name}</Table.Cell>
        <Table.Cell>{this.props.package.location}</Table.Cell>
        <Table.Cell>{this.props.package.trackingNumber}</Table.Cell>
        <Table.Cell collapsing>
          <Button onClick={this.handleCheckout} primary>
            Check out
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Package;
