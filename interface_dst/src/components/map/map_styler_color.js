import React, { useState } from 'react'; // eslint-disable-line
import { ColorPicker, Callout, DirectionalHint, } from '@fluentui/react';
export default function ColorSelector(props) {
    const [color, setColor] = useState(props.statusColorPicker.selected === 'fill' ? props.selectedStyle.fillColor : props.selectedStyle.edgeColor);
    const updateColor = (evt, colorObject) => {
        setColor(colorObject.str);
        if (props.statusColorPicker.current.selected === 'fill') {
            props.updatePickers({ fillColor: color });
        }
        else {
            props.updatePickers({ edgeColor: color });
        }
    };
    return (React.createElement("div", null,
        React.createElement(Callout, { role: "alertdialog", hidden: props.statusColorPicker.current.hidden, setInitialFocus: true, gapSpace: 0, onDismiss: () => { props.statusColorPicker.close(); }, target: props.statusColorPicker.current.selected === 'fill' ? '.colorOpen.fill' : '.colorOpen.edge', directionalHint: DirectionalHint.rightCenter },
            React.createElement(ColorPicker, { color: props.statusColorPicker.current.selected === 'fill' ? props.selectedStyle.fillColor : props.selectedStyle.edgeColor, onChange: updateColor, alphaType: 'none', showPreview: false }))));
}
//# sourceMappingURL=map_styler_color.js.map