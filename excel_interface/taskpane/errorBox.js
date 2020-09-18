System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function ErrorBox(props) {
        return (React.createElement("div", null,
            React.createElement("p", null, props.errorMsg)));
    }
    exports_1("default", ErrorBox);
    return {
        setters: [],
        execute: function () {
            React = window.React, FluentUIReact = window.FluentUIReact;
        }
    };
});
//# sourceMappingURL=errorBox.js.map