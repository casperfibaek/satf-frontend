import React, { useState } from 'react'; // eslint-disable-line
import { PrimaryButton, Panel, DefaultButton, FontIcon, PanelType, DialogFooter, Dialog, DialogType, } from '@fluentui/react';
import LayerList from './map_panel_list';
import { clearLayers, getLayerCount } from './map_layers';
export default function MapPanel(props) {
    const [deleteAlert, setDeleteAlert] = useState({ hidden: true });
    const statusDeleteAlert = {
        open: () => { if (getLayerCount() !== 0) {
            setDeleteAlert({ hidden: false });
        } },
        close: () => setDeleteAlert({ hidden: true }),
    };
    function deletelayers() {
        clearLayers();
        props.setSelectedLayer(-1);
        statusDeleteAlert.close();
    }
    return (React.createElement("div", { className: "panel-nav" },
        React.createElement(Dialog, { hidden: deleteAlert.hidden, onDismiss: () => { setDeleteAlert({ hidden: true }); }, dialogContentProps: {
                type: DialogType.normal,
                title: 'Delete Confirmation',
                closeButtonAriaLabel: 'Close',
                subText: 'Do you really want to remove all layers? This action is irreversible.',
            } },
            React.createElement(DialogFooter, null,
                React.createElement(DefaultButton, { onClick: () => { statusDeleteAlert.close(); }, text: "Back" }),
                React.createElement(PrimaryButton, { onClick: () => { deletelayers(); }, text: "Delete" }))),
        React.createElement(Panel, { headerText: "Layer control", isBlocking: false, onDismiss: () => { props.statusPanel.close(); }, type: PanelType.customNear, customWidth: '320px', closeButtonAriaLabel: "Close", isFooterAtBottom: true, isOpen: !props.statusPanel.current.hidden },
            React.createElement(LayerList, { className: "layer-list", selectedLayer: props.selectedLayer, setSelectedLayer: props.setSelectedLayer }),
            React.createElement(PrimaryButton, { text: "Create layer", className: "createButton", onClick: () => { props.statusDialogCreate.open(); } }),
            React.createElement("div", null, "Current Version: 0.4.6"),
            React.createElement("div", { className: "panel-footer" },
                React.createElement(DefaultButton, { onClick: () => { props.statusPanel.close(); } }, "Close"),
                React.createElement(DefaultButton, { text: "Delete all layers", className: "deleteButton", onClick: () => { statusDeleteAlert.open(); } }))),
        React.createElement(DefaultButton, { className: "navbutton", onClick: () => { props.statusPanel.open(); }, allowDisabledFocus: true },
            React.createElement(FontIcon, { iconName: "GlobalNavButton", className: "icon" }))));
}
//# sourceMappingURL=map_panel.js.map