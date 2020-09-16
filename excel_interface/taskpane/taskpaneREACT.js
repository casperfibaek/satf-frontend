// import React from "react";
// import { getTheme } from "@fluentui/react";
System.register(["../assets/react.development.js"], function (exports_1, context_1) {
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
    var react_development_js_1, _a, ReactDOM, React, FluentUIReact, Login;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (react_development_js_1_1) {
                react_development_js_1 = react_development_js_1_1;
            }
        ],
        execute: function () {
            _a = window, ReactDOM = _a.ReactDOM, React = _a.React, FluentUIReact = _a.FluentUIReact; // eslint-disable-line
            Login = /** @class */ (function (_super) {
                __extends(Login, _super);
                function Login(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        page: page,
                        inputs: inputs,
                    };
                    return _this;
                }
                Login.prototype.render = function () {
                    return (React.createElement("div", null,
                        React.createElement("form", null,
                            React.createElement("label", { for: "user" },
                                React.createElement("b", null, "Username")),
                            React.createElement("input", { type: "text", placeholder: "Enter Username", name: "user", required: true }),
                            React.createElement("label", { for: "password" },
                                React.createElement("b", null, "Password")),
                            React.createElement("input", { type: "password", placeholder: "Enter Password", name: "password", required: true }),
                            React.createElement("button", { type: "submit" }, "Login"))));
                };
                return Login;
            }(React.Component));
            ReactDOM.render(React.createElement(React.StrictMode, null,
                React.createElement(Login, null)), document.getElementById("root"));
        }
    };
});
//# sourceMappingURL=taskpaneREACT.js.map