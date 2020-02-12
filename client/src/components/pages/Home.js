import React, { Component } from "react";

import "../../utilities.css";
import "./Home.css";
import AuthController from "../modules/AuthController";
import PackageList from "./PackageList";

class Home extends Component {
  constructor(props) {
    super(props);
    // Initialize Default State
    this.state = {};
  }

  componentDidMount() {
    // remember -- api calls go here!
  }

  render() {
    return (
      <>
        <AuthController
          logout={this.props.logout}
          loggedIn={this.props.user !== undefined}
          setUser={this.props.setUser}
          providers={["google"]}
        />
        {this.props.user ? <PackageList /> : <h1>Maseeh Desk</h1>}
      </>
    );
  }
}

export default Home;
