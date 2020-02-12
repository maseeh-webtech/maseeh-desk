import React, { Component } from "react";
import { Table, Modal, Button } from "semantic-ui-react";
import Package from "../modules/Package";
import Checkin from "./CheckIn";
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
          key={0}
        />,
      ],
      checkInOpen: false,
      residents: [],
    };
  }

  componentDidMount() {
    // get("/api/packages").then((packages) => {
    //   let packageComponents = packages.map((pack) => {
    //     <Package package={pack} />;
    //   });
    //   this.setState({ packages: packageComponents });
    // });
    get("/api/residents").then((residents) => {
      residents.forEach((res) => {
        res.value = res.kerberos;
        res.text = res.name + " | " + res.room;
      });
      this.setState({ residents });
    });
  }

  closeCheckIn = () => {
    this.setState({ checkInOpen: false });
  };

  openCheckIn = () => {
    this.setState({ checkInOpen: true });
  };

  render() {
    return (
      <>
        <Modal open={this.state.checkInOpen} onClose={this.closeCheckIn}>
          <Checkin closeCheckIn={this.closeCheckIn} residents={this.state.residents} />
        </Modal>
        <h1>Packages</h1>
        <Button onClick={this.openCheckIn}>Check in package</Button>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Resident</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Tracking number</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.state.packages}</Table.Body>
        </Table>
      </>
    );
  }
}

export default PackageList;
