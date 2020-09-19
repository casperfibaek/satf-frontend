import LoginPage from './loginpage.js';
import WelcomePage from './welcomepage.js';
import RegisterPage from './registerpage.js';
import MessageBar from './messageBar.js';
import Spinner from './spinner.js';

async function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

const { ReactDOM, React, FluentUIReact } = window; // eslint-disable-line

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      registerPage: false,
      loading: false,
      loadingMessage: '',
      registerUsername: '',
      registerPassword: '',
      registerConfirm: '',
      displayMessage: false,
      displayMessageText: '',
      displayMessageType: 0,
      satfToken: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.setMessageBar = this.setMessageBar.bind(this);
    this.attemptLogIn = this.attemptLogIn.bind(this);
    this.logOut = this.logOut.bind(this);
    this.toRegisterPage = this.toRegisterPage.bind(this);
    this.toWelcomePage = this.toWelcomePage.bind(this);
    this.toLoginPage = this.toLoginPage.bind(this);
    this.register = this.register.bind(this);
    this.renderLogic = this.renderLogic.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async attemptLogIn(username, password) {
    try {
      this.startLoading('Logging in user..');

      const response = await fetch('../../api/login_user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        this.setState({ satfToken: `${responseJSON.username}:${responseJSON.token}` });
        globalThis.localStorage.setItem('satf_token', this.state.satfToken);
        this.toWelcomePage();
      } else if (responseJSON.message) {
        this.setMessageBar(responseJSON.message, 1);
      } else {
        this.setMessageBar('Unable to login user', 1);
      }
    } catch (err) {
      console.log(err);
      this.setMessageBar('Unable to login user', 1);
    } finally {
      this.stopLoading();
    }
  }

  async register(username, password, confirm) {
    try {
      this.startLoading('Registering user..');

      const response = await fetch('../../api/create_user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirm }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        this.setState({ satfToken: `${responseJSON.username}:${responseJSON.token}` });
        globalThis.localStorage.setItem('satf_token', this.state.satfToken);
        this.setState({ username: this.state.registerUsername, password: this.state.registerPassword });
        this.toWelcomePage();
      } else if (responseJSON.message) {
        this.setMessageBar(responseJSON.message, 1);
      } else {
        this.setMessageBar('Unable to register user', 1);
      }
    } catch (err) {
      console.log(err);
      this.setMessageBar('Unable to register user', 1);
    } finally {
      this.stopLoading();
    }
  }

  async deleteUser(token) {
    try {
      this.startLoading('Deleting user..');

      const response = await fetch('../../api/delete_user', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        this.resetState();
        this.toLoginPage();
        this.setMessageBar('Successfully deleted user', 4);
      } else if (responseJSON.message) {
        this.setMessageBar(responseJSON.message, 1);
      } else {
        this.setMessageBar('Unable to delete user', 1);
      }
    } catch (err) {
      console.log(err);
      this.setMessageBar('Unable to delete user', 1);
    } finally {
      this.stopLoading();
    }
  }

  setMessageBar(message, type) {
    this.setState({
      displayMessage: true,
      displayMessageText: message,
      displayMessageType: type,
    });
  }

  clearMessageBar = () => {
    this.setState({
      displayMessage: false,
      displayMessageText: '',
      displayMessageType: 0,
    });
  }

  startLoading(message) {
    this.clearMessageBar();
    this.setState({
      loading: true,
      loadingMessage: message,
    });
  }

  stopLoading = () => {
    this.setState({
      loading: false,
      loadingMessage: '',
    });
  }

  resetState() {
    globalThis.localStorage.removeItem('satf_token');

    this.setState({
      username: '',
      password: '',
      loggedIn: false,
      registerPage: false,
      loading: false,
      loadingMessage: '',
      registerUsername: '',
      registerPassword: '',
      registerConfirm: '',
      displayMessage: false,
      displayMessageText: '',
      displayMessageType: 0,
    });
  }

  logOut() { this.resetState(); }

  toRegisterPage() {
    this.resetState();
    this.setState({ registerPage: true });
  }

  toWelcomePage() {
    this.setState({
      loggedIn: true,
      registerPage: false,
      displayMessage: false,
      displayMessageText: '',
      displayMessageType: 0,
    });
  }

  toLoginPage() {
    this.resetState();
  }

  handleRegister(e) {
    e.preventDefault();

    this.register(
      this.state.registerUsername,
      this.state.registerPassword,
      this.state.registerConfirm,
    );
  }

  handleDelete() {
    const token = window.localStorage.getItem('token');
    this.deleteUser(token);
  }

  handleLogout() {
    this.logOut();
  }

  handleLogin(e) {
    e.preventDefault();
    this.attemptLogIn(this.state.username, this.state.password);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  }

  renderLogic() {
    if (this.state.registerPage) {
      return (
        <RegisterPage
          registerUsername={this.state.registerUsername}
          registerPassword={this.state.registerPassword}
          registerConfirm={this.state.registerConfirm}
          loading={this.state.loading}
          loadingMessage={this.state.loadingMessage}
          onInput={this.handleChange}
          onCreate={this.handleRegister}
          onBack={this.logOut}
        >
        </RegisterPage>
      );
    } if (this.state.loggedIn) {
      return (
        <WelcomePage
          username={this.state.username}
          onLogout={this.handleLogout}
          onDelete={this.handleDelete}
        />
      );
    } if (!this.state.loggedIn) {
      return (
        <LoginPage
          username={this.state.username}
          password={this.state.password}
          loading={this.state.loading}
          loadingMessage={this.state.loadingMessage}
          onInput={this.handleChange}
          onLogin={this.handleLogin}
          onRegister={this.toRegisterPage}
        />
      );
    }
    return (
      <LoginPage
        username={this.state.username}
        password={this.state.password}
        loading={this.state.loading}
        loadingMessage={this.state.loadingMessage}
        onInput={this.handleChange}
        onLogin={this.handleLogin}
        onRegister={this.toRegisterPage}
      />
    );
  }

  render() {
    return (
      <div id="root_login">
        <FluentUIReact.Image
          src="../assets/images/savings-frontier-banner.png"
          alt="Savings at the Frontier Banner"
          height={300}
        />
        <FluentUIReact.Stack vertical id="stack_login">
          {this.renderLogic()}
          <MessageBar
            displayMessage={this.state.displayMessage}
            displayMessageText={this.state.displayMessageText}
            displayMessageType={this.state.displayMessageType}
          />
          <Spinner loading={this.state.loading} loadingMessage={this.state.loadingMessage}/>
        </FluentUIReact.Stack>
      </div>
    );
  }
}

ReactDOM.render(<React.StrictMode><Login /></React.StrictMode>, document.getElementById('root'));
