import React, { Component } from "react";
import { Button, Input, Dropdown } from "semantic-ui-react";
import { post } from "../../utilities";

const locations = [
  { key: 0, value: "BG", text: "BG" },
  { key: 1, value: "B1", text: "B1" },
  { key: 2, value: "B2", text: "B2" },
  { key: 3, value: "B3", text: "B3" },
  { key: 4, value: "B4", text: "B4" },
  { key: 5, value: "B5", text: "B5" },
  { key: 6, value: "B6", text: "B6" },
  { key: 7, value: "Floor", text: "Floor" },
  { key: 8, value: "At desk", text: "At desk" },
  { key: 9, value: "Perishable", text: "Perishable" },
];

class Checkin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kerberos: null,
      location: null,
      trackingNumber: null,
    };
  }

  componentDidMount() {}

  handleSubmit = () => {
    post("/api/checkin", {
      kerberos: this.state.kerberos,
      location: this.state.location,
      trackingNumber: this.state.trackingNumber,
    }).then((res) => console.log(res));
  };

  render() {
    return (
      <>
        <h1>Check in packages</h1>
        <Dropdown
          placeholder="Resident"
          search
          selection
          onChange={(e, { value }) => this.setState({ kerberos: value })}
          options={this.props.residents}
        />
        <Dropdown
          placeholder="Location"
          selection
          onChange={(e, { value }) => this.setState({ location: value })}
          options={locations}
        />
        <Input
          placeholder="Tracking number"
          onChange={(event) => this.setState({ trackingNumber: event.target.value })}
        />
        <br />
        <Button negative onClick={this.props.closeCheckIn}>
          Cancel
        </Button>
        <Button
          positive
          content="Check in"
          icon="checkmark"
          labelPosition="right"
          disabled={null}
          onClick={this.handleSubmit}
        />
      </>
    );
  }
}

export default Checkin;
