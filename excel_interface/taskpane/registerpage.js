System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function RegisterPage(props) {
        // const { registerUsername, registerPassword, registerConfirm } = this.props
        return (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("form", null,
                    React.createElement("label", { htmlFor: "username" },
                        React.createElement("b", null, "Username")),
                    React.createElement("input", { type: "text", placeholder: "Enter Username", name: "registerUsername", onChange: function (e) { props.onInput(e); }, value: props.registerUsername, required: true }),
                    React.createElement("label", { htmlFor: "password" },
                        React.createElement("b", null, "Password")),
                    React.createElement("input", { type: "password", placeholder: "Enter Password", name: "registerPassword", onChange: function (e) { props.onInput(e); }, value: props.registerPassword, required: true }),
                    React.createElement("input", { type: "password", placeholder: "Confirm Password", name: "registerConfirm", onChange: function (e) { props.onInput(e); }, value: props.registerConfirm, required: true }),
                    React.createElement("button", { type: "submit", onClick: function (e) { props.onCreate(e); } }, "Register User"),
                    React.createElement("button", { type: "submit", onClick: function () { props.onBack(); } }, "Back to Login")),
                React.createElement("h1", null, props.registerUsername),
                React.createElement("h1", null, props.registerPassword),
                React.createElement("h1", null, props.registerConfirm))));
    }
    exports_1("default", RegisterPage);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact;
        }
    };
});
//# sourceMappingURL=registerpage.js.map