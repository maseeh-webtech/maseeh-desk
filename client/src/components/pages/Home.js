import React, { Component } from "react";

import "../../utilities.css";
import "./styles.css";
import AuthController from "../modules/AuthController";
import PackageList from "./PackageList";
import { Message } from "semantic-ui-react";

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
      <div className="app-container">
        {this.props.user ? (
          this.props.user.deskworker ? (
            this.props.user ? (
              <PackageList />
            ) : null
          ) : (
            <>
              <h1>Packages</h1>
              <Message negative>You must be an desk worker to view this page.</Message>
            </>
          )
        ) : (
          authController
        )}
      </div>
    );
  }
}

export default Home;
