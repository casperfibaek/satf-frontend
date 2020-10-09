import React, { useState, useEffect } from 'react'; // eslint-disable-line
import {
  DefaultButton, PrimaryButton, Text, Slider, ColorPicker, Callout, DirectionalHint, Dialog, DialogFooter, TextField,
} from '@fluentui/react';

function ColorSelector(props:any) {
  const [color, setColor] = useState(props.colorPickerStatus.selected === 'fill' ? props.fillColor : props.edgeColor);

  const updateColor = (evt:any, colorObject:any) => {
    setColor(colorObject.str);
    if (props.colorPickerStatus.selected === 'fill') {
      props.setFillColor(color);
    } else {
      props.setEdgeColor(color);
    }
  };

  if (!props.colorPickerStatus.hidden) {
    return (
      <ColorPicker
        color={color}
        onChange={updateColor}
        alphaType={'none'}
        showPreview={false}
      />
    );
  }
  return (null);
}

export default function Styler(props:any) {
  const [selectedStyle, setSelectedStyle] = useState({
    fillColor: '#F2E205',
    edgeColor: '#201f1e',
    fillOpacity: 1.0,
    edgeOpacity: 1.0,
    weight: 1.0,
    radius: 5,
    key: 0,
  });
  const [layerName, setLayerName] = useState('Default');
  const [sliderValueRadius, setSliderValueRadius] = useState(selectedStyle.radius);
  const sliderOnChangeRadius = (value: number) => setSliderValueRadius(value);

  const [sliderValueFillOpacity, setSliderValueFillOpacity] = useState(selectedStyle.fillOpacity);
  const sliderOnChangeFill = (value: number) => setSliderValueFillOpacity(value);

  const [sliderValueEdgeOpacity, setSliderValueEdgeOpacity] = useState(selectedStyle.edgeOpacity);
  const sliderOnChangeEdge = (value: number) => setSliderValueEdgeOpacity(value);

  const [sliderValueEdgeWeight, setSliderValueEdgeWeight] = useState(selectedStyle.weight);
  const sliderOnChangeEdgeWeight = (value: number) => setSliderValueEdgeWeight(value);

  const [colorPicker, setColorPicker] = useState({ hidden: true, selected: 'fill' });
  const [fillColor, setFillColor] = useState(selectedStyle.fillColor);
  const [edgeColor, setEdgeColor] = useState(selectedStyle.edgeColor);

  function onDismiss() {
    setSliderValueRadius(selectedStyle.radius);
    sliderOnChangeFill(selectedStyle.fillOpacity);
    sliderOnChangeEdge(selectedStyle.edgeOpacity);
    sliderOnChangeEdgeWeight(selectedStyle.weight);
    setFillColor(selectedStyle.fillColor);
    setEdgeColor(selectedStyle.edgeColor);

    props.setStyleDialog({ hidden: true });
  }

  function onUpdateStyle() {
    props.changeLayername(props.selectedLayer, layerName);
    props.updateStyle({
      radius: sliderValueRadius,
      weight: sliderValueEdgeWeight,
      fillColor,
      edgeColor,
      fillOpacity: sliderValueFillOpacity,
      edgeOpacity: sliderValueEdgeOpacity,
      key: props.selectedLayer,
    });
    props.setStyleDialog({ hidden: true });
  }

  useEffect(() => {
    if (window.mapLayers.length !== 0) {
      const { style } = window.mapLayers.filter((e:any) => (e.key === props.selectedLayer))[0];
      if (style) { setSelectedStyle(style); }

      setSliderValueRadius(selectedStyle.radius);
      sliderOnChangeFill(selectedStyle.fillOpacity);
      sliderOnChangeEdge(selectedStyle.edgeOpacity);
      sliderOnChangeEdgeWeight(selectedStyle.weight);
      setFillColor(selectedStyle.fillColor);
      setEdgeColor(selectedStyle.edgeColor);
    }
  }, [props.styles, props.selectedLayer, selectedStyle]);

  return (
    <Dialog
    title={'Edit layer'}
    hidden={props.styleDialog.hidden}
    onDismiss={() => { onDismiss(); }}
  >
    <div id="modal-styler">
      <TextField
        label="Name"
        defaultValue={(window.mapLayers.length !== 0 && window.mapLayers.filter((e:any) => e.key === props.selectedLayer)[0]) ? window.mapLayers.filter((e:any) => e.key === props.selectedLayer)[0].name : 'layername'}
        onChange={(event, value) => { setLayerName(value); }}
      />
      {!colorPicker.hidden && <Callout
        role="alertdialog"
        setInitialFocus
        gapSpace={0}
        onDismiss={() => { setColorPicker({ hidden: true, selected: 'fill' }); }}
        target={colorPicker.selected === 'fill' ? '.colorOpen.fill' : '.colorOpen.edge'}
        directionalHint={DirectionalHint.rightCenter}
        >
        <ColorSelector colorPickerStatus={colorPicker} fillColor={fillColor} edgeColor={edgeColor} setFillColor={setFillColor} setEdgeColor={setEdgeColor}/>
        </Callout>
      }
      <div className="sliders">
        <Slider label="Radius" min={0.5} max={12} step={0.5} value={sliderValueRadius} showValue onChange={sliderOnChangeRadius} />
        <Slider label="Fill Opacity" min={0} max={1} step={0.01} value={sliderValueFillOpacity} showValue onChange={sliderOnChangeFill} />
        <Slider label="Edge Opacity" min={0} max={1} step={0.01} value={sliderValueEdgeOpacity} showValue onChange={sliderOnChangeEdge} />
        <Slider label="Edge Width" min={0} max={2} step={0.1} value={sliderValueEdgeWeight} showValue onChange={sliderOnChangeEdgeWeight} />
        <Text block variant="medium">Fill Color: </Text><div style={{ background: fillColor }} className="colorOpen fill" onClick={() => { setColorPicker({ hidden: false, selected: 'fill' }); }}></div>
        <Text block variant="medium">Edge Color: </Text><div style={{ background: edgeColor }} className="colorOpen edge" onClick={() => { setColorPicker({ hidden: false, selected: 'edge' }); }}></div>
      </div>
    </div>
    <DialogFooter>
      <PrimaryButton onClick={() => { if (layerName.length >= 3 && layerName.length < 25) { onUpdateStyle(); } }} text="Update style" />
      <DefaultButton onClick={() => { onDismiss(); }} text="Dismiss" />
    </DialogFooter>
  </Dialog>

  );
}
