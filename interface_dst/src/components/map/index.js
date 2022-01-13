// Libraries
import React, { useEffect, useState, useCallback } from 'react'; // eslint-disable-line
import L from 'leaflet';
import { Text, MessageBar, MessageBarType } from '@fluentui/react';
import 'leaflet.locatecontrol';
// Components
import MapPanel from './map_panel';
import CreateLayer from './map_create_layer';
import Properties from './map_properties';
import SelectLayer from './map_select_layer';
import BottomBar from './map_bottom_bar';
// Functions
import { addMarkerToLayer, createNewMapLayer, getFirstLayerKey, getLayerCount,
// addDataToLayer,
 } from './map_layers';
const { state } = window;
function initialiseMap(mapContainer) {
    const leafletMap = L.map(mapContainer, {
        center: [7.955811115092113, -1.0050627119953766],
        zoom: 7,
        minZoom: 6,
        maxZoom: 16,
        renderer: L.canvas(),
        zoomControl: false,
    });
    const southWest = L.latLng(4.6935231174772536, -3.3005816097563123);
    const northEast = L.latLng(11.2178034596280654, 1.2368344424300484);
    const mybounds = L.latLngBounds(southWest, northEast);
    const layers = {
        base: {
            osm: L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 6,
                maxZoom: 16,
            }),
            esri: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            }),
            s2_2020: L.tileLayer('https://{s}.imap.niras.dk/ghana/2020/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            s2_2019: L.tileLayer('https://{s}.imap.niras.dk/ghana/2019/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            empty: L.tileLayer(''),
        },
        overlay: {
            ndvi: L.tileLayer('https://{s}.imap.niras.dk/ghana/ndvi/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            s1_bs: L.tileLayer('https://{s}.imap.niras.dk/ghana/grd/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            s1_coh: L.tileLayer('https://{s}.imap.niras.dk/ghana/coh/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            s1_cxb: L.tileLayer('https://{s}.imap.niras.dk/ghana/cxb/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            s1_nl: L.tileLayer('https://{s}.imap.niras.dk/ghana/nightlights/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }),
            height: L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/terrain/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
            }),
            slope: L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/slope/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
            }),
            urban_status: L.tileLayer('https://{s}.imap.niras.dk/ghana/tiles_classification/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 15, bounds: mybounds,
            }),
            urban_status_simple: L.tileLayer('https://{s}.imap.niras.dk/ghana/tiles_classification_simple/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 15, bounds: mybounds,
            }),
        },
    };
    const overlaymaps = {
        'Nighttime Lights (2020)': layers.overlay.s1_nl,
        'Normalised Vegetation Index': layers.overlay.ndvi,
        'Interferometric Coherence': layers.overlay.s1_coh,
        'SAR Backscatter': layers.overlay.s1_bs,
        'Coherence x Backscatter': layers.overlay.s1_cxb,
        'Terrain (Slope)': layers.overlay.slope,
        'Terrain (Height)': layers.overlay.height,
        'Urban Status': layers.overlay.urban_status,
        'Urban Status (simple)': layers.overlay.urban_status_simple,
    };
    const basemaps = {
        OpenStreetMap: layers.base.osm,
        'Esri WorldMap': layers.base.esri,
        '2020 (RGB)': layers.base.s2_2020,
        '2019 (RGB)': layers.base.s2_2019,
        'Without background': layers.base.empty,
    };
    state.maplayers = layers;
    L.control.scale().addTo(leafletMap);
    L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);
    // @ts-ignore-line
    L.control.locate({ position: 'bottomright', icon: 'location-icon' }).addTo(leafletMap);
    L.control.layers(basemaps, overlaymaps, { collapsed: true }).addTo(leafletMap);
    layers.base.s2_2020.addTo(leafletMap);
    return leafletMap;
}
function Map() {
    document.title = 'Map';
    let mapContainer;
    // Variables
    const [user, setUser] = useState('');
    const [selectedLayer, setSelectedLayer] = useState(-1);
    // Surfaces
    const [panelLayers, setPanelLayers] = useState({ hidden: true });
    const [calloutSelect, setCalloutSelect] = useState({ hidden: true, data: null, target: null });
    const [dialogCreate, setDialogCreate] = useState({ hidden: true, name: '' });
    const [errorbar, setErrorbar] = useState({ hidden: true, text: 'Default message', type: MessageBarType.warning });
    const [dialogProperties, setDialogProperties] = useState({
        hidden: true, position: {}, marker: null, featureGroup: null,
    });
    // Open and close functions (STATUS)
    const statusPanel = {
        open: () => setPanelLayers({ hidden: false }),
        close: () => setPanelLayers({ hidden: true }),
        current: panelLayers,
    };
    const statusCalloutSelect = {
        open: (data = null, target = null) => setCalloutSelect({ hidden: false, data, target }),
        close: () => setCalloutSelect({ hidden: true, data: null, target: null }),
        current: calloutSelect,
    };
    const statusDialogCreate = {
        open: () => setDialogCreate({ name: '', hidden: false }),
        close: () => setDialogCreate({ name: '', hidden: true }),
        current: dialogCreate,
    };
    const statusDialogProperties = {
        open: (position, marker, featureGroup) => setDialogProperties({
            hidden: false, position, marker, featureGroup,
        }),
        close: () => setDialogProperties({
            hidden: true, position: {}, marker: null, featureGroup: null,
        }),
        current: dialogProperties,
    };
    const statusErrorbar = {
        open: (text, type) => {
            window.clearTimeout(state.warningTimer);
            setErrorbar({ hidden: false, text, type });
            state.warningTimer = window.setTimeout(() => {
                setErrorbar({ hidden: true, text: 'Default message', type: MessageBarType.info });
            }, 6000);
        },
        close: () => setErrorbar({ hidden: true, text: 'Default message', type: MessageBarType.info }),
    };
    const autoCreateNewLayer = useCallback((layerName = 'Default', from_db = false, key = null) => {
        const mapLayer = createNewMapLayer(layerName, from_db, key);
        setSelectedLayer(mapLayer.key);
        mapLayer.featureGroup.on('click', (event) => {
            setDialogProperties({
                hidden: false,
                position: event.originalEvent,
                marker: event.layer,
                featureGroup: mapLayer.featureGroup,
            });
            L.DomEvent.preventDefault(event);
            L.DomEvent.stopPropagation(event);
            state.leafletMap.on('movestart', () => {
                setDialogProperties({
                    hidden: true, position: {}, marker: null, featureGroup: null,
                });
                state.leafletMap.off('movestart');
            });
        });
    }, []);
    // Run on startup
    useEffect(() => {
        state.leafletMap = initialiseMap(mapContainer);
        state.leafletMap.on('click', (event) => {
            state.click = (Object.assign(Object.assign({}, state.click), {
                position: event.originalEvent,
                latlng: [event.latlng.lat, event.latlng.lng],
            }));
            let key = -1;
            const layerCount = getLayerCount();
            if (layerCount === 0) {
                autoCreateNewLayer();
            }
            if (layerCount <= 1) {
                key = getFirstLayerKey();
                setSelectedLayer(key);
                addMarkerToLayer(key);
            }
            else {
                setCalloutSelect({ hidden: false, data: null, target: null });
                state.leafletMap.on('movestart', () => {
                    setCalloutSelect({ hidden: true, data: null, target: null });
                    state.leafletMap.off('movestart');
                });
            }
        });
    }, [mapContainer, autoCreateNewLayer]);
    return (React.createElement("div", { id: "map-wrapper" },
        errorbar.hidden || React.createElement(MessageBar, { messageBarType: errorbar.type, className: "message-bar", dismissButtonAriaLabel: "Close", truncated: true, onDismiss: () => { setErrorbar({ hidden: true, text: 'Default Message', type: MessageBarType.info }); } },
            React.createElement(Text, null, errorbar.text)),
        React.createElement(CreateLayer, { statusDialogCreate: statusDialogCreate, statusDialogProperties: statusDialogProperties, setSelectedLayer: setSelectedLayer }),
        React.createElement(SelectLayer, { selectedLayer: selectedLayer, setSelectedLayer: setSelectedLayer, statusCalloutSelect: statusCalloutSelect }),
        React.createElement(Properties, { statusDialogProperties: statusDialogProperties }),
        React.createElement(MapPanel, { selectedLayer: selectedLayer, setSelectedLayer: setSelectedLayer, statusPanel: statusPanel, statusDialogCreate: statusDialogCreate }),
        React.createElement(BottomBar, { selectedLayer: selectedLayer, setSelectedLayer: setSelectedLayer, statusDialogCreate: statusDialogCreate, statusErrorbar: statusErrorbar, statusCalloutSelect: statusCalloutSelect, autoCreateNewLayer: autoCreateNewLayer }),
        React.createElement("div", { id: "map", ref: (el) => { mapContainer = el; } })));
}
export default Map;
//# sourceMappingURL=index.js.map