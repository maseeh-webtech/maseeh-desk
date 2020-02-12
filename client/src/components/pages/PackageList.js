import React, { Component } from "react";
import { Table } from "semantic-ui-react";
import Package from "../modules/Package";
import { get } from "../../utilities";

class PackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [
        <Package
          package={{
            resident: "Kye Burchard",
            location: "Ground",
            trackingNumber: "1234567890",
          }}
        />,
      ],
    };
  }

  componentDidMount() {
    // get("/api/packages").then((packages) => {
    //   let packageComponents = packages.map((pack) => {
    //     <Package package={pack} />;
    //   });
    //   this.setState({ packages: packageComponents });
    // });
  }

  render() {
    return (
      <>
        <h1>Packages</h1>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Resident</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Tracking number</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.state.packages}</Table.Body>
        </Table>
      </>
    );
  }
}

export default PackageList;
