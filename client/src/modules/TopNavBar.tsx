import * as React from "react";
import { navigate, Match } from "@reach/router";
import { Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

import UserContext from "~context/UserContext";

const { useContext } = React;

type Props = {
  authController: JSX.Element;
};

const TopNavBar = ({ authController }: Props) => {
  const user = useContext(UserContext);

  return (
    <header>
      <h1 className="header">
        <FontAwesomeIcon icon={faBoxOpen} className="header-icon" />
        Maseeh Desk
      </h1>
      {user && (
        <div className="header-buttons">
          {user.admin && (
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
  );
};

export default TopNavBar;
