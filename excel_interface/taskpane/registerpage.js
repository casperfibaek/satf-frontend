System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function RegisterPage(props) {
        return (React.createElement("div", { id: "page_register" },
            React.createElement(FluentUIReact.Text, { variant: "large", block: true, id: "register_text" }, "Register User"),
            React.createElement("form", { className: "login_page_form" },
                React.createElement(FluentUIReact.TextField, { label: "Username", htmlFor: "username", type: "text", placeholder: "Enter Username", name: "registerUsername", onChange: function (e) { props.onInput(e); }, value: props.registerUsername, required: true }),
                React.createElement(FluentUIReact.TextField, { label: "Password", htmlFor: "password", type: "password", placeholder: "Enter Password", name: "registerPassword", onChange: function (e) { props.onInput(e); }, value: props.registerPassword, required: true }),
                React.createElement(FluentUIReact.TextField, { label: "Password", htmlFor: "password", type: "password", placeholder: "Confirm Password", name: "registerConfirm", onChange: function (e) { props.onInput(e); }, value: props.registerConfirm, required: true })),
            React.createElement("div", { id: "register_buttons" },
                React.createElement(FluentUIReact.DefaultButton, { text: "Back", onClick: function () { props.onBack(); }, allowDisabledFocus: true }),
                React.createElement(FluentUIReact.PrimaryButton, { text: "Register User", onClick: function (e) { props.onCreate(e); }, allowDisabledFocus: true }))));
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