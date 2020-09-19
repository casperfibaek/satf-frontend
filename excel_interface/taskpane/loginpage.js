System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function LoginPage(props) {
        return (React.createElement("div", { id: "page_login" },
            React.createElement(FluentUIReact.Text, { variant: "large", block: true, id: "login_text" }, "Login User"),
            React.createElement("form", { className: "login_page_form" },
                React.createElement(FluentUIReact.TextField, { label: "Username", htmlFor: "username", type: "text", placeholder: "Enter Username", name: "username", onChange: function (e) { props.onInput(e); }, value: props.username, required: true }),
                React.createElement(FluentUIReact.TextField, { label: "Password", htmlFor: "password", type: "password", placeholder: "Enter Password", name: "password", onChange: function (e) { props.onInput(e); }, value: props.password, required: true })),
            React.createElement("div", { id: "login_buttons" },
                React.createElement(FluentUIReact.DefaultButton, { text: "Register", onClick: function () { props.onRegister(); }, allowDisabledFocus: true }),
                React.createElement(FluentUIReact.PrimaryButton, { text: "Login", onClick: function (e) { props.onLogin(e); }, allowDisabledFocus: true }))));
    }
    exports_1("default", LoginPage);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact; // eslint-disable-line
        }
    };
});
//# sourceMappingURL=loginpage.js.map