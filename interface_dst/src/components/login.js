var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react'; // eslint-disable-line
import { Text, TextField, Stack, DefaultButton, PrimaryButton, MessageBar, Spinner, Dialog, DialogType, DialogFooter, Persona, PersonaSize, } from '@fluentui/react';
import { getValueForKey, setValueForKey, removeValueForKey, getApiUrl, } from '../utils';
const capitalize = (str) => {
    if (typeof str !== 'string')
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};
function testUserAndPassword(username, password) {
    if (typeof username !== 'string') {
        return false;
    }
    if (typeof password !== 'string') {
        return false;
    }
    if (username.length < 6) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    return true;
}
function SpinnerComp(props) {
    if (props.loading) {
        return (React.createElement(Spinner, { label: props.loadingMessage, ariaLive: "assertive", labelPosition: "left" }));
    }
    return (React.createElement("div", { className: "spinner_dummy" }));
}
function MessageBarComp(props) {
    const hideMessageBar = () => {
        props.setDisplayMessage({ show: false, text: '', type: 1 });
    };
    if (props.displayMessageShow) {
        return (React.createElement(MessageBar, { messageBarType: props.displayMessageType, isMultiline: false, onDismiss: hideMessageBar, dismissButtonAriaLabel: "Close" },
            React.createElement("span", null, props.displayMessageText)));
    }
    return (React.createElement("div", { className: "messagebar-placeholder" }));
}
function Welcome(props) {
    const [modalStatus, setModalStatus] = useState(true);
    const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
    const [displayMessage, setDisplayMessage] = useState({ show: false, text: '', type: 1 });
    function onDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                setDisplayMessage({ show: false, text: '', type: 1 });
                setLoadingStatus({ show: true, text: 'Delete..' });
                const token = getValueForKey('satf_token');
                const response = yield fetch(`${getApiUrl()}/delete_user`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                });
                const responseJSON = yield response.json();
                if (response.ok) {
                    props.setUserInfo({ username: '', password: '' });
                    removeValueForKey('satf_token');
                    props.setCurrentPage({ login: true, register: false, welcome: false });
                    setDisplayMessage({ show: true, text: 'Successfully deleted user', type: 4 });
                }
                else if (responseJSON.message) {
                    setDisplayMessage({ show: true, text: responseJSON.message, type: 1 });
                }
                else {
                    setDisplayMessage({ show: true, text: 'Unable to delete user', type: 1 });
                }
            }
            catch (err) {
                console.log(err);
                setDisplayMessage({ show: true, text: 'Unable to delete user', type: 1 });
            }
            finally {
                setModalStatus(true);
                setLoadingStatus({ show: false, text: '' });
            }
        });
    }
    function onLogout() {
        props.setUserInfo({ username: '', password: '' });
        removeValueForKey('satf_token');
        props.setCurrentPage({ login: true, register: false, welcome: false });
        setDisplayMessage({ show: false, text: '', type: 1 });
    }
    return (React.createElement("div", null,
        React.createElement(Text, { variant: "xLarge", block: true, className: "intro_header" },
            "Welcome ",
            React.createElement(Persona, { text: capitalize(props.userInfo.username), size: PersonaSize.size48, secondaryText: 'NIRAS A/S', initialsColor: "#217346" })),
        React.createElement(Text, { variant: "medium", block: true, className: "intro_text" }, "You are now successfully logged in and able to use the Savings at the Frontier custom functions and mapping functionality."),
        React.createElement(MessageBarComp, { className: "messagebar", displayMessageShow: displayMessage.show, displayMessageText: displayMessage.text, displayMessageType: displayMessage.type, setDisplayMessage: setDisplayMessage }),
        React.createElement("div", { className: "button_holder" },
            React.createElement(DefaultButton, { text: "Logout", onClick: () => { onLogout(); }, allowDisabledFocus: true }),
            React.createElement(PrimaryButton, { text: "Delete User", onClick: () => { setModalStatus(false); }, allowDisabledFocus: true })),
        React.createElement(Dialog, { hidden: modalStatus, dialogContentProps: {
                type: DialogType.normal,
                title: 'Delete User',
                subText: 'Are you sure you want to delete this user? This action cannot be undone.',
            }, modalProps: { isBlocking: false } },
            React.createElement(DialogFooter, null,
                React.createElement(SpinnerComp, { className: "spinner", loading: loadingStatus.show, loadingMessage: loadingStatus.text }),
                React.createElement(PrimaryButton, { text: "Yes", onClick: () => { if (!loadingStatus.show) {
                        onDelete();
                    } } }),
                React.createElement(DefaultButton, { text: "No", onClick: () => { if (!loadingStatus.show) {
                        setModalStatus(true);
                    } } })))));
}
function Register(props) {
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
    function onRegister() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!testUserAndPassword(username, password)) {
                setDisplayMessage({ show: true, text: 'Username and password must be at least 6 characters.', type: 1 });
                return;
            }
            if (password !== confirm) {
                setDisplayMessage({ show: true, text: 'Passwords do not match.', type: 1 });
                return;
            }
            try {
                setDisplayMessage({ show: false, text: '', type: 1 });
                setLoadingStatus({ show: true, text: 'Register..' });
                const response = yield fetch(`${getApiUrl()}/create_user`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, confirm }),
                });
                const responseJSON = yield response.json();
                if (response.ok) {
                    props.setUserInfo({ username, password });
                    setValueForKey('satf_token', `${responseJSON.username}:${responseJSON.token}`);
                    props.setCurrentPage({ login: false, register: false, welcome: true });
                }
                else if (responseJSON.message) {
                    setDisplayMessage({ show: true, text: responseJSON.message, type: 1 });
                }
                else {
                    setDisplayMessage({ show: true, text: 'Unable to register user', type: 1 });
                }
            }
            catch (err) {
                console.log(err);
                setDisplayMessage({ show: true, text: 'Unable to register user', type: 1 });
            }
            finally {
                setLoadingStatus({ show: false, text: '' });
            }
        });
    }
    function onEnter(event) {
        if (event.key === 'Enter') {
            onRegister();
        }
    }
    return (React.createElement("div", { onKeyPress: onEnter },
        React.createElement(Text, { variant: "large", block: true, className: "intro_text" }, "Register"),
        React.createElement("form", null,
            React.createElement(TextField, { label: "Username", htmlFor: "username", type: "text", placeholder: "Enter Username", name: "registerUsername", autoComplete: "username", value: username, onChange: (e) => { setUsername(e.target.value); }, required: true }),
            React.createElement(TextField, { label: "Password", htmlFor: "password", type: "password", placeholder: "Enter Password", name: "registerPassword", autoComplete: "new-password", value: password, onChange: (e) => { setPassword(e.target.value); }, required: true }),
            React.createElement(TextField, { label: "Password", htmlFor: "password", type: "password", placeholder: "Confirm Password", name: "registerConfirm", autoComplete: "new-password", value: confirm, onChange: (e) => { setConfirm(e.target.value); }, required: true }),
            React.createElement(MessageBarComp, { className: "messagebar", displayMessageShow: displayMessage.show, displayMessageText: displayMessage.text, displayMessageType: displayMessage.type, setDisplayMessage: setDisplayMessage })),
        React.createElement("div", { className: "button_holder" },
            React.createElement(SpinnerComp, { className: "spinner", loading: loadingStatus.show, loadingMessage: loadingStatus.text }),
            React.createElement(DefaultButton, { text: "Back", onClick: () => { if (!loadingStatus.show) {
                    onBack();
                } }, allowDisabledFocus: true }),
            React.createElement(PrimaryButton, { text: "Register User", onClick: () => { onRegister(); }, allowDisabledFocus: true }))));
}
function LoginHome(props) {
    const [username, setUsername] = useState(props.userInfo.username);
    const [password, setPassword] = useState(props.userInfo.password);
    const [loadingStatus, setLoadingStatus] = useState({ show: false, text: '' });
    const [displayMessage, setDisplayMessage] = useState({ show: false, text: '', type: 1 });
    const onRegisterPage = () => {
        setDisplayMessage({ show: false, text: '', type: 1 });
        props.setCurrentPage({ login: false, register: true, welcome: false });
        props.setUserInfo({ username, password });
    };
    function onLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!testUserAndPassword(username, password)) {
                setDisplayMessage({ show: true, text: 'Username and password must be at least 6 characters.', type: 1 });
                return;
            }
            try {
                setDisplayMessage({ show: false, text: '', type: 1 });
                setLoadingStatus({ show: true, text: 'Login..' });
                const response = yield fetch(`${getApiUrl()}/login_user`, {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const responseJSON = yield response.json();
                if (response.ok) {
                    props.setUserInfo({ username, password });
                    setValueForKey('satf_token', `${responseJSON.username}:${responseJSON.token}`);
                    props.setCurrentPage({ login: false, register: false, welcome: true });
                }
                else if (responseJSON.message) {
                    setDisplayMessage({ show: true, text: responseJSON.message, type: 1 });
                }
                else {
                    setDisplayMessage({ show: true, text: 'Unable to login user', type: 1 });
                }
            }
            catch (err) {
                console.log(err);
                setDisplayMessage({ show: true, text: 'Unable to login user', type: 1 });
            }
            finally {
                setLoadingStatus({ show: false, text: '' });
            }
        });
    }
    function onEnter(event) {
        if (event.key === 'Enter') {
            onLogin();
        }
    }
    return (React.createElement("div", { onKeyPress: onEnter },
        React.createElement(Text, { variant: "large", block: true, className: "intro_text" }, "Login User"),
        React.createElement("form", null,
            React.createElement(TextField, { label: "Username", htmlFor: "username", type: "text", placeholder: "Enter Username", name: "username", autoComplete: "username", value: username, onChange: (e) => { setUsername(e.target.value); }, required: true }),
            React.createElement(TextField, { label: "Password", htmlFor: "password", type: "password", placeholder: "Enter Password", name: "password", autoComplete: "current-password", value: password, onChange: (e) => { setPassword(e.target.value); }, required: true }),
            React.createElement(MessageBarComp, { className: "messagebar", displayMessageShow: displayMessage.show, displayMessageText: displayMessage.text, displayMessageType: displayMessage.type, setDisplayMessage: setDisplayMessage })),
        React.createElement("div", { className: "button_holder" },
            React.createElement(SpinnerComp, { className: "spinner", loading: loadingStatus.show, loadingMessage: loadingStatus.text }),
            React.createElement(DefaultButton, { text: "Register", onClick: () => { if (!loadingStatus.show) {
                    onRegisterPage();
                } }, allowDisabledFocus: true }),
            React.createElement(PrimaryButton, { text: "Login", onClick: () => { onLogin(); }, allowDisabledFocus: true }))));
}
function Login() {
    document.title = 'Login';
    const [currentPage, setCurrentPage] = useState({ login: true, register: false, welcome: false });
    const [userInfo, setUserInfo] = useState({ username: '', password: '' });
    function renderLogic() {
        const token = getValueForKey('satf_token');
        if (token !== '' && token !== null && token !== undefined && token.split(':').length === 2) {
            const user = { username: token.split(':')[0], password: '' };
            return (React.createElement(Welcome, { userInfo: user, setUserInfo: setUserInfo, setCurrentPage: setCurrentPage }));
        }
        if (currentPage.register) {
            return (React.createElement(Register, { userInfo: userInfo, setCurrentPage: setCurrentPage, setUserInfo: setUserInfo }));
        }
        if (currentPage.welcome) {
            return (React.createElement(Welcome, { userInfo: userInfo, setUserInfo: setUserInfo, setCurrentPage: setCurrentPage }));
        }
        return (React.createElement(LoginHome, { userInfo: userInfo, setCurrentPage: setCurrentPage, setUserInfo: setUserInfo }));
    }
    return (React.createElement("div", { id: "taskpane_body" },
        React.createElement("div", { className: "pseudo_image" },
            React.createElement(Text, { variant: "xLarge", block: true }, "Savings at the Frontier")),
        React.createElement(Stack, { className: "form_holder" }, renderLogic())));
}
export default Login;
//# sourceMappingURL=login.js.map