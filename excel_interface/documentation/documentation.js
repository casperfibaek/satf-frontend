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
    var functions_meta_json_1, _a, ReactDOM, React, FluentUIReact, Fuse, functionsObj, Documentation;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (functions_meta_json_1_1) {
                functions_meta_json_1 = functions_meta_json_1_1;
            }
        ],
        execute: function () {
            _a = window, ReactDOM = _a.ReactDOM, React = _a.React, FluentUIReact = _a.FluentUIReact, Fuse = _a.Fuse; // eslint-disable-line
            functionsObj = functions_meta_json_1.default;
            Documentation = /** @class */ (function (_super) {
                __extends(Documentation, _super);
                function Documentation(props) {
                    var _this = _super.call(this, props) || this;
                    _this.state = {
                        functions: [],
                        results: {},
                    };
                    _this.fuzzySearch = _this.fuzzySearch.bind(_this);
                    return _this;
                }
                Documentation.prototype.componentDidMount = function () {
                    this.setState({
                        functions: functionsObj.functions,
                    });
                    this.fuzzy = new Fuse(this.state.functions, {
                        keys: ['name'],
                    });
                };
                Documentation.prototype.UNSAFE_componentWillMount = function () {
                    window._fuzzySearch = new Fuse(functionsObj.functions, {
                        keys: ['name', 'description'],
                    });
                };
                Documentation.prototype.fuzzySearch = function (input) {
                    if (input === '') {
                        this.setState({
                            functions: functionsObj.functions,
                        });
                    }
                    else {
                        var search = window._fuzzySearch.search(input);
                        this.setState({
                            functions: search.map(function (e) { return e.item; }),
                        });
                    }
                };
                Documentation.prototype.render = function () {
                    var _this = this;
                    var iterParams = function (p, idx) { return (React.createElement("ul", { key: idx, className: "function_parameters" },
                        React.createElement("li", null,
                            "Name: ",
                            React.createElement("b", null, p.name)),
                        React.createElement("li", null,
                            "Description: ",
                            React.createElement("i", null, p.description)),
                        React.createElement("li", null,
                            "Type: ",
                            p.type))); };
                    var listItems = this.state.functions.map(function (f, idx) { return (React.createElement("div", { key: idx, className: "function_card" },
                        React.createElement(FluentUIReact.Text, { variant: "large", block: true }, f.name),
                        React.createElement(FluentUIReact.Text, { variant: "medium" }, f.description),
                        React.createElement(FluentUIReact.Text, { variant: "medium", block: true, className: "text_with_margin" }, "Parameters:"),
                        f.parameters.length > 0 && f.parameters.map(iterParams),
                        React.createElement(FluentUIReact.Text, { variant: "medium", block: true, className: "text_with_margin" }, "Returns:"),
                        React.createElement("ul", { className: "function_parameters" },
                            React.createElement("li", null,
                                React.createElement("b", null, f.result.type))))); });
                    return (React.createElement("div", { id: "root_functions" },
                        React.createElement("div", { className: "container" },
                            React.createElement("div", { id: "documentation_header" },
                                React.createElement("div", { className: "documentation_intro_text" },
                                    React.createElement(FluentUIReact.Icon, { iconName: "TextDocument" }),
                                    React.createElement(FluentUIReact.Text, { variant: "xLarge", block: true }, "Search the documentation")),
                                React.createElement(FluentUIReact.SearchBox, { className: "function_search", placeholder: "Search", onChanged: function (newValue) { return _this.fuzzySearch(newValue); } }))),
                        React.createElement("div", { id: "card_holder" }, listItems)));
                };
                return Documentation;
            }(React.Component));
            ReactDOM.render(React.createElement(React.StrictMode, null,
                React.createElement(Documentation, null)), document.getElementById('root'));
        }
    };
});
//# sourceMappingURL=documentation.js.map