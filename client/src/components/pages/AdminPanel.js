import React, { Component } from "react";
import { Table, Message } from "semantic-ui-react";
import { get } from "../../utilities";
import UserRow from "../modules/UserRow.js";

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // The this.state.users array is not kept in sync with changes visually on the page or on the server.
      users: [],
      residents: [],
    };
  }

  componentDidMount() {
    get("/api/users").then((users) => {
      this.setState({ users });
    });
    // get("/api/residents").then((residents) => {
    //   this.setState({ residents });
    // });
  }

  render() {
    var adminPanel = (
      <>
        <h2>Settings</h2>
        <h2>Users</h2>
        <Table>
          <Table.Body>
            {this.state.users.map((user) => {
              return <UserRow key={user.id} user={user} self={this.props.user} />;
            })}
          </Table.Body>
        </Table>
        <h2>Residents</h2>
        <Table>
          <Table.Body>
            {/* {this.state.residents.map((resident) => {
              return <ResidentRow key={resident._id} resident={resident} />;
            })} */}
          </Table.Body>
        </Table>
      </>
    );
    return (
      <div className="app-container">
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
