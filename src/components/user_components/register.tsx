import React, { useState, useEffect } from 'react'; // eslint-disable-line
import {
  Text, TextField, DefaultButton, PrimaryButton, 
} from '@fluentui/react';
import {
  setValueForKey, getApiUrl,
} from '../../utils';
import testUserAndPassword from './test_user_password';

import SpinnerComp from './spinner_comp';
import MessageBarComp from './message_bar_comp';

export default function Register(props: any) {
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
  
        const response = await fetch(`${getApiUrl()}/create_user`, {
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
  