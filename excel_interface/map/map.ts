import arrayToGeojson from './arrayToGeojson.js';
window.arrayToGeojson = arrayToGeojson;

const map = L.map('map', {
  center: [7.955811115092113, -1.0050627119953766],
  zoom: 7,
  minZoom: 6,
  maxZoom: 16,
});

// Base layers
const osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  minZoom: 6,
  maxZoom: 16,
});
const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
});

const southWest = L.latLng(4.6935231174772536, -3.3005816097563123);
const northEast = L.latLng(11.2178034596280654, 1.2368344424300484);
const mybounds = L.latLngBounds(southWest, northEast);

// Overlay layers (TMS)
const lyr_2020 = L.tileLayer('https://{s}.imap.niras.dk/ghana/2020/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
}).addTo(map);
const lyr_2019 = L.tileLayer('https://{s}.imap.niras.dk/ghana/2019/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
const lyr_grd = L.tileLayer('https://{s}.imap.niras.dk/ghana/grd/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
const lyr_coh = L.tileLayer('https://{s}.imap.niras.dk/ghana/coh/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
const lyr_ndvi = L.tileLayer('https://{s}.imap.niras.dk/ghana/ndvi/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
const lyr_nl = L.tileLayer('https://{s}.imap.niras.dk/ghana/nightlights/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
const lyr_cxb = L.tileLayer('https://{s}.imap.niras.dk/ghana/cxb/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
const lyr_terrain = L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/terrain/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
});
const lyr_slope = L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/slope/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
});

const lyr_urban_status = L.tileLayer('https://{s}.imap.niras.dk/ghana/tiles_classification/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 15, bounds: mybounds,
});

const lyr_urban_status_simple = L.tileLayer('https://{s}.imap.niras.dk/ghana/tiles_classification_simple/{z}/{x}/{y}.png', {
  tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 15, bounds: mybounds,
});

const overlaymaps = {
  'Nighttime Lights (2020)': lyr_nl,
  'Normalised Vegetation Index': lyr_ndvi,
  'Interferometric Coherence': lyr_coh,
  'SAR Backscatter': lyr_grd,
  'Coherence x Backscatter': lyr_cxb,
  'Terrain (Slope)': lyr_slope,
  'Terrain (Height)': lyr_terrain,
  'Urban Status': lyr_urban_status,
  'Urban Status (simple)': lyr_urban_status_simple,
};

const basemaps = {
  OpenStreetMap: osm,
  'Esri WorldMap': esri,
  '2020 (RGB)': lyr_2020,
  '2019 (RGB)': lyr_2019,
  'Without background': L.tileLayer(''),
};

L.control.scale().addTo(map);

L.control.layers(basemaps, overlaymaps, { collapsed: false }).addTo(map);

// OpacityControl https://github.com/dayjournal/Leaflet.Control.Opacity
L.control.opacity(overlaymaps, { collapsed: true }).addTo(map);

console.log(arrayToGeojson);

function eventDispatcher(event, data) {
  console.log(event);
  console.log(data);
  try {
    if (event === 'selectedCells') {
      const geojson = arrayToGeojson(data);
      L.geoJSON(geojson).addTo(map);
      console.log(geojson);
    } else {
      console.log('Did not understand event');
    }
  } catch (err) {
    console.log(err);
  }
}

function sendToParent(event, data = {}) {
  Office.context.ui.messageParent(JSON.stringify({ event, data }));
}

function onMessageFromParent(arg) {
  try {
    const messageFromParent = JSON.parse(arg.message);
    const { event, data } = messageFromParent;
    eventDispatcher(event, data);
  } catch (err) {
    console.log(err);
  }
}

function addMarker(e) {
  L.marker(e.latlng).addTo(map);
  sendToParent('createdMarker', e.latlng);
}
map.on('click', addMarker);

const buttonRequest = document.getElementById('button_request');
buttonRequest.addEventListener('click', () => {
  sendToParent('requestData');
});

Office.onReady().then(() => {
  try {
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
    sendToParent('ready');
    sendToParent('requestData');
  } catch {
    console.log('Unable to initialise OfficeJS, is this running inside office?');
  }
});

console.log('Loaded: map.js');
