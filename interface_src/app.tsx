import 'react-app-polyfill/ie11'; import 'react-app-polyfill/stable';

import React from 'react'; // eslint-disable-line
import {
  MemoryRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Fabric, loadTheme } from '@fluentui/react';

import Support from './components/support';
import Documentation from './components/documentation';
import Map from './components/map/map';
import GettingStarted from './components/getting_started';
import Taskpane from './components/taskpane';
import Home from './components/home';
import './commands';

import { excelTheme, createStateIfDoesntExists, logToServer } from './utils';
import { onMessageFromParent } from './communication';

import { WindowState } from './types';

declare let window: WindowState;

if (!window.sharedState.initialised.app) {
  window.sharedState.initialised.app = true;
  logToServer({ message: 'sharedState', state: window.sharedState.initialised });
  // window.sharedState.hello();
}

createStateIfDoesntExists();
if (!window.state.initialise.office) {
  Office.onReady().then(() => {
    try {
      Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
      window.state.initialise = ({ ...window.state.initialise, ...{ office: true } });
    } catch (error) {
      const message = 'Unable to initialise OfficeJS, is this running inside office?';
      console.log(message);
      logToServer({ message, error });
      console.log(error);
    }
  });
}

function Error404Page(): any { return <h2>404: Page not found. You should not end up here.</h2>; }
function Commands():any { return (<h2>Loading Commands...</h2>); }

function StartPage(): string {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = urlParams.get('page');

  switch (page) {
    case 'map': return '/map';
    case 'home': return '/home';
    case 'support': return '/support';
    case 'commands': return '/commands';
    case 'documentation': return '/documentation';
    case 'getting_started': return '/getting_started';
    case 'taskpane': return '/taskpane';
    default: return '/404';
  }
}

const startPage = StartPage();

function App() {
  return (
    <div id="app">
      <Router>
        <Switch>
          <Route exact path='/' render={() => (<Redirect to={startPage}/>)}/>

          <Route exact path='/home' render={() => (<Home />)} />
          <Route exact path='/map' render={() => (<Map />)} />
          <Route exact path='/support' render={() => (<Support />)} />
          <Route exact path='/commands' render={() => (<Commands />)} />
          <Route exact path='/documentation' render={() => (<Documentation />)} />
          <Route exact path='/getting_started' render={() => (<GettingStarted />)} />
          <Route exact path='/taskpane' render={() => (<Taskpane />)} />
          <Route exact path='/404' render={() => (<Error404Page />)} />

        </Switch>
      </Router>
    </div>
  );
}

loadTheme(excelTheme);

ReactDOM.render(
  <React.StrictMode>
    <Fabric>
      <App/>
    </Fabric>
  </React.StrictMode>,
  document.getElementById('root'),
);
