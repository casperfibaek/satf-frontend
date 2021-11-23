import L from 'leaflet';
const { state } = window;
let layerKey = 0;
function getLayerKey() {
    layerKey += 1;
    return layerKey;
}
function getUniqueProperties(featureGroup) {
    const allProperties = [];
    featureGroup.eachLayer((l) => {
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
    return allProperties;
}
export function generateRandomStyle() {
    const getRandom = (list) => list[Math.floor(Math.random() * list.length)];
    return {
        fillColor: getRandom(['#0078d4', '#217346', '#7719aa', '#d83b01', '#0540F2', '#3D6AF2', '#F2E205', '#F24130']),
        edgeColor: getRandom(['#201f1e', '#323130', '#d0d0d0', '#004578', '#251F1C', '#FFC361']),
        fillOpacity: getRandom([0.5, 0.7, 0.9, 1.0]),
        edgeOpacity: getRandom([0.5, 0.7, 0.9, 1.0]),
        weight: getRandom([0.5, 0.75, 1.0, 1.25]),
        radius: getRandom([8, 9, 10, 11, 12]),
    };
}
export function getLayer(key) {
    for (let i = 0; i < state.layers.length; i += 1) {
        if (state.layers[i].key === key) {
            return state.layers[i];
        }
    }
    const errorMessage = 'Unable to find layer in state. Layer reference might be corrupted.';
    throw new Error(errorMessage);
}
export function checkIfLayerExists(key) {
    for (let i = 0; i < state.layers.length; i += 1) {
        if (state.layers[i].key === key) {
            return true;
        }
    }
    return false;
}
export function renderLayers() {
    for (let i = 0; i < state.layers.length; i += 1) {
        if (state.layers[i].hidden) {
            state.leafletMap.removeLayer(state.layers[i].featureGroup);
        }
        else {
            state.leafletMap.addLayer(state.layers[i].featureGroup);
        }
    }
}
export function createNewMapLayer(name, from_db = false, db_key = null) {
    let key;
    if (from_db) {
        key = db_key;
    }
    else {
        key = getLayerKey();
    }
    const style = generateRandomStyle();
    for (let i = 0; i < state.layers.length; i += 1) {
        state.leafletMap.removeLayer(state.layers[i].featureGroup);
    }
    const featureGroup = L.featureGroup();
    const maplayer = {
        name, key, featureGroup, style, hidden: false,
    };
    state.layers.push(maplayer);
    renderLayers();
    return maplayer;
}
export function removeLayer(key) {
    for (let i = 0; i < state.layers.length; i += 1) {
        state.leafletMap.removeLayer(state.layers[i].featureGroup);
    }
    state.layers = state.layers.filter((e) => e.key !== key);
    renderLayers();
}
export function toggleLayer(key) {
    for (let i = 0; i < state.layers.length; i += 1) {
        if (state.layers[i].key === key) {
            state.layers[i].hidden = !state.layers[i].hidden;
        }
    }
    renderLayers();
}
export function updateLayerName(key, name) {
    const layer = getLayer(key);
    layer.name = name;
}
export function clearLayers() {
    for (let i = 0; i < state.layers.length; i += 1) {
        const { featureGroup } = state.layers[i];
        featureGroup.eachLayer((l) => {
            featureGroup.removeLayer(l);
            l.remove();
        });
    }
    state.layers = [];
}
export function isLayernameUnique(name) {
    for (let i = 0; i < state.layers.length; i += 1) {
        if (name === state.layers[i].name) {
            return false;
        }
    }
    return true;
}
export function getLayerCount() {
    return state.layers.length;
}
export function getFirstLayer() {
    if (state.layers.length === 0) {
        throw new Error('No first layer, layerlist is empty!');
    }
    return state.layers[0];
}
export function getFirstLayerKey() {
    if (state.layers.length === 0) {
        return -1;
    }
    return state.layers[0].key;
}
export function updateLayerStyle(key, style) {
    const layer = getLayer(key);
    layer.style = style;
    layer.featureGroup.setStyle({
        color: style.edgeColor,
        weight: style.weight,
        opacity: style.edgeOpacity,
        fillOpacity: style.fillOpacity,
        fillColor: style.fillColor,
        radius: style.radius,
    });
}
export function addDataToLayer(key, data) {
    const mapLayer = getLayer(key);
    try {
        for (let i = 0; i < data.features.length; i += 1) {
            const feature = data.features[i];
            L.geoJSON(feature, {
                pointToLayer(_feature, latlng) {
                    const newLayer = L.circleMarker(latlng, {
                        color: mapLayer.style.edgeColor,
                        weight: mapLayer.style.weight,
                        opacity: mapLayer.style.edgeOpacity,
                        fillOpacity: mapLayer.style.fillOpacity,
                        fillColor: mapLayer.style.fillColor,
                        radius: mapLayer.style.radius,
                        properties: feature.properties,
                    });
                    mapLayer.featureGroup.addLayer(newLayer);
                    return newLayer;
                },
            });
        }
        state.leafletMap.fitBounds(L.geoJSON(data).getBounds());
    }
    catch (err) {
        console.log(err);
        throw new Error('Unable to parse data received from Excel. Malformed?');
    }
}
export function addMarkerToLayer(key) {
    const mapLayer = getLayer(key);
    const { featureGroup } = mapLayer;
    const uniqueProperties = getUniqueProperties(featureGroup);
    console.log(state.click.latlng);
    const properties = {};
    for (let i = 0; i < uniqueProperties.length; i += 1) {
        const property = uniqueProperties[i];
        properties[property] = null;
    }
    const marker = L.circleMarker(state.click.latlng, {
        color: mapLayer.style.edgeColor,
        weight: mapLayer.style.weight,
        opacity: mapLayer.style.edgeOpacity,
        fillOpacity: mapLayer.style.fillOpacity,
        fillColor: mapLayer.style.fillColor,
        radius: mapLayer.style.radius,
        properties,
    });
    featureGroup.addLayer(marker);
}
export function addMarkerToLayerFromDB(key, latlng, point_id, context_info = 'whatever info') {
    const mapLayer = getLayer(key);
    const { featureGroup } = mapLayer;
    const uniqueProperties = getUniqueProperties(featureGroup);
    const properties = {};
    for (let i = 0; i < uniqueProperties.length; i += 1) {
        const property = uniqueProperties[i];
        properties[property] = null;
    }
    ///// I CHANGED THIS!
    console.log(point_id, context_info);
    properties.id = point_id;
    properties.context_info = context_info;
    const marker = L.circleMarker(latlng, {
        color: mapLayer.style.edgeColor,
        weight: mapLayer.style.weight,
        opacity: mapLayer.style.edgeOpacity,
        fillOpacity: mapLayer.style.fillOpacity,
        fillColor: mapLayer.style.fillColor,
        radius: mapLayer.style.radius,
        properties,
    });
    featureGroup.addLayer(marker);
}
//# sourceMappingURL=map_layers.js.map