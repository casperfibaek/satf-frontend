import React, { useEffect, useState } from 'react'; // eslint-disable-line
import L, { LeafletMouseEvent } from 'leaflet';
import {
  Callout, Dropdown, PrimaryButton, DirectionalHint, Dialog, DialogFooter, DefaultButton,
} from '@fluentui/react';

import '../../assets/leaflet.css';
import MapPanel from './map_panel';
import CreateLayer from './map_create_layer';
import { onMessageFromParent, sendToParent, addEvent } from './communication';
import BottomBar from './map_bottom_bar';
import arrayToGeojson from './array_to_geojson';
import Properties from './map_properties';

interface Style {
  key: number,
  fillColor: string,
  edgeColor: string,
  fillOpacity: number,
  edgeOpacity: number,
  weight: number,
  radius: number,
}

interface MyMap extends Window {
  map: any;
  mapLayers: any[];
}

declare let window: MyMap;

let initialised = false;
window.mapLayers = [];
window.map = {};

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

  /*
 * Workaround for 1px lines appearing in some browsers due to fractional transforms
 * and resulting anti-aliasing.
 * https://github.com/Leaflet/Leaflet/issues/3575
 */
  (function fixTileGap() {
    const originalInitTile = L.GridLayer.prototype._initTile;
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

  const [panel, setPanel] = useState({ hidden: SVGComponentTransferFunctionElement });
  const [layerKey, setLayerKey] = useState(1);
  const [addToLayer, setAddToLayer] = useState(1);
  const [mapSelectedLayer, setMapSelectedLayer] = useState(1);
  const [mapClick, setMapClick] = useState({ hidden: true, position: {}, latlng: [] });
  const [createDialog, setCreateDialog] = useState({ hidden: true, name: '' });
  const [receiveDialog, setReceiveDialog] = useState({ hidden: true });
  const [addData, setAddData] = useState({});

  const [propertiesDialog, setPropertiesDialog] = useState({
    hidden: true, position: {}, clicked: null, group: null,
  });

  function getLayerKey():number {
    const currentKey = layerKey;
    setLayerKey(currentKey + 1);
    return currentKey;
  }

  function generateRandomStyle(key:number):Style {
    const getRandom = (list:any[]) => list[Math.floor(Math.random() * list.length)];

    return {
      fillColor: getRandom(['#0078d4', '#217346', '#7719aa', '#d83b01', '#0540F2', '#3D6AF2', '#F2E205', '#F24130']),
      edgeColor: getRandom(['#201f1e', '#323130', '#d0d0d0', '#004578', '#251F1C', '#FFC361']),
      fillOpacity: getRandom([0.5, 0.7, 0.9, 1.0]),
      edgeOpacity: getRandom([0.5, 0.7, 0.9, 1.0]),
      weight: getRandom([0.5, 0.75, 1.0, 1.25]),
      radius: getRandom([8, 9, 10, 11, 12]),
      key,
    };
  }

  function resetMapClick() {
    setMapClick({ hidden: true, position: {}, latlng: [] });
  }

  function openCreateDialog() {
    setCreateDialog({ ...createDialog, hidden: false });
  }

  function renderLayers() {
    for (let i = 0; i < window.mapLayers.length; i += 1) {
      if (window.mapLayers[i].visible) {
        window.map.addLayer(window.mapLayers[i].group);
      } else {
        window.map.removeLayer(window.mapLayers[i].group);
      }
    }
  }

  function addLayer(name:string):void {
    const key = getLayerKey();
    const style = generateRandomStyle(key);

    for (let i = 0; i < window.mapLayers.length; i += 1) {
      window.map.removeLayer(window.mapLayers[i].group);
    }

    const group = L.featureGroup().on('click', (event:any) => {
      setPropertiesDialog({
        hidden: false, position: event.originalEvent, clicked: event.layer, group,
      });
      L.DomEvent.preventDefault(event);
      L.DomEvent.stopPropagation(event);
    });

    window.mapLayers = window.mapLayers.concat({
      name, key, group, style, visible: true,
    });

    renderLayers();
  }

  function removeLayer(key:number):void {
    if (window.mapLayers.length === 0) { setMapSelectedLayer(-1); }

    for (let i = 0; i < window.mapLayers.length; i += 1) {
      window.map.removeLayer(window.mapLayers[i].group);
    }

    window.mapLayers = window.mapLayers.filter((e) => e.key !== key);

    renderLayers();
  }

  function toggleLayer(key:number):void {
    for (let i = 0; i < window.mapLayers.length; i += 1) {
      if (window.mapLayers[i].key === key) {
        window.mapLayers[i].visible = !window.mapLayers[i].visible;
      }
    }
    renderLayers();
  }

  function changeLayername(key:number, name:string):void {
    const otherLayers = window.mapLayers.filter((e) => e.key !== key);
    const thisLayer = window.mapLayers.filter((e) => e.key === key)[0];
    thisLayer.name = name;
    otherLayers.push(thisLayer);
    window.mapLayers = otherLayers;
  }

  function clearLayers():void {
    for (let i = 0; i < window.mapLayers.length; i += 1) {
      window.map.removeLayer(window.mapLayers[i].group);
    }
    window.mapLayers = [];
    setMapSelectedLayer(-1);
  }

  function updateStyle(style:Style):void{
    const otherLayers = window.mapLayers.filter((e) => e.key !== style.key);
    const thisLayer = window.mapLayers.filter((e) => e.key === style.key)[0];
    thisLayer.style = style;
    otherLayers.push(thisLayer);
    window.mapLayers = otherLayers;

    thisLayer.group.setStyle({
      color: style.edgeColor,
      weight: style.weight,
      opacity: style.edgeOpacity,
      fillOpacity: style.fillOpacity,
      fillColor: style.fillColor,
      radius: style.radius,
    });
  }

  function addMarkerToLayer() {
    if (mapSelectedLayer === -1 || window.mapLayers.length === 0) {
      openCreateDialog();
    } else {
      let layer;
      let group;
      for (let i = 0; i < window.mapLayers.length; i += 1) {
        if (window.mapLayers[i].key === mapSelectedLayer) {
          layer = window.mapLayers[i];
          group = window.mapLayers[i].group;
          break;
        }
      }

      const allProperties:any[] = [];
      group.eachLayer((l:any) => {
        const layerProperties = Object.keys(l.options.properties);
        for (let i = 0; i < layerProperties.length; i += 1) {
          let unique = true;
          for (let j = 0; j < allProperties.length; j += 1) {
            if (layerProperties[i] === allProperties[j]) {
              unique = false;
              break;
            }
          }
          if (unique) {
            allProperties.push(layerProperties[i]);
          }
        }
      });

      const properties:any = {};
      for (let k = 0; k < allProperties.length; k += 1) {
        properties[allProperties[k]] = null;
      }

      const latLng = (mapClick.latlng && mapClick.latlng[0] && mapClick.latlng[1]) ? mapClick.latlng : window.mapClicked.latlng;

      const newLayer = L.circleMarker(latLng, {
        color: layer.style.edgeColor,
        weight: layer.style.weight,
        opacity: layer.style.edgeOpacity,
        fillOpacity: layer.style.fillOpacity,
        fillColor: layer.style.fillColor,
        radius: layer.style.radius,
        properties,
      });

      group.addLayer(newLayer);
    }

    resetMapClick();
  }

  function closeReceiveDialog() {
    setAddData({});
    setReceiveDialog({ hidden: true });
  }

  function openReceiveDialog() {
    setReceiveDialog({ hidden: false });
  }

  function onAdd() {
    let layer:any;
    for (let i = 0; i < window.mapLayers.length; i += 1) {
      if (window.mapLayers[i].key === addToLayer) {
        layer = window.mapLayers[i];
        break;
      }
    }

    for (let i = 0; i < addData.features.length; i += 1) {
      const feature = addData.features[i];
      layer.group.addLayer(
        L.geoJSON(feature, {
          pointToLayer(_feature, latlng) {
            const newlayer = L.circleMarker(latlng, {
              color: layer.style.edgeColor,
              weight: layer.style.weight,
              opacity: layer.style.edgeOpacity,
              fillOpacity: layer.style.fillOpacity,
              fillColor: layer.style.fillColor,
              radius: layer.style.radius,
              properties: feature.properties,
            });
            return newlayer;
          },
        }),
      );
    }
    closeReceiveDialog();
  }

  useEffect(() => {
    window.map = initialiseMap(mapContainer); // eslint-disable-line

    window.map.on('click', (event:LeafletMouseEvent) => {
      window.mapClicked = { position: event.originalEvent, latlng: [event.latlng.lat, event.latlng.lng] };
      setMapClick({ hidden: true, position: event.originalEvent, latlng: [event.latlng.lat, event.latlng.lng] });
      if (window.mapLayers.length === 0) { addLayer('Default'); }
      if (window.mapLayers.length === 1) {
        addMarkerToLayer();
      } else {
        setMapClick({ hidden: false, position: event.originalEvent, latlng: [event.latlng.lat, event.latlng.lng] });
        window.map.on('movestart', () => {
          setMapClick({ hidden: true, position: {}, latlng: [0, 0] });
          setPropertiesDialog({
            hidden: true, position: {}, clicked: null, group: null,
          });
          window.map.off('movestart');
        });
      }
    });
  }, [mapContainer]); // eslint-disable-line

  if (!initialised) {
    Office.onReady().then(() => {
      try {
        Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
        initialised = true;
      } catch {
        console.log('Unable to initialise OfficeJS, is this running inside office?');
      }
    });
  }

  addEvent('selectedCells', async (data:any) => {
    if (window.mapLayers.length === 0) {
      openCreateDialog();
    } else {
      try {
        const geojson = await arrayToGeojson(data);
        setAddData(geojson);
        openReceiveDialog();
      } catch (err) {
        console.error(err);
      }
    }
  });

  return (
    <div id="map-wrapper">
      <CreateLayer
        addLayer={addLayer}
        createDialog={createDialog}
        setCreateDialog={setCreateDialog}
      />
      <Properties
        setPropertiesDialog={setPropertiesDialog}
        propertiesDialog={propertiesDialog}
      />
      <Dialog
        title={'Add data to layer'}
        hidden={receiveDialog.hidden}
        onDismiss={() => { closeReceiveDialog(); } }
      >
        <Dropdown
          label="Send selected layer to Excel."
          options={window.mapLayers.length === 0 ? [{ text: '', key: 0 }] : window.mapLayers.map((e:any) => ({ text: e.name, key: e.key }))}
          onChange={(event:React.FormEvent, value:any) => { setAddToLayer(value.key); }}
          required
        />
        <DialogFooter>
          <PrimaryButton onClick={() => { onAdd(); }} text="Add" />
          <DefaultButton onClick={() => { closeReceiveDialog(); } } text="Don't add" />
        </DialogFooter>
      </Dialog>
      <Callout
          role="alertdialog"
          gapSpace={0}
          target={mapClick.position}
          hidden={mapClick.hidden}
          onDismiss={() => { resetMapClick(); }}
          setInitialFocus
          directionalHint={DirectionalHint.bottomCenter}
      >
        <Dropdown
          placeholder="Create new layer"
          label="Add point to layer"
          defaultSelectedKey={window.mapLayers.length === 0 ? -1 : mapSelectedLayer}
          options={window.mapLayers.map((e) => ({ text: e.name, key: e.key }))}
          onChange={(event, value) => { setMapSelectedLayer(value.key); }}
          required
        />
        <PrimaryButton className="add-point-to-layer" onClick={() => { addMarkerToLayer(); }} text={(window.mapLayers.length === 0 || mapSelectedLayer === -1) ? 'Create' : 'Add'} />
      </Callout>
      <MapPanel
        panel={panel}
        setPanel={setPanel}
        createDialog={createDialog}
        setCreateDialog={setCreateDialog}
        addLayer={addLayer}
        toggleLayer={toggleLayer}
        updateStyle={updateStyle}
        removeLayer={removeLayer}
        clearLayers={clearLayers}
        changeLayername={changeLayername}
      />
      <BottomBar
        createDialog={createDialog}
        setCreateDialog={setCreateDialog}
        sendToParent={sendToParent}
      />
      <div id="map" ref={(el) => { mapContainer = el; }}></div>
    </div>
  );
}

export default Map;
