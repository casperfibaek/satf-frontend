System.register([], function (exports_1, context_1) {
    "use strict";
    var React, FluentUIReact;
    var __moduleName = context_1 && context_1.id;
    function Spinner(props) {
        var loading = props.loading;
        return (React.createElement("div", null, loading && React.createElement("div", { className: "loader" }, "Loading...")));
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