import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, DialogFooter, Dialog, Dropdown, MessageBarType,
} from '@fluentui/react';
import geojsonToArray from './geojson_to_array';
import arrayToGeojson from './array_to_geojson';
import {
  getLayer, getLayerCount, getFirstLayerKey, addDataToLayer,
} from './map_layers';
import { GeoJsonFeatureCollection, WindowState } from '../../types';
import { getSelectedCells, addCellsToSheet } from '../../excel_interaction';
// import { logToServer } from '../../utils';

declare let window: WindowState;

export default function BottomBar(props:any) {
  const { state } = window;
  const [sendDialog, setSendDialog] = useState({ hidden: true });

  function closeSendDialog() {
    setSendDialog({ hidden: true });
  }

  async function sendData():Promise<void> {
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
    try {
      await addCellsToSheet(cells);
    } catch (error) {
      props.statusErrorbar.open(String(error.description), MessageBarType.error);
      console.log(error);
    }
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
  
  async function onRequest(event:React.MouseEvent<HTMLButtonElement>):Promise<void> {
    let geojson;
    try {
      const cells = await getSelectedCells();
      geojson = await arrayToGeojson(cells);
    } catch (err) {
      const errorMessage = 'Unable to parse geojson from Excel';
      props.statusErrorbar.open(errorMessage, MessageBarType.error);
      throw new Error(err);
    }

    const layerCount = getLayerCount();
    if (layerCount === 0) {
      props.autoCreateNewLayer();
    }

    if (layerCount >= 1) {
      const key = getFirstLayerKey();
      props.setSelectedLayer(key);
      addDataToLayer(key, geojson);
    } else {
      props.statusCalloutSelect.open(geojson, '.bottombar_request');
    }
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
          options={getLayerCount() === 0 ? [{ text: '', key: -1 }] : state.layers.map((e:any) => ({ text: e.name, key: e.key }))}
          onChange={(event:React.FormEvent, value:any) => { props.setSelectedLayer(value.key); }}
          required
        />
        <DialogFooter>
          <PrimaryButton onClick={sendData} text="Send" />
          <DefaultButton onClick={() => { closeSendDialog(); } } text="Don't send" />
        </DialogFooter>
      </Dialog>
      <PrimaryButton className="bottombar_request" text="Request Excel Data" onClick={onRequest} />
      <DefaultButton text="Send Data to Excel" onClick={onSend} />
    </div>
  );
}
