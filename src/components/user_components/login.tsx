import React, { useState } from 'react'; // eslint-disable-line
import {
  Text, Stack
} from '@fluentui/react';
import {
  getValueForKey, 
} from '../../utils';


// Components
import Register from './register';
import Welcome from './welcome';
import LoginHome from './login_home';

export default function Login(): any {
  document.title = 'Login';

  const [currentPage, setCurrentPage] = useState({ login: true, register: false, welcome: false });
  const [userInfo, setUserInfo] = useState({ username: '', password: '' });

  function renderLogic() {
    const token = getValueForKey('satf_token');

    if (token !== '' && token !== null && token !== undefined && token.split(':').length === 2) {
      const user = { username: token.split(':')[0], password: '' };

      return (<Welcome
        userInfo={user}
        setUserInfo={setUserInfo}
        setCurrentPage={setCurrentPage}
      />);
    }
    if (currentPage.register) {
      return (<Register
        userInfo={userInfo}
        setCurrentPage={setCurrentPage}
        setUserInfo={setUserInfo}
      />);
    } if (currentPage.welcome) {
      return (<Welcome
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        setCurrentPage={setCurrentPage}
      />);
    }
    return (<LoginHome
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

