System.register(["./arrayToGeojson.js"], function (exports_1, context_1) {
    "use strict";
    var arrayToGeojson_js_1, map, osm, esri, southWest, northEast, mybounds, lyr_2020, lyr_2019, lyr_grd, lyr_coh, lyr_ndvi, lyr_nl, lyr_cxb, lyr_terrain, lyr_slope, lyr_urban_status, lyr_urban_status_simple, overlaymaps, basemaps, buttonRequest;
    var __moduleName = context_1 && context_1.id;
    function eventDispatcher(event, data) {
        console.log(event);
        console.log(data);
        try {
            if (event === 'selectedCells') {
                var geojson = arrayToGeojson_js_1.default(data);
                L.geoJSON(geojson).addTo(map);
                console.log(geojson);
            }
            else {
                console.log('Did not understand event');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    function sendToParent(event, data) {
        if (data === void 0) { data = {}; }
        Office.context.ui.messageParent(JSON.stringify({ event: event, data: data }));
    }
    function onMessageFromParent(arg) {
        try {
            var messageFromParent = JSON.parse(arg.message);
            var event_1 = messageFromParent.event, data = messageFromParent.data;
            eventDispatcher(event_1, data);
        }
        catch (err) {
            console.log(err);
        }
    }
    function addMarker(e) {
        L.marker(e.latlng).addTo(map);
        sendToParent('createdMarker', e.latlng);
    }
    return {
        setters: [
            function (arrayToGeojson_js_1_1) {
                arrayToGeojson_js_1 = arrayToGeojson_js_1_1;
            }
        ],
        execute: function () {
            window.arrayToGeojson = arrayToGeojson_js_1.default;
            map = L.map('map', {
                center: [7.955811115092113, -1.0050627119953766],
                zoom: 7,
                minZoom: 6,
                maxZoom: 16,
            });
            // Base layers
            osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 6,
                maxZoom: 16,
            });
            esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            });
            southWest = L.latLng(4.6935231174772536, -3.3005816097563123);
            northEast = L.latLng(11.2178034596280654, 1.2368344424300484);
            mybounds = L.latLngBounds(southWest, northEast);
            // Overlay layers (TMS)
            lyr_2020 = L.tileLayer('https://{s}.imap.niras.dk/ghana/2020/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            }).addTo(map);
            lyr_2019 = L.tileLayer('https://{s}.imap.niras.dk/ghana/2019/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            });
            lyr_grd = L.tileLayer('https://{s}.imap.niras.dk/ghana/grd/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            });
            lyr_coh = L.tileLayer('https://{s}.imap.niras.dk/ghana/coh/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            });
            lyr_ndvi = L.tileLayer('https://{s}.imap.niras.dk/ghana/ndvi/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            });
            lyr_nl = L.tileLayer('https://{s}.imap.niras.dk/ghana/nightlights/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            });
            lyr_cxb = L.tileLayer('https://{s}.imap.niras.dk/ghana/cxb/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 14, bounds: mybounds,
            });
            lyr_terrain = L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/terrain/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
            });
            lyr_slope = L.tileLayer('https://{s}.imap.niras.dk/ghana/dem/slope/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 13, bounds: mybounds,
            });
            lyr_urban_status = L.tileLayer('https://{s}.imap.niras.dk/ghana/tiles_classification/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 15, bounds: mybounds,
            });
            lyr_urban_status_simple = L.tileLayer('https://{s}.imap.niras.dk/ghana/tiles_classification_simple/{z}/{x}/{y}.png', {
                tms: true, attribution: 'NIRAS', minZoom: 6, maxZoom: 16, maxNativeZoom: 15, bounds: mybounds,
            });
            overlaymaps = {
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
            basemaps = {
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
            console.log(arrayToGeojson_js_1.default);
            map.on('click', addMarker);
            buttonRequest = document.getElementById('button_request');
            buttonRequest.addEventListener('click', function () {
                sendToParent('requestData');
            });
            Office.onReady().then(function () {
                try {
                    Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
                    sendToParent('ready');
                    sendToParent('requestData');
                }
                catch (_a) {
                    console.log('Unable to initialise OfficeJS, is this running inside office?');
                }
            });
            console.log('Loaded: map.js');
        }
    };
});
//# sourceMappingURL=map.js.map