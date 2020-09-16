const { mapboxgl } = window as any;

mapboxgl.accessToken = 'pk.eyJ1IjoiY2ZpLW5pcmFzIiwiYSI6ImNrZjQzN2FoNzA1YzMyc3FkdXpoZDVpNHgifQ.eR78Qlya3T9OGt0eSd7Y5w';
const map = new mapboxgl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      'raster-tiles': {
        type: 'raster',
        tiles: [
          'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
        ],
        tileSize: 256,
        attribution:
    'Map tiles by <a target="_top" rel="noopener" href="http://stamen.com">Stamen Design</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" rel="noopener" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" rel="noopener" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',
      },
    },
    layers: [
      {
        id: 'simple-tiles',
        type: 'raster',
        source: 'raster-tiles',
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  },
  center: [-0.3, 5.6], // starting position
  zoom: 5, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
