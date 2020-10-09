import React, { useState } from 'react'; // eslint-disable-line
import {
  PrimaryButton, DefaultButton, DialogFooter, Dialog, Dropdown,
} from '@fluentui/react';
import CreateLayer from './map_create_layer';
import geojsonToArray from './geojson_to_array';

interface MyMap extends Window {
  map: any;
  mapLayers: any[];
}

export default function BottomBar(props:any) {
  const [initialised, setInitialised] = useState(false);
  const [sendDialog, setSendDialog] = useState({ hidden: true });
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [createDialog, setCreateDialog] = useState({ hidden: false, name: '' });

  function closeSendDialog() {
    setSendDialog({ hidden: true });
    setInitialised(false);
  }

  function openSendDialog() {
    setInitialised(true);
    if (window.mapLayers.length !== 0) {
      setSendDialog({ hidden: false });
    }
  }

  function onSend(event:React.MouseEvent<HTMLButtonElement>):void {
    const { group, name } = window.mapLayers.filter((e:any) => e.key === selectedLayer)[0];

    const featureCollection = {
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
      {window.mapLayers.length === 0 && initialised && (
        <CreateLayer
          createDialog={createDialog}
          setCreateDialog={setCreateDialog}
          getLayerKey={props.getLayerKey}
          addLayer={props.addLayer}
          layers={window.mapLayers}
          notifyOnReselect
        />
      )}
      {window.mapLayers.length !== 0 && (
        <Dialog
          title={'Send layer to Excel.'}
          hidden={sendDialog.hidden}
          onDismiss={() => { closeSendDialog(); } }
        >
          <Dropdown
            label="Send selected layer to Excel."
            options={window.mapLayers.length === 0 ? [{ text: '', key: -1 }] : window.mapLayers.map((e:any) => ({ text: e.name, key: e.key }))}
            onChange={(event:React.FormEvent, value:any) => { setSelectedLayer(value.key); }}
            required
          />
          <DialogFooter>
            <PrimaryButton onClick={onSend} text="Send" />
            <DefaultButton onClick={() => { closeSendDialog(); } } text="Don't send" />
          </DialogFooter>
        </Dialog>
      )}

      <PrimaryButton text="Request Excel Data" onClick={onRequest} />
      <DefaultButton text="Send Data to Excel" onClick={() => { openSendDialog(); }} />
    </div>
  );
}
