System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function WelcomePage(props) {
        return (React.createElement("div", null,
            React.createElement("h1", null,
                "Welcome ",
                props.username),
            React.createElement("h2", null, "you are now successfully logged in"),
            React.createElement("button", { type: "submit", onClick: function () { props.onLogout(); } }, "Logout")));
    }
    exports_1("default", WelcomePage);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact;
            ;
        }
    };
});
//# sourceMappingURL=welcomepage.js.map