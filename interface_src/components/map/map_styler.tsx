import React, { useState, useEffect } from 'react'; // eslint-disable-line
import {
  DefaultButton, PrimaryButton, Text, Slider, Dialog, DialogFooter, TextField,
} from '@fluentui/react';
import ColorSelector from './map_styler_color';
import {
  getLayer, getLayerCount, updateLayerStyle, updateLayerName,
} from './map_layer_control';
import { updateState } from '../utils';

interface WindowState extends Window { state: any; }
declare let window: WindowState;

const default_style = {
  fillColor: '#F2E205',
  edgeColor: '#201f1e',
  fillOpacity: 1.0,
  edgeOpacity: 1.0,
  weight: 1.0,
  radius: 5,
  key: 0,
};

export default function Styler(props:any) {
  const { state } = window;

  const [selectedStyle, setSelectedStyle] = useState(default_style);
  const [layerName, setLayerName] = useState(getLayer(props.selectedlayer).name);
  const [colorPicker, setColorPicker] = useState({ hidden: true, selected: 'fill' });
  const [pickers, setPickers] = useState(default_style);

  function updatePickers(obj:any) { setPickers(updateState(pickers, obj)); } // eslint-disable-line

  const statusColorPicker = {
    open: (selected:string) => setColorPicker({ hidden: false, selected }),
    close: () => setColorPicker({ hidden: false, selected: colorPicker.selected }),
    current: colorPicker,
  };

  function onDismiss() {
    updatePickers(default_style);
    props.statusDialogStyle.close();
  }

  function onUpdateStyle() {
    updateLayerName(props.selectedLayer, layerName);
    updateLayerStyle(props.selectedLayer, selectedStyle);
    props.statusDialogStyle.close();
  }

  useEffect(() => {
    if (getLayerCount() > 0) {
      const { style } = getLayer(props.selectedLayer);
      setSelectedStyle(style);
      updatePickers(style);
    }
  }, [updatePickers, props.selectedLayer]);

  return (
    <div className="container">
      <ColorSelector
        statusColorPicker={statusColorPicker}
        selectedStyle={selectedStyle}
        updatePickers={updatePickers}
      />
      <Dialog
        title={`Edit layer - ${layerName}`}
        hidden={props.statusDialogStyle.hidden}
        onDismiss={() => { onDismiss(); }}
      >
        <div id="modal-styler">
          <TextField
            label="Name"
            defaultValue={state.layers.length !== 0 ? getLayer(props.selectedlayer).name : 'layername'}
            onChange={(event, value) => { setLayerName(value); }}
          />
          <div className="sliders">
            <Slider label="Radius" min={0.5} max={12} step={0.5} value={selectedStyle.radius} showValue onChange={(event, value) => {
              updatePickers({ radius: value });
            }} />
            <Slider label="Fill Opacity" min={0} max={1} step={0.01} value={selectedStyle.fillOpacity} showValue onChange={(event, value) => {
              updatePickers({ fillOpacity: value });
            }} />
            <Slider label="Edge Opacity" min={0} max={1} step={0.01} value={selectedStyle.edgeOpacity} showValue onChange={(event, value) => {
              updatePickers({ edgeOpacity: value });
            }} />
            <Slider label="Edge Width" min={0} max={2} step={0.1} value={selectedStyle.weight} showValue onChange={(event, value) => {
              updatePickers({ weight: value });
            }} />

            <Text block variant="medium">Fill Color: </Text>
              <div style={{ background: selectedStyle.fillColor }} className="colorOpen fill" onClick={() => { statusColorPicker.open('fill'); }}></div>
            <Text block variant="medium">Edge Color: </Text>
              <div style={{ background: selectedStyle.edgeColor }} className="colorOpen edge" onClick={() => { statusColorPicker.close(); }}></div>
          </div>
        </div>
      <DialogFooter>
        <PrimaryButton onClick={() => { if (layerName.length >= 3 && layerName.length < 25) { onUpdateStyle(); } }} text="Update style" />
        <DefaultButton onClick={() => { onDismiss(); }} text="Dismiss" />
      </DialogFooter>
    </Dialog>
    </div>
  );
}
