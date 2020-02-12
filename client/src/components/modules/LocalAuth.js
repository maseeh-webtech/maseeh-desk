import React, { Component } from "react";
import { post } from "../../utilities.js";
import { Button, Input } from "semantic-ui-react";

class LocalAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
      isRegistering: false,
      errorMessage: "",
    };
  }

  componentDidMount() {}

  handleChange = (evt) => {
    this.setState({ [evt.target.name]: evt.target.value });
  };

  attemptLogin = () => {
    const { email, password } = this.state;
    if (email === "" || password === "") {
      this.setState({ errorMessage: "Must have non-empty usename/password" });
    } else {
      post("/auth/login", { email, password })
        .then((user) => {
          this.props.login(user);
        })
        .catch((error) => {
          if (error.status === 401) {
            this.setState({ errorMessage: "Incorrect username or password" });
          }
        });
    }
  };

  attemptRegister = () => {
    const { email, password, passwordConfirm } = this.state;
    if (password != passwordConfirm) {
      this.setState({ errorMessage: "Passwords don't match" });
    } else if (email === "" || password === "") {
      this.setState({ errorMessage: "Cannot have an empty username or password!" });
    } else {
      post("/auth/register", { email, password })
        .then((user) => {
          this.props.login(user);
        })
        .catch((error) => {
          if (error.status === 403) {
            this.setState({ errorMessage: "Email already exists" });
          }
        });
    }
  };

  toggleRegistrationStatus = () => {
    this.setState({ isRegistering: !this.state.isRegistering });
  };

  render() {
    return (
      <div>
        <Input onChange={this.handleChange} type="email" name="email" placeholder="Email" />
        <Input
          onChange={this.handleChange}
          type="password"
          name="password"
          placeholder="Password"
        />
        {this.state.isRegistering ? (
          <>
            <Input
              onChange={this.handleChange}
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
            />

            <Button content="Register" onClick={this.attemptRegister} />
            <Button content="Have an account?" onClick={this.toggleRegistrationStatus} />
          </>
        ) : (
          <>
            <Button content="Log in" className="login-button" onClick={this.attemptLogin} />
            <Button
              content="Register"
              className="login-button"
              onClick={this.toggleRegistrationStatus}
            />
          </>
        )}
        <div>{this.state.errorMessage}</div>
      </div>
    );
  }
}

export default LocalAuth;
