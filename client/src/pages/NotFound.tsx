import * as React from "react";

import { RouteComponentProps } from "@reach/router";

const NotFound = (_props: RouteComponentProps) => (
  <div>
    <h1>404 Not Found</h1>
    <p>The page you requested couldn't be found.</p>
  </div>
);

export default NotFound;
