import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

import "../../utilities.css";
import "./styles.css";
import AuthController from "../modules/AuthController";
import PackageList from "./PackageList";
import { Button } from "semantic-ui-react";

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
          <header>
            <h1 className="header">
              <FontAwesomeIcon icon={faBoxOpen} className="header-icon" />
              Maseeh Desk
            </h1>
            {this.props.user && (
              <div className="header-buttons">
                {this.props.user.admin && <Button className="header-admin">Admin</Button>}
                {authController}
              </div>
            )}
          </header>
          {!this.props.user && authController}
          {this.props.user ? <PackageList /> : null}
        </div>
        <footer>
          <p className="footer-content">Questions or comments? Email maseeh-webtech@mit.edu!</p>
        </footer>
      </>
    );
  }
}

export default Home;
