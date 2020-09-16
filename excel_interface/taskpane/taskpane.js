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
var ReactDOM = window.ReactDOM, React = window.React, FluentUIReact = window.FluentUIReact; // eslint-disable-line
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            // page: { loggedIn: false, registerPage: false },
            // inputs: { user: "", password: "" },
            user: '',
            password: '',
            loggedIn: false,
            register: false,
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.attemptLogIn = _this.attemptLogIn.bind(_this);
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
    Login.prototype.logOut = function () {
        this.setState({
            loggedIn: false,
        });
    };
    Login.prototype.handleChange = function (e) {
        var _a;
        var name = e.target.name;
        var value = e.target.value;
        this.setState((_a = {},
            _a[name] = value,
            _a));
    };
    Login.prototype.handleSubmit = function (e) {
        e.preventDefault();
        switch (e.target.id) {
            case 'logIn':
                var username = this.state.user;
                var password = this.state.password;
                this.attemptLogIn(username, password);
                break;
            case 'logOut':
                this.logOut();
                break;
            default:
            // do nothing
        }
    };
    Login.prototype.render = function () {
        var loginPage = (React.createElement("div", null,
            React.createElement("form", null,
                React.createElement("label", { htmlFor: "user" },
                    React.createElement("b", null, "Username")),
                React.createElement("input", { type: "text", placeholder: "Enter Username", name: "user", onChange: this.handleChange, value: this.state.user, required: true }),
                React.createElement("label", { htmlFor: "password" },
                    React.createElement("b", null, "Password")),
                React.createElement("input", { type: "password", placeholder: "Enter Password", name: "password", onChange: this.handleChange, value: this.state.password, required: true }),
                React.createElement("button", { id: "logIn", type: "submit", onClick: this.handleSubmit }, "Login"))));
        var welcomePage = (React.createElement("div", null,
            React.createElement("h1", null,
                "Welcome ",
                this.state.user),
            React.createElement("h2", null, "you are now successfully logged in"),
            React.createElement("button", { id: "logOut", type: "submit", onClick: this.handleSubmit }, "Logout")));
        // const registerPage = (
        // )
        return this.state.loggedIn ? welcomePage : loginPage;
    };
    return Login;
}(React.Component));
ReactDOM.render(React.createElement(React.StrictMode, null,
    React.createElement(Login, null)), document.getElementById('root'));
//# sourceMappingURL=taskpane.js.map