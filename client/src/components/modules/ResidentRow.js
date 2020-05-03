import React, { PureComponent } from "react";
import { Table, Button } from "semantic-ui-react";
import { post } from "../../utilities";

class ResidentRow extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: this.props.resident.current,
    };
  }

  handleDelete = () => {
    post("/api/resident/delete", { id: this.props.resident._id })
      .then((res) => {
        if (res.success) {
          window.location.reload(false);
        } else {
          console.log(res);
        }
      })
      .catch((err) => console.log(err));
  };

  handleToggleCurrent = () => {
    post("/api/resident/current", { id: this.props.resident._id, current: !this.state.current })
      .then(() => this.setState({ current: !this.state.current }))
      .catch((err) => console.log(err));
  };
  render() {
    let email;
    if (this.props.resident.email) {
      email = this.props.resident.email;
    } else {
      email = this.props.resident.kerberos + "@mit.edu";
    }

    return (
      <Table.Row>
        <Table.Cell>{this.props.resident.name}</Table.Cell>
        <Table.Cell>{this.props.resident.kerberos}</Table.Cell>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{this.props.resident.room}</Table.Cell>
        <Table.Cell collapsing>
          <Button onClick={this.handleToggleCurrent} primary={this.state.current}>
            Current
          </Button>
        </Table.Cell>
        <Table.Cell collapsing>
          <Button onClick={this.handleDelete} negative>
            Delete
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ResidentRow;
