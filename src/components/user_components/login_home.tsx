import React, { useState } from 'react'; // eslint-disable-line
import {
  Text, TextField, DefaultButton, PrimaryButton,
} from '@fluentui/react';
import {
  getValueForKey, setValueForKey, getApiUrl,
} from '../../utils';
import testUserAndPassword from './test_user_password';

import MessageBarComp from "./message_bar_comp"
import SpinnerComp from "./spinner_comp"


export default function LoginHome(props: any) {
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
  
        const response = await fetch(`${getApiUrl()}/login_user`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        const responseJSON = await response.json();
  
        if (response.ok) {
          props.setUserInfo({ username, password });
          setValueForKey('satf_token', `${responseJSON.username}:${responseJSON.token}`);
          console.log(getValueForKey('satf_token'))
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
              <DefaultButton disabled={true} text="Register" onClick={() => { if (!loadingStatus.show) { onRegisterPage(); } } } allowDisabledFocus />
              <PrimaryButton text="Login" onClick={() => { onLogin(); } } allowDisabledFocus />
           </div>
        </div >
    );
  }

