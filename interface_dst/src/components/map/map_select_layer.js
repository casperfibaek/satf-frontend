import React from 'react'; // eslint-disable-line
import { PrimaryButton, Callout, DirectionalHint, Dropdown, DefaultButton, } from '@fluentui/react';
import { getLayerCount, addMarkerToLayer, addDataToLayer } from './map_layers';
export default function SelectLayer(props) {
    const { state } = window;
    function onAdd() {
        if (props.statusCalloutSelect.current.data !== null) {
            addDataToLayer(props.selectedLayer, props.statusCalloutSelect.current.data);
        }
        else {
            addMarkerToLayer(props.selectedLayer);
        }
        props.statusCalloutSelect.close();
    }
    return (React.createElement(Callout, { role: "alertdialog", gapSpace: 0, target: props.statusCalloutSelect.current.target ? props.statusCalloutSelect.current.target : state.click.position, hidden: props.statusCalloutSelect.current.hidden, onDismiss: () => { props.statusCalloutSelect.close(); }, setInitialFocus: true, directionalHint: DirectionalHint.bottomCenter },
        React.createElement(Dropdown, { placeholder: "Create new layer", label: "Add point(s) to layer", defaultSelectedKey: state.layers.length === 0 ? -1 : props.selectedLayer, options: state.layers.map((e) => ({ text: e.name, key: e.key })), onChange: (event, value) => { props.setSelectedLayer(value.key); }, required: true }),
        React.createElement(PrimaryButton, { className: "add-point-to-layer", onClick: () => { onAdd(); }, text: (getLayerCount() === 0) ? 'Create' : 'Add' }),
        React.createElement(DefaultButton, { className: "add-point-to-layer-back", onClick: () => { props.statusCalloutSelect.close(); } }, "Close")));
}
//# sourceMappingURL=map_select_layer.js.map