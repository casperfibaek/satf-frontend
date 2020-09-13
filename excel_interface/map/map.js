System.register(["./arrayToGeojson.js", "./keyval.js"], function (exports_1, context_1) {
    "use strict";
    var arrayToGeojson_js_1, keyval_js_1, localEvent, southWest, northEast, bounds, osm, esri, s2Dry, s2Wet, white, map, allClasses, urbanNonUrban, bankDistance, roadDensity, viirs, surfDry, surfWet, texB04, texB08, texB12, basemaps, overlaymaps;
    var __moduleName = context_1 && context_1.id;
    function htmlTable(obj) {
        var table = '<table class=""><tbody>';
        if (obj._data) {
            for (var i = 0; i < obj._data.length; i += 1) {
                table += "<tr><td>" + obj._data[i] + "</td></tr>";
            }
        }
        else {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; i += 1) {
                var key = keys[i];
                var val = obj[key];
                table += "<tr><td>" + key + "</td><td>" + val + "</td></tr>";
            }
        }
        table += '</tbody></table>';
        return table;
    }
    function addMarkers(themap, markername) {
        try {
            var markerArray = JSON.parse(localStorage[markername]);
            var geojson = arrayToGeojson_js_1.default(markerArray);
            var geojsonMarkerOptions_1 = {
                radius: 8,
                fillColor: '#ff7800',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
            };
            var geojsonLayer = L.geoJSON(geojson, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions_1);
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        layer.bindPopup(htmlTable(feature.properties));
                    }
                },
                // Flip coords
                coordsToLatLng: function (coords) {
                    return new L.LatLng(coords[0], coords[1]);
                },
            }).addTo(themap);
            map.fitBounds(geojsonLayer.getBounds());
        }
        catch (err) {
            console.log(err);
        }
        // const markersList = JSON.parse(localStorage.getItem(markername));
        // let markers = [];
        // if (typeof markersList[0][0] === 'string') {
        //   markers = JSON.parse(localStorage.getItem(markername)).slice(1, -1);
        // } else {
        //   markers = JSON.parse(localStorage.getItem(markername));
        // }
        // const markerGroup = L.featureGroup().addTo(themap);
        // for (let i = 0; i < markers.length; i += 1) {
        //   markerGroup.addLayer(L.circleMarker(markers[i]));
        // }
        // themap.fitBounds(markerGroup.getBounds());
    }
    return {
        setters: [
            function (arrayToGeojson_js_1_1) {
                arrayToGeojson_js_1 = arrayToGeojson_js_1_1;
            },
            function (keyval_js_1_1) {
                keyval_js_1 = keyval_js_1_1;
            }
        ],
        execute: function () {
            if (localStorage.getItem('eventNumber') === null) {
                localStorage.setItem('eventNumber', '0');
            }
            localEvent = Number(localStorage.getItem('eventNumber'));
            // Bounds
            southWest = L.latLng(5.3353253293190095, -1.1842325491159249);
            northEast = L.latLng(6.1770972290384405, 0.4266650607723487);
            bounds = L.latLngBounds(southWest, northEast);
            // Base layers
            osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
                minZoom: 9,
                maxZoom: 18,
            });
            esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            });
            s2Dry = L.tileLayer('https://imap.niras.dk/proximity/s2_dry/{z}/{x}/{y}.png', {
                tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            s2Wet = L.tileLayer('https://imap.niras.dk/proximity/s2_wet/{z}/{x}/{y}.png', {
                tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            white = L.tileLayer('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEX///+nxBvIAAAAH0lEQVQYGe3BAQ0AAADCIPunfg43YAAAAAAAAAAA5wIhAAAB9aK9BAAAAABJRU5ErkJggg==', { minZoom: 9, maxZoom: 15 });
            map = L.map('map', {
                center: [5.6899537, -0.557727],
                zoom: 13,
                minZoom: 5,
                minNativeZoom: 9,
                maxZoom: 19,
                maxNativeZoom: 18,
                layers: [osm],
            });
            window.map = map;
            L.control.scale().addTo(map);
            allClasses = L.tileLayer('https://imap.niras.dk/proximity/all_classes/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            urbanNonUrban = L.tileLayer('https://imap.niras.dk/proximity/urban_non-urban/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            bankDistance = L.tileLayer('https://imap.niras.dk/proximity/bank_distance/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            roadDensity = L.tileLayer('https://imap.niras.dk/proximity/road_density/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            viirs = L.tileLayer('https://imap.niras.dk/proximity/viirs/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NASA', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            surfDry = L.tileLayer('https://imap.niras.dk/proximity/surf_dry/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            surfWet = L.tileLayer('https://imap.niras.dk/proximity/surf_wet/{z}/{x}/{y}.png', {
                tms: true, opacity: 0.7, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            texB04 = L.tileLayer('https://imap.niras.dk/proximity/dry_b4_tex/{z}/{x}/{y}.png', {
                tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            texB08 = L.tileLayer('https://imap.niras.dk/proximity/dry_b8_tex/{z}/{x}/{y}.png', {
                tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            texB12 = L.tileLayer('https://imap.niras.dk/proximity/dry_b12_tex/{z}/{x}/{y}.png', {
                tms: true, opacity: 1, attribution: 'NIRAS', minZoom: 9, maxNativeZoom: 15, maxZoom: 21,
                bounds: bounds,
            });
            basemaps = {
                OpenStreetMap: osm,
                'Esri WorldMap': esri,
                'Dry Season 2019 (RGB)': s2Dry,
                'Wet Season 2019 (RGB)': s2Wet,
                'Without background': white,
            };
            overlaymaps = {
                'Classification (All)': allClasses,
                'Classification (Urb/Rur)': urbanNonUrban,
                'Nighttime Lights 2019': viirs,
                'Distance to Banks': bankDistance,
                'Road Density': roadDensity,
                'Dry season SAR (Coh2 * Db)': surfDry,
                'Wet season SAR (Coh2 * Db)': surfWet,
                'PCA Texture Red': texB04,
                'PCA Texture NIR': texB08,
                'PCA Texture SWIR': texB12,
            };
            L.control.layers(basemaps, overlaymaps, { collapsed: true }).addTo(map);
            Office.onReady().then(function () {
                try {
                    addMarkers(map, 'markers');
                }
                catch (err) {
                    console.log('Could not add markers to map: ', err);
                }
                setInterval(function () {
                    var globalEvent = Number(localStorage.getItem('eventNumber'));
                    if (globalEvent !== localEvent) {
                        try {
                            addMarkers(map, 'markers');
                        }
                        catch (err) {
                            console.log('Could not add markers to map: ', err);
                        }
                        localEvent = globalEvent;
                    }
                }, 100);
                function onMapClick(e) {
                    var coords = e.latlng;
                    L.circleMarker(coords, { radius: 10 }).addTo(map);
                    localStorage.setItem('newCoords', JSON.stringify(coords));
                    Office.context.ui.messageParent('newCoords');
                    keyval_js_1.default.get('hello').then(function (val) { return console.log(val); });
                }
                map.on('click', onMapClick);
            });
        }
    };
});
