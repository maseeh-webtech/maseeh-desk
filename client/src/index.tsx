import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";

// renders React Component "Root" into the DOM element with ID "root"
ReactDOM.render(<App />, document.getElementById("root"));

if (module.hot) {
  module.hot.accept();
}
