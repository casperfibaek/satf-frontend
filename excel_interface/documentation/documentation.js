System.register(["../functions/functions_meta.json"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var functions_meta_json_1, _a, ReactDOM, React, FluentUIReact, theme, functionsObj, Documentation;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (functions_meta_json_1_1) {
                functions_meta_json_1 = functions_meta_json_1_1;
            }
        ],
        execute: function () {
            _a = window, ReactDOM = _a.ReactDOM, React = _a.React, FluentUIReact = _a.FluentUIReact; // eslint-disable-line
            theme = FluentUIReact.getTheme();
            functionsObj = functions_meta_json_1.default;
            Documentation = /** @class */ (function (_super) {
                __extends(Documentation, _super);
                function Documentation(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        functions: [],
                    };
                    return _this;
                }
                Documentation.prototype.componentDidMount = function () {
                    this.setState({
                        functions: functionsObj.functions,
                    });
                };
                Documentation.prototype.render = function () {
                    var iterParams = function (p, idx) { return (React.createElement("ul", { key: idx },
                        React.createElement("li", null, p.description),
                        React.createElement("li", null, p.name),
                        React.createElement("li", null, p.type),
                        React.createElement("li", null, p.optional && 'True'))); };
                    var listItems = this.state.functions.map(function (f, idx) { return (React.createElement("div", { key: idx, style: { boxShadow: theme.effects.elevation8, background: 'red' } },
                        React.createElement("p", null, f.description),
                        React.createElement("p", null, f.id),
                        React.createElement("p", null, f.name),
                        f.parameters.length > 0 && f.parameters.map(iterParams),
                        React.createElement("p", null, f.result.type))); });
                    return React.createElement("div", null, listItems);
                };
                return Documentation;
            }(React.Component));
            ReactDOM.render(React.createElement(React.StrictMode, null,
                React.createElement(Documentation, null)), document.getElementById('root'));
        }
    };
});
//# sourceMappingURL=documentation.js.map