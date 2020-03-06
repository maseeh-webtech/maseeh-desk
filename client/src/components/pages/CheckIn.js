import React, { Component, PureComponent } from "react";
import { Button, Input, Dropdown, Form } from "semantic-ui-react";
import { post } from "../../utilities";

const locations = [
  { key: 0, value: "At desk", text: "At desk" },
  { key: 1, value: "Floor", text: "Floor" },
  { key: 2, value: "Perishable", text: "Perishable" },
  { key: 3, value: "BG", text: "BG" },
  { key: 4, value: "B1", text: "B1" },
  { key: 5, value: "B2", text: "B2" },
  { key: 6, value: "B3", text: "B3" },
  { key: 7, value: "B4", text: "B4" },
  { key: 8, value: "B5", text: "B5" },
  { key: 9, value: "B6", text: "B6" },
];

// As small as this component is, PureComponent is a necessary performance
//   optimization, since the long residents list takes long enough to rerender
//   that typing in the tracking number box feels glacial.
class ResidentDropdown extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Dropdown
        placeholder="Resident"
        search
        selection
        fluid
        onChange={(e, { value }) => this.props.setKerb(value)}
        options={this.props.residents}
        value={this.props.kerberos}
      />
    );
  }
}

class Checkin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kerberos: null,
      location: null,
      trackingNumber: "",
      disableCheckin: false,
    };
  }

  componentDidMount() {}

  handleSubmit = () => {
    this.setState({ disableCheckin: true });
    post("/api/checkin", {
      kerberos: this.state.kerberos,
      location: this.state.location,
      trackingNumber: this.state.trackingNumber,
    }).then((res) => {
      this.props.addPackage(res);
      this.setState({
        kerberos: null,
        location: null,
        trackingNumber: "",
        disableCheckin: false,
      });
    });
  };

  setKerb = (newKerb) => {
    this.setState({ kerberos: newKerb });
  };

  render() {
    return (
      <>
        <Form className="checkin-container">
          <h1>
            Check in packages{" "}
            <div className="checkin-close">
              <Button onClick={this.props.closeCheckIn}>Close</Button>
            </div>
          </h1>
          <div className="checkin-form checkin-resident">
            <ResidentDropdown
              className="checkin-resident"
              residents={this.props.residents}
              kerberos={this.state.kerberos}
              setKerb={this.setKerb}
            />
          </div>
          <div className="checkin-form">
            <Dropdown
              className="checkin-location"
              placeholder="Location"
              selection
              onChange={(e, { value }) => this.setState({ location: value })}
              options={locations}
              value={this.state.location}
            />
          </div>
          <div className="checkin-form">
            <Input
              className="checkin-tracking"
              placeholder="Tracking number"
              onChange={(event) => this.setState({ trackingNumber: event.target.value })}
              value={this.state.trackingNumber}
            />
          </div>
          <div className="checkin-form">
            <Button
              className="checkin-form checkin-submit"
              positive
              content="Check in"
              icon="checkmark"
              labelPosition="right"
              disabled={
                !this.state.kerberos ||
                !this.state.location ||
                !this.state.trackingNumber ||
                this.state.disableCheckin
              }
              onClick={this.handleSubmit}
            />
          </div>
        </Form>
      </>
    );
  }
}

export default Checkin;
