import React, { useEffect, useState } from 'react'; // eslint-disable-line
import {
  Text, TextField, Stack, DefaultButton, PrimaryButton, MessageBar, Spinner, Dialog, DialogType, DialogFooter, Persona, PersonaSize,
} from '@fluentui/react';
import { getValueForKey, setValueForKey, removeValueForKey } from '../utils';

const capitalize = (str: any) => {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function testUserAndPassword(username:any, password:any):boolean {
  if (typeof username !== 'string') { return false; }
  if (typeof password !== 'string') { return false; }
  if (username.length < 6) { return false; }
  if (password.length < 6) { return false; }
  return true;
}

function SpinnerComp(props: any) {
  if (props.loading) {
    return (
      <Spinner
        label={props.loadingMessage}
        ariaLive="assertive"
        labelPosition="left"
      />
    );
  }
  return (<div className="spinner_dummy"></div>);
}

function MessageBarComp(props: any) {
  const hideMessageBar = () => {
    props.setDisplayMessage({ show: false, text: '', type: 1 });
  };

  if (props.displayMessageShow) {
    return (
      <MessageBar
        messageBarType={props.displayMessageType}
        isMultiline={false}
        onDismiss={hideMessageBar}
        dismissButtonAriaLabel="Close">
        <span>{props.displayMessageText}</span>
      </MessageBar>
    );
  }
  return (<div className="messagebar-placeholder"></div>);
}

function Taskpane_welcome(props: any) {
  const [modalStatus, setModelStatus] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
  const [displayMessage, setDisplayMessage] = useState({ show: false, text: '', type: 1 });
  const [displayTimer, setDisplayTimer] = useState(false);

  async function onDelete(): Promise<void> {
    try {
      setDisplayMessage({ show: false, text: '', type: 1 });
      setLoadingStatus({ show: true, text: 'Delete..' });

      const token = getValueForKey('satf_token');

      const response = await fetch(`${document.location.origin}/api/delete_user`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        props.setUserInfo({ username: '', password: '' });
        removeValueForKey('satf_token');
        props.setCurrentPage({ login: true, register: false, welcome: false });
        setDisplayMessage({ show: true, text: 'Successfully deleted user', type: 4 });
      } else if (responseJSON.message) {
        setDisplayMessage({ show: true, text: responseJSON.message, type: 1 });
      } else {
        setDisplayMessage({ show: true, text: 'Unable to delete user', type: 1 });
      }
    } catch (err) {
      console.log(err);
      setDisplayMessage({ show: true, text: 'Unable to delete user', type: 1 });
    } finally {
      setModelStatus(true);
      setLoadingStatus({ show: false, text: '' });
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      Office.addin.hide();
      setDisplayTimer(true);
      clearTimeout(timer);
    }, 5000);
  });

  function onLogout(): void {
    props.setUserInfo({ username: '', password: '' });
    removeValueForKey('satf_token');
    props.setCurrentPage({ login: true, register: false, welcome: false });
    setDisplayMessage({ show: false, text: '', type: 1 });
  }

  return (
    <div>
      <Text variant="xLarge" block className="intro_header">
        Welcome <Persona text={capitalize(props.userInfo.username)} size={PersonaSize.size48} secondaryText='NIRAS A/S' initialsColor="#217346" />
      </Text>

      <Text variant="medium" block className="intro_text">
        You are now successfully logged in and able to use the Savings at the Frontier custom functions and mapping functionality.
      </Text>

      <Text variant="medium" block className="intro_text" hidden={displayTimer}>
        The sidepane will close in 5 seconds.
      </Text>

      <MessageBarComp className="messagebar"
        displayMessageShow={displayMessage.show}
        displayMessageText={displayMessage.text}
        displayMessageType={displayMessage.type}
        setDisplayMessage={setDisplayMessage}
      />

      <div className="button_holder">
        <DefaultButton
          text="Logout"
          onClick={() => { onLogout(); }}
          allowDisabledFocus
        />
        <PrimaryButton
          text="Delete User"
          onClick={() => { setModelStatus(false); }}
          allowDisabledFocus
        />
      </div>
      <Dialog
        hidden={modalStatus}
        dialogContentProps={{
          type: DialogType.normal,
          title: 'Delete User',
          subText: 'Are you sure you want to delete this user? This action cannot be undone.',
        }}
        modalProps={{ isBlocking: false }}
      >
        <DialogFooter>
          <SpinnerComp className="spinner" loading={loadingStatus.show} loadingMessage={loadingStatus.text}/>
          <PrimaryButton text="Yes" onClick={() => { if (!loadingStatus.show) { onDelete(); } }} />
          <DefaultButton text="No" onClick={() => { if (!loadingStatus.show) { setModelStatus(true); } }} />
        </DialogFooter>
      </Dialog>
    </div>
  );
}

function Taskpane_register(props: any) {
  const [username, setUsername] = useState(props.userInfo.username);
  const [password, setPassword] = useState(props.userInfo.password);
  const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
  const [displayMessage, setDisplayMessage] = useState({ show: false, text: '', type: 1 });
  const [confirm, setConfirm] = useState('');

  function onBack() {
    setDisplayMessage({ show: false, text: '', type: 1 });
    props.setCurrentPage({ login: true, register: false, welcome: false });
    props.setUserInfo({ username, password });
  }

  async function onRegister() {
    if (!testUserAndPassword(username, password)) {
      setDisplayMessage({ show: true, text: 'Username and password must be at least 6 characters.', type: 1 });
      return;
    } if (password !== confirm) {
      setDisplayMessage({ show: true, text: 'Passwords do not match.', type: 1 });
      return;
    }
    try {
      setDisplayMessage({ show: false, text: '', type: 1 });
      setLoadingStatus({ show: true, text: 'Register..' });

      const response = await fetch(`${document.location.origin}/api/create_user`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, confirm }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        props.setUserInfo({ username, password });
        setValueForKey('satf_token', `${responseJSON.username}:${responseJSON.token}`);
        props.setCurrentPage({ login: false, register: false, welcome: true });
      } else if (responseJSON.message) {
        setDisplayMessage({ show: true, text: responseJSON.message, type: 1 });
      } else {
        setDisplayMessage({ show: true, text: 'Unable to register user', type: 1 });
      }
    } catch (err) {
      console.log(err);
      setDisplayMessage({ show: true, text: 'Unable to register user', type: 1 });
    } finally {
      setLoadingStatus({ show: false, text: '' });
    }
  }

  function onEnter(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') { onRegister(); }
  }

  return (
    <div onKeyPress={onEnter}>
        <Text variant="large" block className="intro_text">Register</Text>
      <form>
        <TextField
          label="Username"
          htmlFor="username"
          type="text"
          placeholder="Enter Username"
          name="registerUsername"
          autoComplete="username"
          value={username}
          onChange={(e) => { setUsername((e.target as HTMLTextAreaElement).value); }}
          required
        ></TextField>

        <TextField
          label="Password"
          htmlFor="password"
          type="password"
          placeholder="Enter Password"
          name="registerPassword"
          autoComplete="new-password"
          value={password}
          onChange={(e) => { setPassword((e.target as HTMLTextAreaElement).value); }}
          required
        ></TextField>

        <TextField
          label="Password"
          htmlFor="password"
          type="password"
          placeholder="Confirm Password"
          name="registerConfirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => { setConfirm((e.target as HTMLTextAreaElement).value); }}
          required
        ></TextField>
        <MessageBarComp className="messagebar"
          displayMessageShow={displayMessage.show}
          displayMessageText={displayMessage.text}
          displayMessageType={displayMessage.type}
          setDisplayMessage={setDisplayMessage}
        />
      </form>
      <div className="button_holder">
        <SpinnerComp className="spinner" loading={loadingStatus.show} loadingMessage={loadingStatus.text}/>
        <DefaultButton
          text="Back"
          onClick={() => { if (!loadingStatus.show) { onBack(); } }}
          allowDisabledFocus
        />
        <PrimaryButton
          text="Register User"
          onClick={() => { onRegister(); }}
          allowDisabledFocus
        />
      </div>
    </div>
  );
}

function Taskpane_login(props: any) {
  const [username, setUsername] = useState(props.userInfo.username);
  const [password, setPassword] = useState(props.userInfo.password);
  const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
  const [displayMessage, setDisplayMessage] = useState({ show: false, text: '', type: 1 });

  const onRegisterPage = () => {
    setDisplayMessage({ show: false, text: '', type: 1 });
    props.setCurrentPage({ login: false, register: true, welcome: false });
    props.setUserInfo({ username, password });
  };

  async function onLogin() {
    if (!testUserAndPassword(username, password)) {
      setDisplayMessage({ show: true, text: 'Username and password must be at least 6 characters.', type: 1 });
      return;
    }
    try {
      setDisplayMessage({ show: false, text: '', type: 1 });
      setLoadingStatus({ show: true, text: 'Login..' });

      const response = await fetch(`${document.location.origin}/api/login_user`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const responseJSON = await response.json();

      if (response.ok) {
        props.setUserInfo({ username, password });
        setValueForKey('satf_token', `${responseJSON.username}:${responseJSON.token}`);
        props.setCurrentPage({ login: false, register: false, welcome: true });
      } else if (responseJSON.message) {
        setDisplayMessage({ show: true, text: responseJSON.message, type: 1 });
      } else {
        setDisplayMessage({ show: true, text: 'Unable to login user', type: 1 });
      }
    } catch (err) {
      console.log(err);
      setDisplayMessage({ show: true, text: 'Unable to login user', type: 1 });
    } finally {
      setLoadingStatus({ show: false, text: '' });
    }
  }

  function onEnter(event: React.KeyboardEvent) {
    if (event.key === 'Enter') { onLogin(); }
  }

  return (
     <div onKeyPress={onEnter}>
         <Text variant="large" block className="intro_text">Login User</Text>
         <form>
            <TextField
               label="Username"
               htmlFor="username"
               type="text"
               placeholder="Enter Username"
               name="username"
               autoComplete="username"
               value={username}
               onChange={(e) => { setUsername((e.target as HTMLTextAreaElement).value); }}
               required
            ></TextField>

            <TextField
               label="Password"
               htmlFor="password"
               type="password"
               placeholder="Enter Password"
               name="password"
               autoComplete="current-password"
               value={password}
               onChange={(e) => { setPassword((e.target as HTMLTextAreaElement).value); }}
               required
            ></TextField>

            <MessageBarComp className="messagebar"
              displayMessageShow={displayMessage.show}
              displayMessageText={displayMessage.text}
              displayMessageType={displayMessage.type}
              setDisplayMessage={setDisplayMessage}
            />
         </form>
         <div className="button_holder">
            <SpinnerComp className="spinner" loading={loadingStatus.show} loadingMessage={loadingStatus.text}/>
            <DefaultButton text="Register" onClick={() => { if (!loadingStatus.show) { onRegisterPage(); } } } allowDisabledFocus />
            <PrimaryButton text="Login" onClick={() => { onLogin(); } } allowDisabledFocus />
         </div>
      </div >
  );
}

function Taskpane(): any {
  document.title = 'Taskpane';

  const [currentPage, setCurrentPage] = useState({ login: true, register: false, welcome: false });
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });

  function renderLogic() {
    if (currentPage.register) {
      return (<Taskpane_register
        userInfo={userInfo}
        setCurrentPage={setCurrentPage}
        setUserInfo={setUserInfo}
      />);
    } if (currentPage.welcome) {
      return (<Taskpane_welcome
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        setCurrentPage={setCurrentPage}
      />);
    }
    return (<Taskpane_login
      userInfo={userInfo}
      setCurrentPage={setCurrentPage}
      setUserInfo={setUserInfo}
    />);
  }

  return (
    <div id="taskpane_body">
      <div className="pseudo_image">
        <Text variant="xLarge" block>Savings at the Frontier</Text>
      </div>
      <Stack className="form_holder">
        {renderLogic()}
      </Stack>
    </div>
  );
}

export default Taskpane;
