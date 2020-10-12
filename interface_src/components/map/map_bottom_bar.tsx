import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, DialogFooter, Dialog, Dropdown,
} from '@fluentui/react';
import geojsonToArray from './geojson_to_array';
import { getLayer, getLayerCount } from './map_layer_control';
import { GeoJsonFeatureCollection } from '../../types';

export default function BottomBar(props:any) {
  const [sendDialog, setSendDialog] = useState({ hidden: true });

  function closeSendDialog() {
    setSendDialog({ hidden: true });
  }

  function openSendDialog() {
    if (getLayerCount() > 0) {
      setSendDialog({ hidden: false });
    }
  }

  function onSend(event:React.MouseEvent<HTMLButtonElement>):void {
    const { group, name } = getLayer(props.selectedLayer);

    const featureCollection:GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    group.eachLayer((layer:any) => {
      const properties = layer.options.properties || {};
      const layerGeoJSON = layer.toGeoJSON();

      if (layerGeoJSON.type === 'FeatureCollection') {
        for (let i = 0; i < layerGeoJSON.features.length; i += 1) {
          const feature = layerGeoJSON.features[i];

          if ((feature.properties === undefined || feature.properties === {}) && (properties !== {} && properties !== undefined)) {
            feature.properties = properties;
          }

          featureCollection.features.push(feature);
        }
      } else {
        layerGeoJSON.properties = properties;
        featureCollection.features.push(layerGeoJSON);
      }
    });

    const cells = geojsonToArray(featureCollection, name);

    props.sendToParent('dataFromMap', cells);
    closeSendDialog();
    event.preventDefault();
  }

  function onRequest(event:React.MouseEvent<HTMLButtonElement>):void {
    props.sendToParent('requestData');
    event.preventDefault();
  }

  return (
    <div id="map-bottom-bar">
      <Dialog
        title={'Send layer to Excel.'}
        hidden={sendDialog.hidden}
        onDismiss={() => { closeSendDialog(); } }
      >
        <Dropdown
          label="Send selected layer to Excel."
          options={getLayerCount() === 0 ? [{ text: '', key: -1 }] : window.state.layers.map((e:any) => ({ text: e.name, key: e.key }))}
          onChange={(event:React.FormEvent, value:any) => { props.setSelectedLayer(value.key); }}
          required
        />
        <DialogFooter>
          <PrimaryButton onClick={onSend} text="Send" />
          <DefaultButton onClick={() => { closeSendDialog(); } } text="Don't send" />
        </DialogFooter>
      </Dialog>
      <PrimaryButton text="Request Excel Data" onClick={onRequest} />
      <DefaultButton text="Send Data to Excel" onClick={() => { openSendDialog(); }} />
    </div>
  );
}
