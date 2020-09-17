import { prependOnceListener } from "process";
import LoginPage from './loginpage.js'
import WelcomePage from './welcomepage.js'
import RegisterPage from './registerpage.js'

const { ReactDOM, React, FluentUIReact } = window; // eslint-disable-line

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
    this.handleRegister = this.handleRegister.bind(this);
    this.delete_user = this.delete_user.bind(this)
    this.attemptLogIn = this.attemptLogIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toRegisterPage = this.toRegisterPage.bind(this);
    this.toWelcomePage = this.toWelcomePage.bind(this);
    this.register = this.register.bind(this)
    this.renderLogic = this.renderLogic.bind(this)
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
    console.log(username, password)
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

      console.log(responseJSON)

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
    console.log("click")
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
