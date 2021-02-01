import * as React from "react";
import AdminRequiredMessage from "~modules/AdminRequiredMessage";

import UserContext from "~context/UserContext";

import { RouteComponentProps } from "@reach/router";
import { ResidentListSection } from "./ResidentListSection";
import { UserListSection } from "./UserListSection";

const { useContext } = React;

const AdminPanel = (_props: RouteComponentProps) => {
  const user = useContext(UserContext);

  const adminPanel = (
    <>
      <h2>Settings</h2>
      <UserListSection />
      <ResidentListSection />
    </>
  );

  return (
    <div>
      <h1>Admin Panel</h1>
      {user?.admin ? adminPanel : <AdminRequiredMessage />}
    </div>
  );
};

export default AdminPanel;
