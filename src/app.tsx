import 'react-app-polyfill/ie11'; import 'react-app-polyfill/stable';

import React from 'react'; // eslint-disable-line
import {
  MemoryRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Fabric, loadTheme } from '@fluentui/react';

import Support from './components/support';
import Documentation from './components/documentation';
import Map from './components/map';
import Taskpane from './components/taskpane';
import Install from './components/install';

import './commands';

import { excelTheme } from './utils';
import { WindowState } from './types';

declare let window: WindowState;

Office.onReady().then(() => {
  console.log('Office ready from app.js');
});

function Error404Page(): any { return <h2>404: Page not found. You should not end up here.</h2>; }

function StartPage(): string {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = urlParams.get('page');

  switch (page) {
    case 'map': return '/map';
    case 'install': return '/install';
    case 'support': return '/support';
    case 'documentation': return '/documentation';
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

          <Route exact path='/install' render={() => (<Install />)} />
          <Route exact path='/map' render={() => (<Map />)} />
          <Route exact path='/support' render={() => (<Support />)} />
          <Route exact path='/documentation' render={() => (<Documentation />)} />
          <Route exact path='/taskpane' render={() => (<Taskpane />)} />
          <Route exact path='/404' render={() => (<Error404Page />)} />
          <Route exact path='/' render={() => (<Redirect to={startPage}/>)}/>

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
