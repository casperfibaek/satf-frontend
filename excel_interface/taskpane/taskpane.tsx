import { prependOnceListener } from "process";

const { ReactDOM, React, FluentUIReact } = window; // eslint-disable-line

const LoginPage = (props) => {
  const { username, password } = props
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
          value={username}
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
          value={password}
          required
        ></input>
        <button type="submit" onClick={(e) => { props.onLogin(e) }}>
          Login
          </button>
      </form>
      <div>
        <button onClick={() => { props.onRegister() }}>Register User</button>
      </div>
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

const RegisterPage = (props) => {
  const { registerUsername, registerPassword, registerConfirm } = props
  return (
    <div>
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
            value={registerUsername}
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
            value={registerPassword}
            required
          ></input>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirm"
            onChange={(e) => { props.onInput(e) }}
            value={registerConfirm}
            required
          ></input>
          <button type="submit" onClick={(e) => { props.onCreate(e) }}>
            Register User
          </button>
          <button type="submit" onClick={() => { props.onBack() }}>
            Back to Login
          </button>
        </form>
        <h1>{registerUsername}</h1>
        <h1>{registerPassword}</h1>
        <h1>{registerConfirm}</h1>
        {/* <h1><a onClick={this.registerUser}></a></h1> */}
      </div>

    </div>
  )
}

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // page: { loggedIn: false, registerPage: false },
      // inputs: { user: "", password: "" },
      username: '',
      password: '',
      loggedIn: false,
      registerPage: false,
      registerUsername: '',
      registerPassword: '',
      registerConfirm: '',

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.attemptLogIn = this.attemptLogIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toRegisterPage = this.toRegisterPage.bind(this);
    this.toWelcomePage = this.toWelcomePage.bind(this);
    this.register = this.register.bind(this)
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

  toRegisterPage() {
    this.setState({
      // page: { loggedIn: false, registerPage: false },
      // inputs: { user: "", password: "" },
      username: '',
      password: '',
      loggedIn: false,
      registerPage: true,
      registerUsername: '',
      registerPassword: '',
      registerConfirm: '',
    })
  }

  toWelcomePage() {
    this.setState({

      // username: this,
      // username used for login welcome message
      password: '',
      loggedIn: true,
      registerPage: false,
      registerUsername: '',
      registerPassword: '',
      registerConfirm: '',
    })
  }

  handleRegister() {
    const { registerUsername, registerPassword, registerConfirm } = this.state

    this.register(registerUsername, registerPassword, registerConfirm)
  }

  async register(username, password, confirm) {
    try {
      const response = await fetch('https://satf.azurewebsites.net/api/create_user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirm }),
      });

      const responseJSON = await response.json();
      this.toWelcomePage()
      return responseJSON;

    } catch (err) {
      throw Error(err);
    }
  }

  async delete_user(token) {
    try {
      const response = await fetch('https://satf.azurewebsites.net/api/delete_user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const responseJSON = await response.json();

      return responseJSON;
    } catch (err) {
      throw Error(err);
    }
  }

  handleLogout() {
    this.logOut()
  }

  logOut() {
    this.setState({
      username: '',
      password: '',
      loggedIn: false,
      registerPage: false,
      registerUsername: '',
      registerPassword: '',
      registerConfirm: '',
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



  renderLogic() {
    const { registerUsername, registerPassword, registerConfirm, username, password, registerPage, loggedIn } = this.state
    if (registerPage) {
      return (
        <RegisterPage
          registerUsername={registerUsername}
          registerPassword={registerPassword}
          registerConfirm={registerConfirm}
          onInput={this.handleChange}
          onCreate={this.handleRegister}
          onBack={this.logOut}
        >
        </RegisterPage>
      )
    } else if (loggedIn) {
      return (
        <WelcomePage
          username={username}
          onLogout={this.handleLogout}
        />
      )
    } else if (!loggedIn) {
      return (
        <LoginPage
          username={username}
          password={password}
          onInput={this.handleChange}
          onLogin={this.handleLogin}
          onRegister={this.toRegisterPage}
        />
      )
    }


  }

  render() {

    return (
      <div>
        {this.renderLogic()}
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
  document.getElementById('root'),
);
