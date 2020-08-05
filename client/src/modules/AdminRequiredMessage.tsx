import * as React from "react";
import { Message } from "semantic-ui-react";

const AdminRequiredMessage = () => {
  return <Message negative>You must be logged in to view this page.</Message>;
};

export default AdminRequiredMessage;
