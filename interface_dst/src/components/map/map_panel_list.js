import React, { useState } from 'react'; // eslint-disable-line
import { PrimaryButton, DefaultButton, FontIcon, DialogFooter, Dialog, DialogType, Toggle, Text, } from '@fluentui/react';
import Styler from './map_styler';
import { toggleLayer, getFirstLayerKey, removeLayer, getLayer, getLayerCount, } from './map_layers';
export default function LayerList(props) {
    const { state } = window;
    const [dialogStyle, setDialogStyle] = useState({ hidden: true });
    const [deleteAlert, setDeleteAlert] = useState({ hidden: true });
    const statusDeleteAlert = {
        open: () => setDeleteAlert({ hidden: false }),
        close: () => setDeleteAlert({ hidden: true }),
        current: deleteAlert,
    };
    const statusDialogStyle = {
        open: () => setDialogStyle({ hidden: false }),
        close: () => setDialogStyle({ hidden: true }),
        current: dialogStyle,
    };
    function onEdit(key) {
        props.setSelectedLayer(key);
        statusDialogStyle.open();
    }
    function onDelete(key) {
        props.setSelectedLayer(key);
        statusDeleteAlert.open();
    }
    function deleteLayer() {
        removeLayer(props.selectedLayer);
        props.setSelectedLayer(getFirstLayerKey());
        statusDeleteAlert.close();
    }
    const layers = [];
    for (let i = 0; i < state.layers.length; i += 1) {
        const { style, key, name } = state.layers[i];
        layers.push(React.createElement("div", { className: "layer-item", key: key },
            React.createElement(Toggle, { defaultChecked: true, onChange: () => { toggleLayer(key); } }),
            React.createElement("div", { className: "style-box", onClick: () => { onEdit(key); }, style: { backgroundColor: style.fillColor, border: `1px solid ${style.edgeColor}` } }),
            React.createElement("div", { className: "layer-name" },
                React.createElement(Text, { variant: "medium" }, name)),
            React.createElement("div", { className: "editables" },
                React.createElement("div", { className: "layer-edit", onClick: () => { onEdit(key); } },
                    React.createElement(FontIcon, { iconName: "EditSolidMirrored12" })),
                React.createElement("div", { className: "layer-delete", onClick: () => { onDelete(key); } },
                    React.createElement(FontIcon, { iconName: "Delete" })))));
    }
    return (React.createElement("div", null,
        React.createElement(Styler, { statusDialogStyle: statusDialogStyle, selectedLayer: props.selectedLayer }),
        React.createElement(Dialog, { hidden: statusDeleteAlert.current.hidden, onDismiss: () => { statusDeleteAlert.close(); }, dialogContentProps: {
                type: DialogType.normal,
                title: `Delete ${getLayerCount() > 0 ? getLayer(props.selectedLayer).name : 'layer'}?`,
                closeButtonAriaLabel: 'Close',
                subText: 'Do you really want to delete this layer? The action is irreversible.',
            } },
            React.createElement(DialogFooter, null,
                React.createElement(DefaultButton, { onClick: () => { statusDeleteAlert.close(); }, text: "Back" }),
                React.createElement(PrimaryButton, { onClick: () => { deleteLayer(); }, text: "Delete" }))),
        React.createElement("div", { className: "layer-list" }, layers)));
}
//# sourceMappingURL=map_panel_list.js.map