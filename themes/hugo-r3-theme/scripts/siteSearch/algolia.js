import React from "react";
import ReactDOM from "react-dom";
import { App } from "./app";

export function attach() {
    ReactDOM.render(<App />, document.getElementById("r3-react-target"));
}
