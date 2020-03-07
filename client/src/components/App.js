import React, { Component } from "react";
import { Router, navigate, Match } from "@reach/router";
import { Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

import Home from "./pages/Home.js";
import AdminPanel from "./pages/AdminPanel.js";
import NotFound from "./pages/NotFound.js";
import AuthController from "./modules/AuthController.js";

import "../utilities.css";
import { socket } from "../client-socket.js";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
    socket.on("user", (user) => {
      this.setState({ user });
    });
  }

  componentDidMount() {}

  setUser = (user) => {
    this.setState({ user });
  };

  handleLogout = () => {
    this.setState({ user: undefined });
    navigate("/");
  };

  render() {
    const authController = (
      <AuthController
        logout={this.handleLogout}
        loggedIn={this.state.user !== undefined}
        setUser={this.setUser}
        providers={["google"]}
      />
    );
    return (
      <div className="app-container">
        <header>
          <h1 className="header">
            <FontAwesomeIcon icon={faBoxOpen} className="header-icon" />
            Maseeh Desk
          </h1>
          {this.state.user && (
            <div className="header-buttons">
              {this.state.user.admin && (
                <Match path="/admin">
                  {(props) =>
                    props.match ? (
                      <Button className="header-admin" onClick={() => navigate("/")}>
                        Packages
                      </Button>
                    ) : (
                      <Button className="header-admin" onClick={() => navigate("/admin")}>
                        Admin panel
                      </Button>
                    )
                  }
                </Match>
              )}
              {authController}
            </div>
          )}
        </header>
        <Router>
          <Home path="/" setUser={this.setUser} logout={this.handleLogout} user={this.state.user} />
          <AdminPanel path="/admin" user={this.state.user} />
          <NotFound default />
        </Router>
        <footer>
          <p className="footer-content">Questions or comments? Email maseeh-webtech@mit.edu!</p>
        </footer>
      </div>
    );
  }
}

export default App;
