import React, { Component } from "react";
import { Table, Modal, Button, Loader, Input } from "semantic-ui-react";
import Package from "../modules/Package";
import Checkin from "./CheckIn";
import { get, simpleFilter } from "~utilities/utilities";

class PackageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      packages: [],
      checkInOpen: false,
      residents: [],
      loading: true,
      query: "",
    };
  }

  componentDidMount() {
    // Populate the main package list
    get("/api/packages", { noCheckedOut: true }).then((packages) => {
      this.setState({ packages });
      this.setState({ loading: false });
    });

    // Populate the resident dropdown
    get("/api/residents", { current: true }).then((residents) => {
      residents.forEach((res, i) => {
        res.key = i;
        res.value = res.kerberos;
        res.text = res.name + " | " + res.room;
        delete res.current;
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
        <div className="filterbox">
          <Input
            icon="search"
            placeholder="Search..."
            fluid
            onChange={(event) => this.setState({ query: event.target.value })}
          />
        </div>
        {this.state.loading ? (
          <Loader active />
        ) : (
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
              {this.state.packages.flatMap((pack) => {
                if (simpleFilter(this.state.query, pack.resident.name + pack.resident.kerberos)) {
                  return (
                    <Package key={pack._id} package={pack} removePackage={this.removePackage} />
                  );
                } else {
                  return [];
                }
              })}
            </Table.Body>
          </Table>
        )}
      </>
    );
  }
}

export default PackageList;
