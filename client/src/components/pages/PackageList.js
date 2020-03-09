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
    get("/api/packages", { noCheckedOut: true }).then((packages) => {
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

  addPackage = (pack) => {
    this.setState({ packages: this.state.packages.concat([pack]) });
  };

  render() {
    return (
      <>
        <Modal open={this.state.checkInOpen} onClose={this.closeCheckIn}>
          <Checkin
            closeCheckIn={this.closeCheckIn}
            residents={this.state.residents}
            addPackage={this.addPackage}
          />
        </Modal>
        <div className="packages-header">
          <h1>Packages</h1>
          <Button primary className="packages-checkin-button" onClick={this.openCheckIn}>
            Check in packages
          </Button>
        </div>
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
              {this.state.packages
                // Currently sorting on frontend. Move to backend in future.
                .sort((a, b) => a.resident.name > b.resident.name)
                .map((pack) => {
                  return (
                    <Package key={pack._id} package={pack} removePackage={this.removePackage} />
                  );
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
