import React, { useState, useEffect, FormEvent } from 'react'; // eslint-disable-line
import {
  DefaultButton, PrimaryButton, Text, Slider, Dialog, DialogFooter, TextField,
} from '@fluentui/react';
import ColorSelector from './map_styler_color';
import {
  getLayer, getLayerCount, updateLayerStyle, updateLayerName,
} from './map_layers';
import { Style } from '../../types';

const defaultStyle:Style = {
  fillColor: '#F2E205',
  edgeColor: '#201f1e',
  fillOpacity: 1.0,
  edgeOpacity: 1.0,
  weight: 1.0,
  radius: 5,
};

export default function Styler(props:any) {
  const [selectedStyle, setSelectedStyle] = useState(defaultStyle);
  const [layerName, setLayerName] = useState('Default');
  const [colorPicker, setColorPicker] = useState({ hidden: true, selected: 'fill' });

  function updatePickers(value:object) {
    setSelectedStyle({
      ...selectedStyle,
      ...value,
    });
  }

  const statusColorPicker = {
    open: (selected:string) => setColorPicker({ hidden: false, selected }),
    close: () => setColorPicker({ hidden: true, selected: colorPicker.selected }),
    current: colorPicker,
  };

  function onUpdateStyle() {
    updateLayerName(props.selectedLayer, layerName);
    updateLayerStyle(props.selectedLayer, selectedStyle);
    props.statusDialogStyle.close();
  }

  function onEnter(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') { onUpdateStyle(); }
  }

  useEffect(() => {
    if (getLayerCount() > 0) {
      const { style, name } = getLayer(props.selectedLayer);
      setSelectedStyle(style);
      setLayerName(name);
    }
  }, [props.selectedLayer]);

  return (
    <div className="container">
      <Dialog
        title={`Edit layer - ${getLayerCount() > 0 ? getLayer(props.selectedLayer).name : 'layername'}`}
        hidden={props.statusDialogStyle.current.hidden}
        onDismiss={() => { props.statusDialogStyle.close(); }}
      >
        <div id="modal-styler"
          onClick={() => { if (!statusColorPicker.current.hidden) { statusColorPicker.close(); } }}
          onKeyPress={onEnter}
        >
          <TextField
            label="Name"
            defaultValue={getLayerCount() > 0 ? getLayer(props.selectedLayer).name : 'layername'}
            onChange={(event, value) => { setLayerName(value); }}
          />
          <div className="sliders" onKeyPress={onEnter}>
            <Slider label="Radius" min={0.5} max={12} step={0.5} value={selectedStyle.radius} showValue onChange={(value:number) => {
              updatePickers({ radius: value });
            }} />
            <Slider label="Fill Opacity" min={0} max={1} step={0.01} value={selectedStyle.fillOpacity} showValue onChange={(value:number) => {
              updatePickers({ fillOpacity: value });
            }} />
            <Slider label="Edge Opacity" min={0} max={1} step={0.01} value={selectedStyle.edgeOpacity} showValue onChange={(value:number) => {
              updatePickers({ edgeOpacity: value });
            }} />
            <Slider label="Edge Width" min={0} max={2} step={0.1} value={selectedStyle.weight} showValue onChange={(value:number) => {
              updatePickers({ weight: value });
            }} />
            <ColorSelector
              statusColorPicker={statusColorPicker}
              selectedStyle={selectedStyle}
              updatePickers={updatePickers}
            />
            <Text block variant="medium">Fill Color: </Text>
              <div style={{ background: selectedStyle.fillColor }} className="colorOpen fill" onClick={() => { statusColorPicker.open('fill'); }}></div>
            <Text block variant="medium">Edge Color: </Text>
              <div style={{ background: selectedStyle.edgeColor }} className="colorOpen edge" onClick={() => { statusColorPicker.open('edge'); }}></div>
          </div>
        </div>
      <DialogFooter>
        <PrimaryButton onClick={() => { if (layerName.length >= 3 && layerName.length < 25) { onUpdateStyle(); } }} text="Update style" />
        <DefaultButton onClick={() => { props.statusDialogStyle.close(); }} text="Dismiss" />
      </DialogFooter>
    </Dialog>
    </div>
  );
}
