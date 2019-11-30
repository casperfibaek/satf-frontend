if (localStorage.getItem('eventNumber') === null) {
  localStorage.setItem('eventNumber', '0');
}

let localEvent = Number(localStorage.getItem('eventNumber'));

const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

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
  addMarkers(map, 'markers');

  setInterval(() => {
    const globalEvent = Number(localStorage.getItem('eventNumber'));
    if (globalEvent !== localEvent) {
      addMarkers(map, 'markers');
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
