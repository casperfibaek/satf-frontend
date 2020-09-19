System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function MessageBar(props) {
        if (props.displayMessage) {
            return (React.createElement("div", { id: "login_messagebar" },
                React.createElement(FluentUIReact.MessageBar, { messageBarType: props.displayMessageType, isMultiline: false, dismissButtonAriaLabel: "Close" },
                    React.createElement("span", null, props.displayMessageText))));
        }
        return (null);
    }
    exports_1("default", MessageBar);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact; // eslint-disable-line
        }
    };
});
//# sourceMappingURL=messageBar.js.map