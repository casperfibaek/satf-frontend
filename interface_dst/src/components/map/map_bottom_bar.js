var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState } from 'react'; // eslint-disable-line
import { PrimaryButton, DefaultButton, DialogFooter, Dialog, Dropdown, MessageBarType, } from '@fluentui/react';
import geojsonToArray from './geojson_to_array';
import arrayToGeojson from './array_to_geojson';
import { getLayer, checkIfLayerExists, getLayerCount, getFirstLayerKey, addDataToLayer, addMarkerToLayerFromDB } from './map_layers';
import { getSelectedCells, addCellsToSheet } from '../../excel_interaction';
// import { logToServer } from '../../utils';
import { getApiUrl } from '../../utils';
export default function BottomBar(props) {
    const { state } = window;
    const [sendDialog, setSendDialog] = useState({ hidden: true });
    function closeSendDialog() {
        setSendDialog({ hidden: true });
    }
    function sendData() {
        return __awaiter(this, void 0, void 0, function* () {
            const { featureGroup, name } = getLayer(props.selectedLayer);
            const featureCollection = {
                type: 'FeatureCollection',
                features: [],
            };
            featureGroup.eachLayer((layer) => {
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
                }
                else {
                    layerGeoJSON.properties = properties;
                    featureCollection.features.push(layerGeoJSON);
                }
            });
            const cells = geojsonToArray(featureCollection, name);
            try {
                yield addCellsToSheet(cells);
            }
            catch (error) {
                props.statusErrorbar.open(String(error.description), MessageBarType.error);
                console.log(error);
            }
            closeSendDialog();
        });
    }
    function onFetchFromDB(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('fetching geoms frontend...');
            console.log(`${getApiUrl()}/get_user_geometries/${props.user}`);
            try {
                const response = yield fetch(`${getApiUrl()}/get_user_geometries/${props.user}`, {
                    method: 'get',
                    headers: { 'Content-Type': 'application/json' },
                });
                const { results } = yield response.json();
                results.forEach(x => {
                    const { geom_id, geom, layer_id, layer_name } = x;
                    if (!checkIfLayerExists(layer_id)) {
                        props.autoCreateNewLayer(layer_name, true, layer_id);
                    }
                    const { coordinates } = JSON.parse(geom);
                    addMarkerToLayerFromDB(layer_id, coordinates.reverse(), geom_id);
                });
            }
            catch (err) {
                console.log(err);
            }
            ///////////////////
        });
    }
    function onSendToDB(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(props.selectedLayer);
            const { featureGroup, name } = getLayer(props.selectedLayer);
            const featureCollection = {
                type: 'FeatureCollection',
                features: [],
            };
            featureGroup.eachLayer((layer) => {
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
                }
                else {
                    layerGeoJSON.properties = properties;
                    featureCollection.features.push(layerGeoJSON);
                }
            });
            try {
                const response = yield fetch(`${getApiUrl()}/send_to_DB/${props.user}`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, featureCollection })
                });
                const data = response.json();
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    function onSend(event) {
        const layerCount = getLayerCount();
        if (layerCount === 0) {
            const errorMessage = 'No layers to send to excel';
            props.statusErrorbar.open(errorMessage, MessageBarType.error);
            throw new Error(errorMessage);
        }
        else if (layerCount === 1) {
            sendData();
        }
        else {
            setSendDialog({ hidden: false });
        }
        event.preventDefault();
    }
    function onRequest(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let geojson;
            try {
                const cells = yield getSelectedCells();
                geojson = yield arrayToGeojson(cells);
            }
            catch (err) {
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
            }
            else {
                props.statusCalloutSelect.open(geojson, '.bottombar_request');
            }
            event.preventDefault();
        });
    }
    return (React.createElement("div", { id: "map-bottom-bar" },
        React.createElement(Dialog, { title: 'Send layer to Excel.', hidden: sendDialog.hidden, onDismiss: () => { closeSendDialog(); } },
            React.createElement(Dropdown, { label: "Send selected layer to Excel.", options: getLayerCount() === 0 ? [{ text: '', key: -1 }] : state.layers.map((e) => ({ text: e.name, key: e.key })), onChange: (event, value) => { props.setSelectedLayer(value.key); }, required: true }),
            React.createElement(DialogFooter, null,
                React.createElement(PrimaryButton, { onClick: sendData, text: "Send" }),
                React.createElement(DefaultButton, { onClick: () => { closeSendDialog(); }, text: "Don't send" }))),
        React.createElement(PrimaryButton, { className: "bottombar_request", text: "Request Excel Data", onClick: onRequest }),
        React.createElement(DefaultButton, { text: "Send Data to Excel", onClick: onSend })));
}
//# sourceMappingURL=map_bottom_bar.js.map