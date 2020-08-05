import * as React from "react";
import { Router, navigate } from "@reach/router";

import TopNavBar from "~modules/TopNavBar";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import AuthController from "~modules/AuthController";

import UserContext from "./context/UserContext";

import "~styles/utilities.css";
import "~styles/styles.css";
import { socket } from "~utilities/client-socket";

// import User from "~types/User";

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

  return (
    <div className="app-container">
      <UserContext.Provider value={user}>
        <TopNavBar
          authController={
            <AuthController logout={handleLogout} loggedIn={!!user} setUser={setUser} />
          }
        />
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
