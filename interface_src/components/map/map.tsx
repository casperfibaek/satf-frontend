import React, { useEffect, useState } from 'react'; // eslint-disable-line
import L, { FeatureGroup, LeafletMouseEvent, CircleMarker } from 'leaflet';

// Components
import MapPanel from './map_panel';
import CreateLayer from './map_create_layer';
import Properties from './map_properties';
import ReceiveDialog, { addDataToLayer } from './map_receive_send';
import SelectLayer from './map_select_layer';
import BottomBar from './map_bottom_bar';

// Functions
import { onMessageFromParent, sendToParent, addEvent } from './communication';
import arrayToGeojson from './array_to_geojson';
import {
  addMarkerToLayer, createNewMapLayer, getFirstLayerKey, getLayerCount,
} from './map_layers';
import '../../assets/leaflet.css';

interface WindowState extends Window { state: any; }
declare let window: WindowState;

window.state = (window.state === undefined || window.state === null || window.state === {}) ? {} : window.state;
window.state = ({
  ...window.state,
  ...{
    initialise: {
      office: false,
      map: false,
    },
    map: {},
    layers: [],
    click: {},
  },
});
const { state } = window;

function initialiseMap(mapContainer:any) {
  const map = L.map(mapContainer, {
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

  L.control.scale().addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.control.layers(basemaps, overlaymaps, { collapsed: true }).addTo(map);
  layers.base.s2_2020.addTo(map);

  // https://github.com/Leaflet/Leaflet/issues/3575
  (function fixTileGap() {
    const originalInitTile:any = L.GridLayer.prototype._initTile;
    L.GridLayer.include({
      _initTile(tile:any) {
        originalInitTile.call(this, tile);

        const tileSize = this.getTileSize();

        tile.style.width = `${tileSize.x + 1}px`;  // eslint-disable-line
        tile.style.height = `${tileSize.y + 1}px`; // eslint-disable-line
      },
    });
  }());

  return map;
}

function Map() {
  document.title = 'Map';

  let mapContainer:any;

  // Variables
  const [selectedLayer, setSelectedLayer] = useState(-1);

  // Surfaces
  const [panelLayers, setPanelLayers] = useState({ hidden: true });
  const [calloutSelect, setCalloutSelect] = useState({ hidden: true });
  const [dialogCreate, setDialogCreate] = useState({ hidden: true, name: '' });
  const [dialogReceive, setDialogReceive] = useState({ hidden: true, data: {} });
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
    open: () => setCalloutSelect({ hidden: false }),
    close: () => setCalloutSelect({ hidden: true }),
    current: calloutSelect,
  };

  const statusDialogCreate = {
    open: () => setDialogCreate({ name: '', hidden: false }),
    close: () => setDialogCreate({ name: '', hidden: true }),
    current: dialogCreate,
  };

  const statusDialogReceive = {
    open: (data:any) => setDialogReceive({ hidden: false, data }),
    close: () => setDialogReceive({ hidden: true, data: {} }),
    current: dialogReceive,
  };

  const statusDialogProperties = {
    open: (position:MouseEvent, marker:CircleMarker, featureGroup:FeatureGroup) => setDialogProperties({
      hidden: false, position, marker, featureGroup,
    }),
    close: () => setDialogProperties({
      hidden: true, position: {}, marker: null, featureGroup: null,
    }),
    current: dialogProperties,
  };

  function autoCreateNewLayer() {
    const mapLayer = createNewMapLayer('Default');
    setSelectedLayer(mapLayer.key);

    mapLayer.featureGroup.on('click', (event:any) => {
      statusDialogProperties.open(event.originalEvent, event.layer, mapLayer.featureGroup);
      L.DomEvent.preventDefault(event);
      L.DomEvent.stopPropagation(event);
    });
  }

  // Events
  function onMapMouseClick(event:LeafletMouseEvent) {
    state.click = ({
      ...state.click,
      ...{
        position: event.originalEvent,
        latlng: [event.latlng.lat, event.latlng.lng],
      },
    });

    let key = -1;
    const layerCount = getLayerCount();
    if (layerCount === 0) {
      autoCreateNewLayer();
    }

    if (layerCount <= 1) {
      key = getFirstLayerKey();
      setSelectedLayer(key);
      addMarkerToLayer(key);
    } else {
      statusCalloutSelect.open();
    }
  }

  // This adds an event that listens to data coming from Excel.
  addEvent('dataFromExcel', async (data:any) => {
    if (state.layers.length === 0) {
      statusDialogCreate.open();
    } else {
      try {
        const geojson = await arrayToGeojson(data);

        const layerCount = getLayerCount();

        if (layerCount === 0) {
          autoCreateNewLayer();
        }

        if (layerCount === 1) {
          setSelectedLayer(getFirstLayerKey());
          addDataToLayer(selectedLayer, geojson);
        } else {
          statusDialogReceive.open(geojson);
        }
      } catch (err) {
        console.error(err);
      }
    }
  });

  // Run on startup
  useEffect(() => {
    state.map = initialiseMap(mapContainer);
    state.initialise = ({ ...state.initialise, ...{ map: true } });

    state.map.on('click', (event:LeafletMouseEvent) => { onMapMouseClick(event); });
  }, [mapContainer]); // eslint-disable-line

  if (!state.initialise.office) {
    Office.onReady().then(() => {
      try {
        Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
        state.initialise = ({ ...state.initialise, ...{ office: true } });
      } catch {
        console.log('Unable to initialise OfficeJS, is this running inside office?');
      }
    });
  }

  return (
    <div id="map-wrapper">
      <CreateLayer
        statusDialogCreate={statusDialogCreate}
        statusDialogProperties={statusDialogProperties}
        setSelectedLayer={setSelectedLayer}
      />
      <SelectLayer
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        statusCalloutSelect={statusCalloutSelect}
      />
      <ReceiveDialog
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        statusDialogReceive={statusDialogReceive}
      />
      <Properties
        statusDialogProperties={statusDialogProperties}
      />
      <MapPanel
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        statusPanel={statusPanel}
        statusDialogCreate={statusDialogCreate}
      />
      <BottomBar
        selectedLayer={selectedLayer}
        setSelectedLayer={setSelectedLayer}
        statusDialogCreate={statusDialogCreate}
        sendToParent={sendToParent}
      />
      <div id="map" ref={(el) => { mapContainer = el; }}></div>
    </div>
  );
}

export default Map;
