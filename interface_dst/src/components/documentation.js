import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { Text, Icon, SearchBox, initializeIcons, } from '@fluentui/react';
import Fuse from 'fuse.js-ie11';
import documentationObject from '../custom_functions_meta.json';
const fuzzyIndex = new Fuse(documentationObject.functions, {
    keys: ['name', 'description'],
});
function fuzzySearch(str) {
    console.log(str);
    console.log(fuzzyIndex.search(str).map((e) => e.item));
    if (str === '') {
        return documentationObject.functions;
    }
    return fuzzyIndex.search(str).map((e) => e.item);
}
function iterParams(p, idx) {
    return (React.createElement("ul", { key: idx, className: "function_parameters" },
        React.createElement("li", null,
            "Name: ",
            React.createElement("b", null, p.name)),
        React.createElement("li", null,
            "Description: ",
            React.createElement("i", null, p.description)),
        React.createElement("li", null,
            "Type: ",
            p.type)));
}
function SearchElements(props) {
    return props.documentationFunctions.map((f, idx) => (React.createElement("div", { key: idx, className: "function_card" },
        React.createElement(Text, { variant: "large", block: true }, f.name),
        React.createElement(Text, { variant: "medium" }, f.description),
        React.createElement(Text, { variant: "medium", block: true, className: "text_with_margin" }, "Parameters:"),
        f.parameters.length > 0 && f.parameters.map(iterParams),
        React.createElement(Text, { variant: "medium", block: true, className: "text_with_margin" }, "Returns:"),
        React.createElement("ul", { className: "function_parameters" },
            React.createElement("li", null,
                React.createElement("b", null, f.result.type))))));
}
const greetingStyles = {
    root: {
        color: '#FFFFFF'
    }
};
export default function Documentation() {
    document.title = 'Documentation';
    const [results, setResults] = useState(documentationObject.functions);
    useEffect(() => { console.log(documentationObject.functions); }, []);
    return (React.createElement("div", { id: "documentation_body" },
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "header" },
                React.createElement("div", { className: "greet_text" },
                    React.createElement(Icon, { iconName: "TextDocument" }),
                    React.createElement(Text, { styles: greetingStyles, variant: "xLarge" }, "Search the documentation")),
                React.createElement(SearchBox, { className: "function_search", placeholder: "Search", onChange: (_, newValue) => { setResults(fuzzySearch(newValue)); } }))),
        React.createElement("div", { className: "card_holder" },
            React.createElement(SearchElements, { documentationFunctions: results }))));
}
initializeIcons();
//# sourceMappingURL=documentation.js.map