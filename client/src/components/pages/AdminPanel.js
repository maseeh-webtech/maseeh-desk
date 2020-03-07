import React, { Component } from "react";
import { Table, Modal, Button, Loader, Message } from "semantic-ui-react";
import { get } from "../../utilities";

class AdminPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      residents: [],
    };
  }

  componentDidMount() {
    // Populate the main package list
    get("/api/users").then((users) => {
      this.setState({ users });
    });

    // Populate the resident dropdown
    get("/api/residents").then((residents) => {
      this.setState({ residents });
    });
  }

  render() {
    var adminPanel = (
      <>
        <Table></Table>
      </>
    );
    return (
      <>
        <h1>Admin Panel</h1>
        {this.props.user ? (
          adminPanel
        ) : (
          <Message negative>You must be logged in to view this page.</Message>
        )}
      </>
    );
  }
}

export default AdminPanel;
