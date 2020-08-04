import * as React from "react";
import { Router, navigate, Match } from "@reach/router";
import { Button } from "semantic-ui-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";

import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import AuthController from "./modules/AuthController";
import UserContext from "../context/UserContext";

import "../utilities.css";
import { socket } from "../client-socket";

import User from "../types/User";

const App = () => {
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    socket.on("user", (user: User) => {
      setUser(user);
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const authController = (
    <AuthController logout={handleLogout} loggedIn={!!user} setUser={setUser} />
  );

  return (
    <div className="app-container">
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
      <UserContext.Provider value={user}>
        <Router>
          <Home path="/" setUser={setUser} logout={handleLogout} />
          <AdminPanel path="/admin" />
          <NotFound default />
        </Router>
      </UserContext.Provider>
      <footer>
        <p className="footer-content">Questions or comments? Email maseeh-webtech@mit.edu!</p>
      </footer>
    </div>
  );
};

export default App;
