import React, { Component } from "react";
import { Table, Message, Input, Button } from "semantic-ui-react";
import { get, simpleFilter, post } from "../../utilities";
import UserRow from "../modules/UserRow.js";
import ResidentRow from "../modules/ResidentRow";

function insertToSorted(arr, item) {
  arr.splice(locationOf(arr, item, compareResidents), 0, item);
  return arr;
}

function compareResidents(a, b) {
  if (a.room < b.room) return -1;
  if (a.room > b.room) return 1;
  return 0;
}

function locationOf(arr, item, comparer, start, end) {
  console.log(start, end);
  if (arr.length === 0) return -1;

  start = start || 0;
  end = end || arr.length;
  var pivot = (start + end) >> 1;

  var c = comparer(item, arr[pivot]);
  if (end - start <= 1) return c == -1 ? pivot - 1 : pivot;

  switch (c) {
    case -1:
      return locationOf(arr, item, comparer, start, pivot);
    case 0:
      return pivot;
    case 1:
      return locationOf(arr, item, comparer, pivot, end);
  }
}

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // The this.state.users array is not kept in sync with changes visually on the page or on the server.
      users: [],
      userQuery: "",
      residents: [],
      residentQuery: "",
      newResidentName: "",
      newResidentKerberos: "",
      newResidentEmail: "",
      newResidentRoom: "",
    };
  }

  handleNewResident = () => {
    post("/api/resident/new", {
      name: this.state.newResidentName,
      kerberos: this.state.newResidentKerberos,
      email: this.state.newResidentEmail,
      room: this.state.newResidentRoom,
    })
      .then((newResident) => {
        const residents = insertToSorted(this.state.residents, newResident);
        this.setState({
          residents: residents,
          newResidentName: "",
          newResidentKerberos: "",
          newResidentEmail: "",
          newResidentRoom: "",
        });
      })
      .catch((err) => {
        console.log(err);
        alert(
          "Something went wrong!\nPlease try again, reload the page, or contact maseeh-webtech@mit.edu."
        );
      });
  };

  componentDidMount() {
    get("/api/users").then((users) => {
      this.setState({ users });
    });
    get("/api/residents").then((residents) => {
      this.setState({ residents });
    });
  }

  render() {
    const newResidentRow = (
      <Table.Row>
        <Table.HeaderCell>
          <Input
            fluid
            placeholder="Name"
            value={this.state.newResidentName}
            onChange={(e) => this.setState({ newResidentName: e.target.value })}
          ></Input>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Input
            fluid
            placeholder="Kerberos"
            value={this.state.newResidentKerberos}
            onChange={(e) => this.setState({ newResidentKerberos: e.target.value })}
          ></Input>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Input
            fluid
            placeholder="Email (leave blank for <kerberos>@mit.edu)"
            value={this.state.newResidentEmail}
            onChange={(e) => this.setState({ newResidentEmail: e.target.value })}
          ></Input>
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Input
            fluid
            placeholder="Room #"
            value={this.state.newResidentRoom}
            onChange={(e) => this.setState({ newResidentRoom: e.target.value })}
          ></Input>
        </Table.HeaderCell>
        <Table.HeaderCell colSpan="2" textAlign="center">
          <Button primary onClick={this.handleNewResident}>
            Add
          </Button>
        </Table.HeaderCell>
      </Table.Row>
    );

    const adminPanel = (
      <>
        <h2>Settings</h2>
        <h2>Users</h2>
        <p>
          Modify existing accounts here. Toggling the "Desk worker" button gives access to check
          in/out packages. Toggling the "Admin" button gives users access to this page.
        </p>
        <div className="filterbox">
          <Input
            icon="search"
            placeholder="Search..."
            fluid
            onChange={(event) => this.setState({ userQuery: event.target.value })}
          />
        </div>
        <Table>
          <Table.Body>
            {this.state.users.flatMap((user) => {
              if (simpleFilter(this.state.userQuery, user.username)) {
                return <UserRow key={user.id} user={user} self={this.props.user} />;
              } else {
                return [];
              }
            })}
          </Table.Body>
        </Table>
        <h2>Residents</h2>
        <p>Edit residents here. This affects who packages can be checked in to.</p>
        <p>
          If "Current" is active (blue), they will show up when checking in packages. If it is grey,
          they will not.
        </p>
        <div className="filterbox">
          <Input
            icon="search"
            placeholder="Search..."
            fluid
            onChange={(event) => this.setState({ residentQuery: event.target.value })}
          />
        </div>
        <Table>
          <Table.Header>
            {newResidentRow}
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Kerberos</Table.HeaderCell>
              <Table.HeaderCell>Email address</Table.HeaderCell>
              <Table.HeaderCell>Room</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.residents.flatMap((resident) => {
              if (
                simpleFilter(
                  this.state.residentQuery,
                  resident.name + resident.kerberos + "00" + resident.room
                )
              ) {
                return <ResidentRow key={resident._id} resident={resident} />;
              } else {
                return [];
              }
            })}
          </Table.Body>
        </Table>
      </>
    );

    return (
      <div>
        <h1>Admin Panel</h1>
        {this.props.user ? (
          this.props.user.admin ? (
            adminPanel
          ) : (
            <Message negative>You must be an admin to view this page.</Message>
          )
        ) : (
          <Message negative>You must be logged in to view this page.</Message>
        )}
      </div>
    );
  }
}

export default AdminPanel;
