System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function LoginPage(props) {
        // const { username, password } = this.props
        // return (
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
                React.createElement("button", { onClick: function () { props.onRegister(); } }, "Register User")),
            React.createElement("h1", null, props.username),
            React.createElement("h1", null, props.password)));
    }
    exports_1("default", LoginPage);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact;
        }
    };
});
//# sourceMappingURL=loginpage.js.map