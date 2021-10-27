import React, { useState, useEffect } from 'react'; // eslint-disable-line
import { DefaultButton, PrimaryButton, Text, Slider, Dialog, DialogFooter, TextField, } from '@fluentui/react';
import ColorSelector from './map_styler_color';
import { getLayer, getLayerCount, updateLayerStyle, updateLayerName, } from './map_layers';
const defaultStyle = {
    fillColor: '#F2E205',
    edgeColor: '#201f1e',
    fillOpacity: 1.0,
    edgeOpacity: 1.0,
    weight: 1.0,
    radius: 5,
};
export default function Styler(props) {
    const [selectedStyle, setSelectedStyle] = useState(defaultStyle);
    const [layerName, setLayerName] = useState('Default');
    const [colorPicker, setColorPicker] = useState({ hidden: true, selected: 'fill' });
    function updatePickers(value) {
        setSelectedStyle(Object.assign(Object.assign({}, selectedStyle), value));
    }
    const statusColorPicker = {
        open: (selected) => setColorPicker({ hidden: false, selected }),
        close: () => setColorPicker({ hidden: true, selected: colorPicker.selected }),
        current: colorPicker,
    };
    function onUpdateStyle() {
        updateLayerName(props.selectedLayer, layerName);
        updateLayerStyle(props.selectedLayer, selectedStyle);
        props.statusDialogStyle.close();
    }
    function onEnter(event) {
        if (event.key === 'Enter') {
            onUpdateStyle();
        }
    }
    useEffect(() => {
        if (getLayerCount() > 0) {
            const { style, name } = getLayer(props.selectedLayer);
            setSelectedStyle(style);
            setLayerName(name);
        }
    }, [props.selectedLayer]);
    return (React.createElement("div", { className: "container" },
        React.createElement(Dialog, { title: `Edit layer - ${getLayerCount() > 0 ? getLayer(props.selectedLayer).name : 'layername'}`, hidden: props.statusDialogStyle.current.hidden, onDismiss: () => { props.statusDialogStyle.close(); } },
            React.createElement("div", { id: "modal-styler", onClick: () => { if (!statusColorPicker.current.hidden) {
                    statusColorPicker.close();
                } }, onKeyPress: onEnter },
                React.createElement(TextField, { label: "Name", defaultValue: getLayerCount() > 0 ? getLayer(props.selectedLayer).name : 'layername', onChange: (event, value) => { setLayerName(value); } }),
                React.createElement("div", { className: "sliders", onKeyPress: onEnter },
                    React.createElement(Slider, { label: "Radius", min: 0.5, max: 12, step: 0.5, value: selectedStyle.radius, showValue: true, onChange: (value) => {
                            updatePickers({ radius: value });
                        } }),
                    React.createElement(Slider, { label: "Fill Opacity", min: 0, max: 1, step: 0.01, value: selectedStyle.fillOpacity, showValue: true, onChange: (value) => {
                            updatePickers({ fillOpacity: value });
                        } }),
                    React.createElement(Slider, { label: "Edge Opacity", min: 0, max: 1, step: 0.01, value: selectedStyle.edgeOpacity, showValue: true, onChange: (value) => {
                            updatePickers({ edgeOpacity: value });
                        } }),
                    React.createElement(Slider, { label: "Edge Width", min: 0, max: 2, step: 0.1, value: selectedStyle.weight, showValue: true, onChange: (value) => {
                            updatePickers({ weight: value });
                        } }),
                    React.createElement(ColorSelector, { statusColorPicker: statusColorPicker, selectedStyle: selectedStyle, updatePickers: updatePickers }),
                    React.createElement(Text, { block: true, variant: "medium" }, "Fill Color: "),
                    React.createElement("div", { style: { background: selectedStyle.fillColor }, className: "colorOpen fill", onClick: () => { statusColorPicker.open('fill'); } }),
                    React.createElement(Text, { block: true, variant: "medium" }, "Edge Color: "),
                    React.createElement("div", { style: { background: selectedStyle.edgeColor }, className: "colorOpen edge", onClick: () => { statusColorPicker.open('edge'); } }))),
            React.createElement(DialogFooter, null,
                React.createElement(PrimaryButton, { onClick: () => { if (layerName.length >= 3 && layerName.length < 25) {
                        onUpdateStyle();
                    } }, text: "Update style" }),
                React.createElement(DefaultButton, { onClick: () => { props.statusDialogStyle.close(); }, text: "Dismiss" })))));
}
//# sourceMappingURL=map_styler.js.map