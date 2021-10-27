import React, { useState } from 'react'; // eslint-disable-line
import L from 'leaflet';
import { PrimaryButton, DefaultButton, Dialog, DialogFooter, TextField, } from '@fluentui/react';
import { isLayernameUnique, createNewMapLayer } from './map_layers';
export default function CreateLayer(props) {
    const { state } = window;
    const [newLayername, setNewLayername] = useState('Default');
    function onCreateLayer() {
        if (newLayername.length >= 3 && newLayername.length <= 20 && isLayernameUnique(newLayername)) {
            const mapLayer = createNewMapLayer(newLayername);
            props.setSelectedLayer(mapLayer.key);
            mapLayer.featureGroup.on('click', (event) => {
                props.statusDialogProperties.open(event.originalEvent, event.layer, mapLayer.featureGroup);
                L.DomEvent.preventDefault(event);
                L.DomEvent.stopPropagation(event);
                state.leafletMap.on('movestart', () => {
                    props.statusDialogProperties.close();
                    state.leafletMap.off('movestart');
                });
            });
            props.statusDialogCreate.close();
        }
    }
    function onEnter(event) {
        if (event.key === 'Enter') {
            onCreateLayer();
        }
    }
    return (React.createElement(Dialog, { title: 'Create New Layer', hidden: props.statusDialogCreate.current.hidden, onDismiss: () => { props.statusDialogCreate.close(); } },
        React.createElement(TextField, { label: "Name: ", required: true, onChange: (event, value) => { setNewLayername(value); }, defaultValue: '', placeholder: '', onKeyPress: onEnter }),
        React.createElement(DialogFooter, null,
            React.createElement(DefaultButton, { onClick: () => { props.statusDialogCreate.close(); } }, "Close"),
            React.createElement(PrimaryButton, { onClick: () => { onCreateLayer(); }, text: "Create Layer" }))));
}
//# sourceMappingURL=map_create_layer.js.map