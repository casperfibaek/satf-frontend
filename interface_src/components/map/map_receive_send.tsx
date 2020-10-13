import React, { useState } from 'react'; // eslint-disable-line
import L from 'leaflet';
import {
  DefaultButton, PrimaryButton, Dialog, DialogFooter, Dropdown,
} from '@fluentui/react';
import { getLayer } from './map_layers';

interface WindowState extends Window { state: any; }
declare let window: WindowState;

export function addDataToLayer(key:number, data:any) {
  const mapLayer = getLayer(key);

  try {
    for (let i = 0; i < data.features.length; i += 1) {
      const feature = data.features[i];
      L.geoJSON(feature, {
        pointToLayer(_feature, latlng) {
          const newLayer = L.circleMarker(latlng, {
            color: mapLayer.style.edgeColor,
            weight: mapLayer.style.weight,
            opacity: mapLayer.style.edgeOpacity,
            fillOpacity: mapLayer.style.fillOpacity,
            fillColor: mapLayer.style.fillColor,
            radius: mapLayer.style.radius,
            properties: feature.properties,
          });
          mapLayer.featureGroup.addLayer(newLayer);
          return newLayer;
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error('Unable to parse data received from Excel. Malformed?');
  }
}

export default function ReceiveDialog(props:any) {
  const { state } = window;

  function addData() {
    addDataToLayer(props.selectedLayer, props.data);
    props.statusDialogReceive.close();
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
      onChange={(event:React.FormEvent, value:any) => { props.setSelectedLayer(value.key); }}
      required
      />
      <DialogFooter>
        <PrimaryButton onClick={() => { addData(); }} text="Add" />
        <DefaultButton onClick={() => { props.statusDialogReceive.close(); } } text="Don't add" />
      </DialogFooter>
    </Dialog>
  );
}
