import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, DialogFooter, Dialog, Dropdown, MessageBarType,
} from '@fluentui/react';
import geojsonToArray from './geojson_to_array';
import { getLayer, getLayerCount } from './map_layers';
import { GeoJsonFeatureCollection, WindowState } from '../../types';

declare let window: WindowState;

export default function BottomBar(props:any) {
  const [sendDialog, setSendDialog] = useState({ hidden: true });

  function closeSendDialog() {
    setSendDialog({ hidden: true });
  }

  function sendData():void {
    const { featureGroup, name } = getLayer(props.selectedLayer);

    const featureCollection:GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };

    featureGroup.eachLayer((layer:any) => {
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
  }

  function onSend(event:React.MouseEvent<HTMLButtonElement>):void {
    const layerCount = getLayerCount();
    if (layerCount === 0) {
      const errorMessage = 'No layers to send to excel';
      props.statusErrorbar.open(errorMessage, MessageBarType.error);
      throw new Error(errorMessage);
    } else if (layerCount === 1) {
      sendData();
    } else {
      setSendDialog({ hidden: false });
    }
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
          <PrimaryButton onClick={sendData} text="Send" />
          <DefaultButton onClick={() => { closeSendDialog(); } } text="Don't send" />
        </DialogFooter>
      </Dialog>
      <PrimaryButton text="Request Excel Data" onClick={onRequest} />
      <DefaultButton text="Send Data to Excel" onClick={onSend} />
    </div>
  );
}
