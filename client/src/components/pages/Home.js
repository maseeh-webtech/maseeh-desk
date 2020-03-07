import React, { Component } from "react";

import "../../utilities.css";
import "./styles.css";
import AuthController from "../modules/AuthController";
import PackageList from "./PackageList";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const authController = (
      <AuthController
        logout={this.props.logout}
        loggedIn={this.props.user !== undefined}
        setUser={this.props.setUser}
        providers={["google"]}
      />
    );
    return (
      <>
        <div className="app-container">
          {!this.props.user && authController}
          {this.props.user ? <PackageList /> : null}
        </div>
      </>
    );
  }
}

export default Home;
