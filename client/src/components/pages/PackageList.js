import React, { Component } from "react";
import { Table, Modal, Button, Loader } from "semantic-ui-react";
import Package from "../modules/Package";
import Checkin from "./CheckIn";
import { get } from "../../utilities";

class PackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      checkInOpen: false,
      residents: [],
    };
  }

  componentDidMount() {
    // Populate the main package list
    get("/api/packages").then((packages) => {
      this.setState({ packages });
    });

    // Populate the resident dropdown
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

  removePackage = (toBeRemoved) => {
    console.log(`removing: ${toBeRemoved}`);
    const filteredPackages = this.state.packages.filter((pack) => {
      console.log(pack);
      return pack.props._id != toBeRemoved;
    });
    console.log(filteredPackages.length == this.state.packages.length);
    this.setState({ packages: filteredPackages });
  };

  render() {
    return (
      <>
        <Modal open={this.state.checkInOpen} onClose={this.closeCheckIn}>
          <Checkin closeCheckIn={this.closeCheckIn} residents={this.state.residents} />
        </Modal>
        <h1>Packages</h1>
        <Button onClick={this.openCheckIn}>Check in package</Button>
        {this.state.packages ? (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Resident</Table.HeaderCell>
                <Table.HeaderCell>Location</Table.HeaderCell>
                <Table.HeaderCell>Tracking number</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {this.state.packages.map((pack) => {
                return <Package key={pack._id} package={pack} removePackage={this.removePackage} />;
              })}
            </Table.Body>
          </Table>
        ) : (
          <Loader active />
        )}
      </>
    );
  }
}

export default PackageList;
