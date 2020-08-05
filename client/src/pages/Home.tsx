import * as React from "react";

import AuthController from "../modules/AuthController";
import PackageList from "./PackageList";
import { Message } from "semantic-ui-react";
import UserContext from "~context/UserContext";

import User from "~types/User";
import { RouteComponentProps } from "@reach/router";

const { useContext } = React;

type Props = {
  setUser: (user: User) => void;
  logout: () => void;
};

const Home = (props: Props & RouteComponentProps) => {
  const user = useContext(UserContext);
  const authController = (
    <AuthController
      logout={props.logout}
      loggedIn={!!user}
      setUser={props.setUser}
      providers={["google"]}
    />
  );
  return (
    <div>
      {user ? (
        user.deskworker ? (
          user ? (
            <PackageList />
          ) : null
        ) : (
          <>
            <h1>Packages</h1>
            <Message negative>You must be a desk worker to view this page.</Message>
          </>
        )
      ) : (
        authController
      )}
    </div>
  );
};

export default Home;
