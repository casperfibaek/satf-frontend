import React, { useState } from 'react'; // eslint-disable-line
import {
  Text, DefaultButton, PrimaryButton, Dialog, DialogType, DialogFooter, Persona, PersonaSize,
} from '@fluentui/react';
import {
  getValueForKey,  removeValueForKey, getApiUrl,
} from '../../utils';

import capitalize from './capitalize';

import SpinnerComp from './spinner_comp';
import MessageBarComp from './message_bar_comp';

import { useHistory } from "react-router-dom"


export default function Welcome(props: any) {
    const [modalStatus, setModalStatus] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
    const [displayMessage, setDisplayMessage] = useState({ show: false, text: '', type: 1 });
  
    async function onDelete(): Promise<void> {
      try {
        setDisplayMessage({ show: false, text: '', type: 1 });
        setLoadingStatus({ show: true, text: 'Delete..' });
  
        const token = getValueForKey('satf_token');
  
        const response = await fetch(`${getApiUrl()}/delete_user`, {
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
        setModalStatus(true);
        setLoadingStatus({ show: false, text: '' });
      }
    }
  
    function onLogout(): void {
      props.setUserInfo({ username: '', password: '' });
      removeValueForKey('satf_token');
      props.setCurrentPage({ login: true, register: false, welcome: false });
      setDisplayMessage({ show: false, text: '', type: 1 });
    }
  
    const history = useHistory();
  
    function handleToGeoms() {
      history.push("/get_user_geoms");
    }
  
    return (
      <div>
        <Text variant="xLarge" block className="intro_header">
          Welcome <Persona text={capitalize(props.userInfo.username)} size={PersonaSize.size48} secondaryText='NIRAS A/S' initialsColor="#217346" />
        </Text>
  
        <Text variant="medium" block className="intro_text">
          You are now successfully logged in and able to use the Savings at the Frontier custom functions and mapping functionality.
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
            onClick={() => { setModalStatus(false); }}
            allowDisabledFocus
          />
          <PrimaryButton
            text="Data"
            onClick={handleToGeoms}
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
            <DefaultButton text="No" onClick={() => { if (!loadingStatus.show) { setModalStatus(true); } }} />
          </DialogFooter>
        </Dialog>
      </div>
    );
  }