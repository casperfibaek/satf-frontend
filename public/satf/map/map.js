if (localStorage.getItem('eventNumber') === null) {
  localStorage.setItem('eventNumber', '0');
}

let localEvent = Number(localStorage.getItem('eventNumber'));

// Bounds
const southWest = L.latLng(5.3353253293190095, -1.1842325491159249);
const northEast = L.latLng(6.1770972290384405, 0.4266650607723487);
const bounds = L.latLngBounds(southWest, northEast);


// Base layers
const osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', minZoom: 9, maxZoom: 18 });
const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
});
const s2_dry = L.tileLayer('https://imap.niras.dk/proximity/s2_dry/{z}/{x}/{y}.png', {
  tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const s2_wet = L.tileLayer('https://imap.niras.dk/proximity/s2_wet/{z}/{x}/{y}.png', {
  tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const white = L.tileLayer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==', { minZoom: 9, maxZoom: 15 });

const map = L.map('map', {
  center: [51.505, -0.09],
  zoom: 13,
  minZoom: 9,
  maxZoom: 17,
  layers: [osm],
});

L.control.scale().addTo(map);

const all_classes = L.tileLayer('https://imap.niras.dk/proximity/all_classes/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const urban_non_urban = L.tileLayer('https://imap.niras.dk/proximity/urban_non-urban/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const bank_distance = L.tileLayer('https://imap.niras.dk/proximity/bank_distance/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const road_density = L.tileLayer('https://imap.niras.dk/proximity/road_density/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const viirs = L.tileLayer('https://imap.niras.dk/proximity/viirs/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NASA', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const surf_dry = L.tileLayer('https://imap.niras.dk/proximity/surf_dry/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const surf_wet = L.tileLayer('https://imap.niras.dk/proximity/surf_wet/{z}/{x}/{y}.png', {
  tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const tex_b04 = L.tileLayer('https://imap.niras.dk/proximity/dry_b4_tex/{z}/{x}/{y}.png', {
  tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const tex_b08 = L.tileLayer('https://imap.niras.dk/proximity/dry_b8_tex/{z}/{x}/{y}.png', {
  tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});
const tex_b12 = L.tileLayer('https://imap.niras.dk/proximity/dry_b12_tex/{z}/{x}/{y}.png', {
  tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21, bounds,
});

const basemaps = {
  OpenStreetMap: osm,
  'Esri WorldMap': esri,
  'Dry Season 2019 (RGB)': s2_dry,
  'Wet Season 2019 (RGB)': s2_wet,
  'Without background': white,
};

const overlaymaps = {
  'Classification (All)': all_classes,
  'Classification (Urb/Rur)': urban_non_urban,
  'Nighttime Lights 2019': viirs,
  'Distance to Banks': bank_distance,
  'Road Density': road_density,
  'Dry season SAR (Coh2 * Db)': surf_dry,
  'Wet season SAR (Coh2 * Db)': surf_wet,
  'PCA Texture Red': tex_b04,
  'PCA Texture NIR': tex_b08,
  'PCA Texture SWIR': tex_b12,
};

const title = L.control();
title.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'ctl title');
  this.update();
  return this._div;
};
title.update = function (props) {
  this._div.innerHTML = 'Urban Proximity Study. Savings at the Frontiers';
};
title.addTo(map);

L.control.layers(basemaps, overlaymaps, { collapsed: true }).addTo(map);

function addMarkers(themap, markername) {
  const markersList = JSON.parse(localStorage.getItem(markername));
  let markers = [];
  if (typeof markersList[0][0] === 'string') {
    markers = JSON.parse(localStorage.getItem(markername)).slice(1, -1);
  } else {
    markers = JSON.parse(localStorage.getItem(markername));
  }

  const markerGroup = L.featureGroup().addTo(themap);

  for (let i = 0; i < markers.length; i += 1) {
    markerGroup.addLayer(L.circleMarker(markers[i]));
  }

  themap.fitBounds(markerGroup.getBounds());
}

Office.onReady().then(() => {
  try {
    addMarkers(map, 'markers');
  } catch (err) {
    console.log('Could not add markers to map: ', err);
  }

  setInterval(() => {
    const globalEvent = Number(localStorage.getItem('eventNumber'));
    if (globalEvent !== localEvent) {
      try {
        addMarkers(map, 'markers');
      } catch (err) {
        console.log('Could not add markers to map: ', err);
      }
      localEvent = globalEvent;
    }
  }, 100);

  function onMapClick(e) {
    const coords = e.latlng;
    L.circleMarker(coords, { radius: 10 }).addTo(map);
    localStorage.setItem('newCoords', JSON.stringify(coords));
    Office.context.ui.messageParent('newCoords');
    idbKeyval.get('hello').then((val) => console.log(val));
  }

  map.on('click', onMapClick);
});
