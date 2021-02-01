import * as React from "react";
import { Loader } from "semantic-ui-react";

export const FixedHeightLoader = () => (
  <div className="fixed-height-loader">
    <Loader active inline />
  </div>
);
