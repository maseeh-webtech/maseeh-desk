import React, { Component } from "react";
import { Table, Message, Input } from "semantic-ui-react";
import { get, simpleFilter } from "../../utilities";
import UserRow from "../modules/UserRow.js";
import ResidentRow from "../modules/ResidentRow";

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // The this.state.users array is not kept in sync with changes visually on the page or on the server.
      users: [],
      userQuery: "",
      residents: [],
      residentQuery: "",
    };
  }

  componentDidMount() {
    get("/api/users").then((users) => {
      this.setState({ users });
    });
    get("/api/residents").then((residents) => {
      this.setState({ residents });
    });
  }

  render() {
    var adminPanel = (
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
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
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
