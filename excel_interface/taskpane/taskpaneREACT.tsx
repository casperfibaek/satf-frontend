// import React from "react";
// import { getTheme } from "@fluentui/react";

import React from "../assets/react.development.js";
import ReactDOM from "../assets/react-dom.development.js";
import FluentUIReact from "../assets/fluentui-react.min.js";

const { ReactDOM, React, FluentUIReact } = window as any; // eslint-disable-line

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page = { loggedIn: false, registerPage: false },
      inputs = { user: "", password: "" },
    };
  }

  render() {
    return (
      <div>
        <form>
          <label for="user">
            <b>Username</b>
          </label>
          <input
            type="text"
            placeholder="Enter Username"
            name="user"
            required
          ></input>
          <label for="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            required
          ></input>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById("root")
);
