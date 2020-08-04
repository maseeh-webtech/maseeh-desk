import * as React from "react";
import User from "../types/User";

const UserContext = React.createContext<User | null>(null);

export default UserContext;
