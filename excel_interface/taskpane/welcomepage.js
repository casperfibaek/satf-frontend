System.register(["./spinner.js"], function (exports_1, context_1) {
    "use strict";
    var spinner_js_1, React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function WelcomePage(props) {
        return (React.createElement("div", { id: "page_welcome" },
            React.createElement(FluentUIReact.Text, { variant: "xLarge", block: true, id: "welcome_header" },
                "Welcome ",
                props.username),
            React.createElement(FluentUIReact.Text, { variant: "medium", block: true, id: "welcome_text" }, "You are now successfully logged in and able to use the Savings at the Frontier custom functions and mapping functionality."),
            React.createElement("div", { id: "welcome_buttons" },
                React.createElement(spinner_js_1.default, { loading: props.loading, loadingMessage: props.loadingMessage }),
                React.createElement(FluentUIReact.DefaultButton, { text: "Logout", onClick: function () { props.onLogout(); }, allowDisabledFocus: true }),
                React.createElement(FluentUIReact.PrimaryButton, { text: "Delete User", onClick: function () { props.onDelete(); }, allowDisabledFocus: true }))));
    }
    exports_1("default", WelcomePage);
    return {
        setters: [
            function (spinner_js_1_1) {
                spinner_js_1 = spinner_js_1_1;
            }
        ],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact;
        }
    };
});
//# sourceMappingURL=welcomepage.js.map