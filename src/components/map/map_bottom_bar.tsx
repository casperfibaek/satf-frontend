import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, CompoundButton, DialogFooter, Dialog, Dropdown, MessageBarType,
} from '@fluentui/react';
import geojsonToArray from './geojson_to_array';
import arrayToGeojson from './array_to_geojson';
import {
  getLayer, checkIfLayerExists, getLayerCount, getFirstLayerKey, addDataToLayer, addMarkerToLayer, addMarkerToLayerFromDB, createNewMapLayer
} from './map_layers';
import { GeoJsonFeatureCollection, WindowState } from '../../types';
import { getSelectedCells, addCellsToSheet } from '../../excel_interaction';
// import { logToServer } from '../../utils';
import { setValueForKey ,getValueForKey, removeValueForKey, getApiUrl } from '../../utils';

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
    console.log(cells)
    try {
      await addCellsToSheet(cells);
    } catch (error) {
      props.statusErrorbar.open(String(error.description), MessageBarType.error);
      console.log(error);
    }
    closeSendDialog();
  }

  async function onFetchFromDB(event:React.MouseEvent<HTMLButtonElement>):Promise<void> {
    console.log('fetching geoms frontend...')

    console.log(`${getApiUrl()}/get_user_geometries/${props.user}`)
    try {
      const response = await fetch(`${getApiUrl()}/get_user_geometries/${props.user}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      });
  
      const { results } = await response.json()
    
      results.forEach(x=>{
        const { geom_id, geom, layer_id, layer_name } = x
        if (!checkIfLayerExists(layer_id)) {
          props.autoCreateNewLayer(layer_name, true, layer_id);
        }
        const { coordinates } = JSON.parse(geom)        
        addMarkerToLayerFromDB(layer_id, coordinates.reverse(), geom_id)
      })
    } catch (err) {
      console.log(err)
    }
    
  ///////////////////
  }

  async function onSendToDB(event:React.MouseEvent<HTMLButtonElement>):Promise<void> {

    console.log(props.selectedLayer)

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

    try {
      const response = await fetch(`${getApiUrl()}/send_to_DB/${props.user}`, {
        
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, featureCollection })
      })
      const data = response.json()
    } catch (err) {
      console.log(err)
    }
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

    if (layerCount <= 1) {
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
      {/* <CompoundButton secondaryText="Fetch geometries from database." onClick={onFetchFromDB}>
        Fetch Layer
      </CompoundButton>
      <CompoundButton secondaryText="Fetch geometries from database." onClick={onSendToDB}>
        Update Database
      </CompoundButton> */}
      <PrimaryButton className="bottombar_request" text="Request Excel Data" onClick={onRequest} />

      <DefaultButton text="Send Data to Excel" onClick={onSend} />

    </div>
  );
}
