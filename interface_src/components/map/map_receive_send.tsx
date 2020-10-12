import React, { useState } from 'react'; // eslint-disable-line
import L from 'leaflet';
import {
  DefaultButton, PrimaryButton, Dialog, DialogFooter, Dropdown,
} from '@fluentui/react';
import {
  oneActiveLayer, getFirstLayerKey, getLayer,
} from './map_layer_control';

interface WindowState extends Window { state: any; }
declare let window: WindowState;

export default function ReceiveDialog(props:any) {
  const { state } = window;
  const [selectedLayer, setSelectedLayer] = useState(getFirstLayerKey());

  function addDataToLayer() {
    const mapLayer = getLayer(selectedLayer);

    try {
      for (let i = 0; i < props.data.features.length; i += 1) {
        const feature = props.data.features[i];
        mapLayer.featureGroup.addLayer(
          L.geoJSON(feature, {
            pointToLayer(_feature, latlng) {
              const newlayer = L.circleMarker(latlng, {
                color: mapLayer.style.edgeColor,
                weight: mapLayer.style.weight,
                opacity: mapLayer.style.edgeOpacity,
                fillOpacity: mapLayer.style.fillOpacity,
                fillColor: mapLayer.style.fillColor,
                radius: mapLayer.style.radius,
                properties: feature.properties,
              });
              return newlayer;
            },
          }),
        );
      }
    } catch (err) {
      console.log(err);
      throw new Error('Unable to parse data received from Excel. Malformed?');
    }

    props.statusDialogReceive.close();
  }

  if (oneActiveLayer) {
    setSelectedLayer(getFirstLayerKey());
    addDataToLayer();
    return (null);
  }

  return (
    <Dialog
    title={'Add data to layer'}
    hidden={props.statusDialogReceive.current.hidden}
    onDismiss={() => { props.statusDialogReceive.close(); } }
    >
      <Dropdown
      label="Send selected layer to Excel."
      options={state.layers.length === 0 ? [{ text: '', key: 0 }] : state.layers.map((e:any) => ({ text: e.name, key: e.key }))}
      onChange={(event:React.FormEvent, value:any) => { setSelectedLayer(value.key); }}
      required
      />
      <DialogFooter>
        <PrimaryButton onClick={() => { addDataToLayer(); }} text="Add" />
        <DefaultButton onClick={() => { props.statusDialogReceive.close(); } } text="Don't add" />
      </DialogFooter>
    </Dialog>
  );
}
