import React, { useState } from 'react'; // eslint-disable-line
import {
  ColorPicker, Callout, DirectionalHint,
} from '@fluentui/react';

export default function ColorSelector(props:any) {
  const [color, setColor] = useState(props.statusColorPicker.selected === 'fill' ? props.selectedStyle.fillColor : props.selectedStyle.edgeColor);

  const updateColor = (evt:any, colorObject:any) => {
    setColor(colorObject.str);
    if (props.statusColorPicker.current.selected === 'fill') {
      props.updatePickers({ fillColor: color });
    } else {
      props.updatePickers({ edgeColor: color });
    }
  };

  return (
    <div>
      <Callout
        role="alertdialog"
        hidden={props.statusColorPicker.current.hidden}
        setInitialFocus
        gapSpace={0}
        onDismiss={() => { props.statusColorPicker.close(); }}
        target={props.statusColorPicker.current.selected === 'fill' ? '.colorOpen.fill' : '.colorOpen.edge'}
        directionalHint={DirectionalHint.rightCenter}
      >
        <ColorPicker
          color={props.statusColorPicker.current.selected === 'fill' ? props.selectedStyle.fillColor : props.selectedStyle.edgeColor }
          onChange={updateColor}
          alphaType={'none'}
          showPreview={false}
        />
      </Callout>
    </div>
  );
}
