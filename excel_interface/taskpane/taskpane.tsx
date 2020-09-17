import { prependOnceListener } from "process";

const { ReactDOM, React, FluentUIReact } = window; // eslint-disable-line

const LoginPage = (props) => {
  const username = props.username
  const password = props.password
  return (
    <div>
      <form>
        <label htmlFor="username">
          <b>Username</b>
        </label>

        <input
          type="text"
          placeholder="Enter Username"
          name="username"
          onChange={(e) => { props.onInput(e) }}
          value={props.username}
          required
        ></input>
        <label htmlFor="password">
          <b>Password</b>
        </label>

        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          onChange={(e) => { props.onInput(e) }}
          value={props.password}
          required
        ></input>
        <button type="submit" onClick={(e) => { props.onLogin(e) }}>
          Login
          </button>
      </form>
      <h1>{username}</h1>
      <h1>{password}</h1>
      {/* <h1><a onClick={this.registerUser}></a></h1> */}
    </div>
  )

}

const WelcomePage = (props) => {

  return (
    <div>
      <h1>Welcome {props.username}</h1>
      <h2>you are now successfully logged in</h2>
      <button type="submit" onClick={() => { props.onLogout() }}>
        Logout
      </button>
    </div>
  )
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // page: { loggedIn: false, registerPage: false },
      // inputs: { user: "", password: "" },
      username: '',
      password: '',
      loggedIn: false,
      register: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.attemptLogIn = this.attemptLogIn.bind(this);
    this.logOut = this.logOut.bind(this)
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
        'https://satf.azurewebsites.net/api/login_user',
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        },
      );

      const responseJSON = await response.json();

      localStorage.setItem(
        'token',
        `${responseJSON.username}:${responseJSON.token}`,
      );

      if (response.ok) {
        this.setState({
          loggedIn: true,
        });
      }
    } catch (err) {
      console.log('there was an error');
      // throw Error(err);
    }
  }

  // async register(username, password, confirm) {
  //   try {
  //     const response = await fetch('https://satf.azurewebsites.net/api/create_user', {
  //       method: 'post',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password, confirm }),
  //     });

  //     const responseJSON = await response.json();

  //     return responseJSON;
  //   } catch (err) {
  //     throw Error(err);
  //   }
  // }

  handleLogout() {
    this.logOut()
  }

  logOut() {
    this.setState({
      username: '',
      password: '',
      loggedIn: false,
    });
  }

  handleLogin(e) {
    e.preventDefault();
    const { username, password } = this.state;
    this.attemptLogIn(username, password);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    // const registerPage = (

    // )

    return this.state.loggedIn ?
      <WelcomePage
        username={this.state.username}
        onLogout={this.handleLogout}
      />
      :
      <LoginPage
        username={this.state.username}
        password={this.state.password}
        onInput={this.handleChange}
        onLogin={this.handleLogin}
      />;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById('root'),
);
