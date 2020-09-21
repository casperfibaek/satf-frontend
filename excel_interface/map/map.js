"use strict";
var map = L.map('map', {
    center: [7.955811115092113, -1.0050627119953766],
    zoom: 7,
    minZoom: 6,
    maxZoom: 16,
});
// Base layers
var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 6,
    maxZoom: 16,
});
var esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
});
var southWest = L.latLng(4.6935231174772536, -3.3005816097563123);
var northEast = L.latLng(11.2178034596280654, 1.2368344424300484);
var mybounds = L.latLngBounds(southWest, northEast);
// Overlay layers (TMS)
var lyr_2020 = L.tileLayer('https://{s}.imap.niras.dk/ghana/2020/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
}).addTo(map);
var lyr_2019 = L.tileLayer('https://{s}.imap.niras.dk/ghana/2019/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
var lyr_grd = L.tileLayer('https://{s}.imap.niras.dk/ghana/grd/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
var lyr_coh = L.tileLayer('https://{s}.imap.niras.dk/ghana/coh/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
var lyr_ndvi = L.tileLayer('https://{s}.imap.niras.dk/ghana/ndvi/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
var lyr_nl = L.tileLayer('https://{s}.imap.niras.dk/ghana/nightlights/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
var lyr_cxb = L.tileLayer('https://{s}.imap.niras.dk/ghana/cxb/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
});
var lyr_terrain = L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/terrain/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
});
var lyr_slope = L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/slope/{z}/{x}/{y}.png', {
    tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
});
var overlaymaps = {
    'Nighttime Lights (2020)': lyr_nl,
    'Normalised Vegetation Index': lyr_ndvi,
    'Interferometric Coherence': lyr_coh,
    'SAR Backscatter': lyr_grd,
    'Coherence x Backscatter': lyr_cxb,
    'Terrain (Slope)': lyr_slope,
    'Terrain (Height)': lyr_terrain,
};
var basemaps = {
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
function onMessageFromParent(event) {
    var messageFromParent = JSON.parse(event.message);
    console.log(messageFromParent);
}
Office.onReady().then(function () {
    console.log('Office ready in child.');
    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
    Office.context.ui.messageParent(JSON.stringify({ message: 'Send message from map' }));
});
console.log('Loaded: map.js');
//# sourceMappingURL=map.js.map