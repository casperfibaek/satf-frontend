System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function Spinner(props) {
        if (props.loading) {
            return (React.createElement("div", { id: "login_spinner" },
                React.createElement(FluentUIReact.Spinner, { label: props.loadingMessage, ariaLive: "assertive", labelPosition: "left" })));
        }
        return (null);
    }
    exports_1("default", Spinner);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact;
        }
    };
});
//# sourceMappingURL=spinner.js.map