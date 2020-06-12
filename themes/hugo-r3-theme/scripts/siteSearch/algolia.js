import React from "react";
import ReactDOM from "react-dom";
import App from "./app.jsx";

export function attach() {
    let params = {};
    document.location.search.substr(1).split('&').forEach(pair => {
        let [key, value] = pair.split('=');
        params[key] = value;
    });

    ReactDOM.render(<App query={params["q"]} />, document.getElementById("r3-react-target"));
}
