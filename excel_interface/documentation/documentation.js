"use strict";
// import React from "react";
// import { getTheme } from "@fluentui/react";
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
var _a = window, ReactDOM = _a.ReactDOM, React = _a.React, FluentUIReact = _a.FluentUIReact; // eslint-disable-line
var theme = FluentUIReact.getTheme();
var functionsObj = {
    functions: [
        {
            description: "Hello Worlds rev",
            id: "helloWorld",
            name: "HELLO",
            parameters: [],
            result: {
                type: "string",
            },
        },
        {
            description: "From Latitude, Longitude to What3Words",
            id: "LatLngToWhatFreeWords",
            name: "WHAT3WORDS",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "number",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "From Latitude, Longitude to Pluscode",
            id: "LatLngToPluscode",
            name: "PLUSCODE",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "number",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Population Density at point (ppl/ha)",
            id: "PopulationDensity",
            name: "POPDENS",
            parameters: [
                {
                    description: "Latitude of point",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "number",
            },
        },
        {
            description: "Population within provided walking distance in minutes from point",
            id: "PopulationDensityWalk",
            name: "POPDENSWALK",
            parameters: [
                {
                    description: "Time in minutes",
                    name: "Minutes",
                    type: "number",
                },
                {
                    description: "Latitude of point",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "number",
            },
        },
        {
            description: "Population within provided biking distance in minutes from point",
            id: "PopulationDensityBike",
            name: "POPDENSBIKE",
            parameters: [
                {
                    description: "Time in minutes",
                    name: "Minutes",
                    type: "number",
                },
                {
                    description: "Latitude of point",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "number",
            },
        },
        {
            description: "Population within provided driving distance in minutes from point",
            id: "PopulationDensityCar",
            name: "POPDENSCAR",
            parameters: [
                {
                    description: "Time in minutes",
                    name: "Minutes",
                    type: "number",
                },
                {
                    description: "Latitude of point",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "number",
            },
        },
        {
            description: "Population within provided distance in meters from point",
            id: "PopulationDensityBuffer",
            name: "POPDENSBUF",
            parameters: [
                {
                    description: "Buffer in meters.",
                    name: "Buffer",
                    type: "number",
                },
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "number",
            },
        },
        {
            description: "Administrative zone from latitude and longitude (level 1)",
            id: "AdminLevel1",
            name: "ADMINLEVEL1",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Administrative zone from latitude and longitude (level 2)",
            id: "AdminLevel2",
            name: "ADMINLEVEL2",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Fuzzy corrections of administrative level 2 (Levenstein)",
            id: "AdminLevel2FuzzyLev",
            name: "FUZZYADMINLEVEL2LEV",
            parameters: [
                {
                    description: "Admin level 2 to fuzzy searm.",
                    name: "admin2",
                    type: "string",
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Fuzzy corrections of administrative level 2 (trigrams)",
            id: "AdminLevel2FuzzyTri",
            name: "FUZZYADMINLEVEL2TRI",
            parameters: [
                {
                    description: "Admin level 2 to fuzzy searm.",
                    name: "admin2",
                    type: "string",
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Urban classification from latitude and longitude.",
            id: "UrbanStatus",
            name: "URBANSTATUS",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Urban classification from latitude and longitude. (simple)",
            id: "UrbanStatusSimple",
            name: "URBANSTATUSSIMPLE",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Nearest placename from latitude and longitude.",
            id: "NearestPlace",
            name: "NEARESTPLACE",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Nearest point of interest from latitude and longitude.",
            id: "NearestPoi",
            name: "NEARESTPOI",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Nearest bank from latitude and longitude.",
            id: "NearestBank",
            name: "NEARESTBANK",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "string",
            },
        },
        {
            description: "Distance to nearest bank from latitude and longitude.",
            id: "NearestBankDist",
            name: "NEARESTBANKDIST",
            parameters: [
                {
                    description: "Latitude of point.",
                    name: "Latitude",
                    type: "any",
                },
                {
                    description: "Longitude of point.",
                    name: "Longitude",
                    type: "number",
                    optional: true,
                },
            ],
            result: {
                type: "number",
            },
        },
    ],
};
var Documentation = /** @class */ (function (_super) {
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
        var iterParams = function (p, idx) {
            return (React.createElement("ul", { key: idx },
                React.createElement("li", null, p.description),
                React.createElement("li", null, p.name),
                React.createElement("li", null, p.type),
                React.createElement("li", null, p.optional && "True")));
        };
        var listItems = this.state.functions.map(function (f, idx) {
            return (React.createElement("div", { key: idx, style: { boxShadow: theme.effects.elevation8, background: "red" } },
                React.createElement("p", null, f.description),
                React.createElement("p", null, f.id),
                React.createElement("p", null, f.name),
                f.parameters.length > 0 && f.parameters.map(iterParams),
                React.createElement("p", null, f.result.type)));
        });
        return React.createElement("div", null, listItems);
    };
    return Documentation;
}(React.Component));
ReactDOM.render(React.createElement(React.StrictMode, null,
    React.createElement(Documentation, null)), document.getElementById("root"));
//# sourceMappingURL=documentation.js.map