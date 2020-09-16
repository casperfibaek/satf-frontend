import React from "../assets/react.development.js";
import ReactDOM from "../assets/react-dom.development.js";
import FluentUIReact from "../assets/fluentui-react.min.js";

const { ReactDOM, React, FluentUIReact } = window as any; // eslint-disable-line

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // page: { loggedIn: false, registerPage: false },
      // inputs: { user: "", password: "" },
      user: "",
      password: "",
      loggedIn: false,
      register: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.attemptLogIn = this.attemptLogIn.bind(this);
  }

  // componentDidMount() {
  //   Office.initialize = () => {
  //     // Determine user's version of Office
  //     if (!Office.context.requirements.isSetSupported("ExcelApi", "1.7")) {
  //       console.log(
  //         "Sorry. The add-in uses Excel.js APIs that are not available in your version of Office."
  //       );
  //     }
  //   };
  // }

  async attemptLogIn(username, password) {
    try {
      const response = await fetch(
        "https://satf.azurewebsites.net/api/login_user",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const responseJSON = await response.json();

      localStorage.setItem(
        "token",
        `${responseJSON.username}:${responseJSON.token}`
      );

      if (response.ok) {
        this.setState({
          loggedIn: true,
        });
      }
    } catch (err) {
      console.log("there was an error");
      // throw Error(err);
    }
  }

  logOut() {
    this.setState({
      loggedIn: false,
    });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    switch (e.target.id) {
      case "logIn":
        const username = this.state.user;
        const password = this.state.password;
        this.attemptLogIn(username, password);
        break;
      case "logOut":
        this.logOut();
        break;
      default:
      // do nothing
    }
  }

  render() {
    const loginPage = (
      <div>
        <form>
          <label htmlFor="user">
            <b>Username</b>
          </label>

          <input
            type="text"
            placeholder="Enter Username"
            name="user"
            onChange={this.handleChange}
            value={this.state.user}
            required
          ></input>
          <label htmlFor="password">
            <b>Password</b>
          </label>

          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
            required
          ></input>
          <button id="logIn" type="submit" onClick={this.handleSubmit}>
            Login
          </button>
        </form>
      </div>
    );
    const welcomePage = (
      <div>
        <h1>Welcome {this.state.user}</h1>
        <h2>you are now successfully logged in</h2>
        <button id="logOut" type="submit" onClick={this.handleSubmit}>
          Logout
        </button>
      </div>
    );

    // const registerPage = (

    // )

    return this.state.loggedIn ? welcomePage : loginPage;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById("root")
);
