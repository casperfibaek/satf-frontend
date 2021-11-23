import React, { useState } from 'react'; // eslint-disable-line
import { Callout, DefaultButton, Text, TextField, DirectionalHint, FontIcon, PrimaryButton, } from '@fluentui/react';
export default function Properties(props) {
    const [newKey, setNewKey] = useState('');
    const [newValue, setNewValue] = useState('');
    const [, refreshState] = useState();
    function propertiesChanged(key, value) {
        const { marker } = props.statusDialogProperties.current;
        marker.options.properties[key] = value;
        refreshState({}); // Force refresh component
    }
    function onDeleteProp(key) {
        const { featureGroup } = props.statusDialogProperties.current;
        featureGroup.eachLayer((layer) => {
            delete layer.options.properties[key]; // eslint-disable-line
        });
        refreshState({}); // Force refresh component
    }
    function addNewProperty() {
        if (newKey === 'Key' || newKey.length === 0) {
            return;
        }
        const { featureGroup, marker } = props.statusDialogProperties.current;
        featureGroup.eachLayer((_marker) => {
            _marker.options.properties[newKey] = null; // eslint-disable-line
        });
        marker.options.properties[newKey] = newValue;
        setNewKey('');
        setNewValue('');
        refreshState({}); // Force refresh component
    }
    function onDeleteMarker() {
        const { featureGroup, marker } = props.statusDialogProperties.current;
        marker.removeFrom(featureGroup);
        marker.remove();
        props.statusDialogProperties.close();
    }
    return (React.createElement(Callout, { title: 'Properties', role: "alertdialog", gapSpace: 0, hidden: props.statusDialogProperties.current.hidden, target: props.statusDialogProperties.current.position, directionalHint: DirectionalHint.bottomCenter, onDismiss: () => { props.statusDialogProperties.close(); } },
        React.createElement("table", { className: "properties-table" },
            props.statusDialogProperties.current.marker && Object.entries(props.statusDialogProperties.current.marker.options.properties).map((e) => (React.createElement("tr", null,
                React.createElement(Text, { variant: "medium" }, e[0]),
                React.createElement(TextField, { defaultValue: e[1], onChange: (event, value) => { propertiesChanged(e[0], value); } }),
                React.createElement("div", { className: "layer-delete", onClick: () => { onDeleteProp(e[0]); } },
                    React.createElement(FontIcon, { iconName: "Delete" }))))),
            React.createElement("tr", null,
                React.createElement(TextField, { placeholder: 'Key', value: newKey, defaultValue: 'Key', onChange: (event, value) => { setNewKey(value); }, className: "layer-prop-key" }),
                React.createElement(TextField, { placeholder: 'Value', value: newValue, defaultValue: 'Value', onChange: (event, value) => { setNewValue(value); } }),
                React.createElement("div", { className: "layer-prop-add", onClick: () => { addNewProperty(); } },
                    React.createElement(FontIcon, { className: "layer-add-property", iconName: "Add" })))),
        React.createElement("div", { className: "prop-footer" },
            React.createElement(DefaultButton, { onClick: () => { onDeleteMarker(); } },
                React.createElement("span", null,
                    "Delete Point  ",
                    React.createElement(FontIcon, { iconName: "Delete" }))),
            React.createElement(PrimaryButton, { onClick: () => { props.statusDialogProperties.close(); }, text: "Close" }))));
}
//# sourceMappingURL=map_properties.js.map