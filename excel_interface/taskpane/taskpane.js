System.register([], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var ReactDOM, React, FluentUIReact, LoginPage, WelcomePage, RegisterPage, Login;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            ReactDOM = window.ReactDOM, React = window.React, FluentUIReact = window.FluentUIReact; // eslint-disable-line
            LoginPage = function (props) {
                var username = props.username;
                var password = props.password;
                return (React.createElement("div", null,
                    React.createElement("form", null,
                        React.createElement("label", { htmlFor: "username" },
                            React.createElement("b", null, "Username")),
                        React.createElement("input", { type: "text", placeholder: "Enter Username", name: "username", onChange: function (e) { props.onInput(e); }, value: props.username, required: true }),
                        React.createElement("label", { htmlFor: "password" },
                            React.createElement("b", null, "Password")),
                        React.createElement("input", { type: "password", placeholder: "Enter Password", name: "password", onChange: function (e) { props.onInput(e); }, value: props.password, required: true }),
                        React.createElement("button", { type: "submit", onClick: function (e) { props.onLogin(e); } }, "Login")),
                    React.createElement("div", null,
                        React.createElement("button", { onClick: function (e) { props.onRegister(e); } }, "Register User")),
                    React.createElement("h1", null, username),
                    React.createElement("h1", null, password)));
            };
            WelcomePage = function (props) {
                return (React.createElement("div", null,
                    React.createElement("h1", null,
                        "Welcome ",
                        props.username),
                    React.createElement("h2", null, "you are now successfully logged in"),
                    React.createElement("button", { type: "submit", onClick: function () { props.onLogout(); } }, "Logout")));
            };
            RegisterPage = function (props) {
                return (React.createElement("div", null,
                    React.createElement("div", null,
                        React.createElement("form", null,
                            React.createElement("label", { htmlFor: "username" },
                                React.createElement("b", null, "Username")),
                            React.createElement("input", { type: "text", placeholder: "Enter Username", name: "username", onChange: function (e) { props.onInput(e); }, value: props.username, required: true }),
                            React.createElement("label", { htmlFor: "password" },
                                React.createElement("b", null, "Password")),
                            React.createElement("input", { type: "password", placeholder: "Enter Password", name: "password", onChange: function (e) { props.onInput(e); }, value: props.password, required: true }),
                            React.createElement("input", { type: "password", placeholder: "Confirm Password", name: "confirm", onChange: function (e) { props.onInput(e); }, value: props.password, required: true }),
                            React.createElement("button", { type: "submit", onClick: function (e) { props.onLogin(e); } }, "Login")),
                        React.createElement("h1", null, username),
                        React.createElement("h1", null, password))));
            };
            Login = /** @class */ (function (_super) {
                __extends(Login, _super);
                function Login(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        // page: { loggedIn: false, registerPage: false },
                        // inputs: { user: "", password: "" },
                        username: '',
                        password: '',
                        loggedIn: false,
                        registerPage: false,
                        registerUsername: '',
                        registerPassword: '',
                        registerConfirm: '',
                    };
                    _this.handleChange = _this.handleChange.bind(_this);
                    _this.handleLogin = _this.handleLogin.bind(_this);
                    _this.handleLogout = _this.handleLogout.bind(_this);
                    _this.attemptLogIn = _this.attemptLogIn.bind(_this);
                    _this.logOut = _this.logOut.bind(_this);
                    _this.toRegisterPage = _this.toRegisterPage.bind(_this);
                    return _this;
                }
                // componentDidMount() {
                //   Office.initialize = () => {
                //     // Determine user's version of Office
                //     if (!Office.context.requirements.isSetSupported("ExcelApi", "1.7")) {
                //       console.log(
                //         "Sorry. The add-in uses Excel.js APIs that are not available in your version of Office."
                //       );
                //     }
                //   };
                // }
                Login.prototype.attemptLogIn = function (username, password) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, responseJSON, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch('https://satf.azurewebsites.net/api/login_user', {
                                            method: 'post',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ username: username, password: password }),
                                        })];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    responseJSON = _a.sent();
                                    localStorage.setItem('token', responseJSON.username + ":" + responseJSON.token);
                                    if (response.ok) {
                                        this.setState({
                                            loggedIn: true,
                                        });
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    console.log('there was an error');
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                Login.prototype.toRegisterPage = function () {
                    this.setState({
                        // page: { loggedIn: false, registerPage: false },
                        // inputs: { user: "", password: "" },
                        username: '',
                        password: '',
                        loggedIn: false,
                        register: {
                            page: true,
                            username: '',
                            password: '',
                            confirm: '',
                        }
                    });
                };
                Login.prototype.register = function (username, password, confirm) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, responseJSON, err_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch('https://satf.azurewebsites.net/api/create_user', {
                                            method: 'post',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ username: username, password: password, confirm: confirm }),
                                        })];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    responseJSON = _a.sent();
                                    return [2 /*return*/, responseJSON];
                                case 3:
                                    err_2 = _a.sent();
                                    throw Error(err_2);
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                Login.prototype.delete_user = function (token) {
                    return __awaiter(this, void 0, void 0, function () {
                        var response, responseJSON, err_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, fetch('https://satf.azurewebsites.net/api/delete_user', {
                                            method: 'post',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ token: token }),
                                        })];
                                case 1:
                                    response = _a.sent();
                                    return [4 /*yield*/, response.json()];
                                case 2:
                                    responseJSON = _a.sent();
                                    return [2 /*return*/, responseJSON];
                                case 3:
                                    err_3 = _a.sent();
                                    throw Error(err_3);
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                };
                Login.prototype.handleLogout = function () {
                    this.logOut();
                };
                Login.prototype.logOut = function () {
                    this.setState({
                        username: '',
                        password: '',
                        loggedIn: false,
                    });
                };
                Login.prototype.handleLogin = function (e) {
                    e.preventDefault();
                    var _a = this.state, username = _a.username, password = _a.password;
                    this.attemptLogIn(username, password);
                };
                Login.prototype.handleChange = function (e) {
                    var _a;
                    var _b = e.target, name = _b.name, value = _b.value;
                    this.setState((_a = {},
                        _a[name] = value,
                        _a));
                };
                Login.prototype.renderLogic = function () {
                    if (this.state.registerPage) {
                        var _a = this.state, registerUser = _a.registerUser, registerPassword = _a.registerPassword, registerConfirm = _a.registerConfirm;
                        return (React.createElement(RegisterPage, { newUser: registerUser, newPassword: registerPassword, newConfirm: registerConfirm, onCreate: this.register, onBack: this.toLogin }));
                    }
                    else if (this.state.loggedIn) {
                        return (React.createElement(WelcomePage, { username: this.state.username, onLogout: this.handleLogout }));
                    }
                    else if (!this.state.loggedIn) {
                        return (React.createElement(LoginPage, { username: this.state.username, password: this.state.password, onInput: this.handleChange, onLogin: this.handleLogin }));
                    }
                };
                Login.prototype.render = function () {
                    React.createElement("div", null, this.renderLogic());
                };
                return Login;
            }(React.Component));
            ReactDOM.render(React.createElement(React.StrictMode, null,
                React.createElement(Login, null)), document.getElementById('root'));
        }
    };
});
//# sourceMappingURL=taskpane.js.map