import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react'; // eslint-disable-line
import { MemoryRouter as Router, Switch, Route, Redirect, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Fabric, loadTheme } from '@fluentui/react';
import Support from './components/support';
import Documentation from './components/documentation';
import Map from './components/map';
import Login from './components/login';
import Install from './components/install';
import { excelTheme } from './utils';
Office.onReady().then(() => {
    console.log('Office ready from app.js');
});
function Error404Page() { return React.createElement("h2", null, "404: Page not found. You should not end up here."); }
function StartPage() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('page');
    switch (page) {
        case 'map': return '/map';
        case 'install': return '/install';
        case 'support': return '/support';
        case 'documentation': return '/documentation';
        case 'login': return '/login';
        default: return '/404';
    }
}
const startPage = StartPage();
function App() {
    return (React.createElement("div", { id: "app" },
        React.createElement(Router, null,
            React.createElement(Switch, null,
                React.createElement(Route, { exact: true, path: '/install', render: () => (React.createElement(Install, null)) }),
                React.createElement(Route, { exact: true, path: '/map', render: () => (React.createElement(Map, null)) }),
                React.createElement(Route, { exact: true, path: '/support', render: () => (React.createElement(Support, null)) }),
                React.createElement(Route, { exact: true, path: '/documentation', render: () => (React.createElement(Documentation, null)) }),
                React.createElement(Route, { exact: true, path: '/login', render: () => (React.createElement(Login, null)) }),
                React.createElement(Route, { exact: true, path: '/404', render: () => (React.createElement(Error404Page, null)) }),
                React.createElement(Route, { exact: true, path: '/', render: () => (React.createElement(Redirect, { to: startPage })) })))));
}
loadTheme(excelTheme);
ReactDOM.render(React.createElement(React.StrictMode, null,
    React.createElement(Fabric, null,
        React.createElement(App, null))), document.getElementById('root'));
//# sourceMappingURL=app.js.map