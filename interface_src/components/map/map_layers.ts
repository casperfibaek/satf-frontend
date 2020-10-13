import L, { FeatureGroup } from 'leaflet';
import { Style, MapLayer, WindowState } from '../../types';

declare let window: WindowState;

let layerKey = 0;

function getLayerKey():number {
  layerKey += 1;
  return layerKey;
}

function getUniqueProperties(featureGroup:FeatureGroup):any[] {
  const allProperties:any[] = [];
  featureGroup.eachLayer((l:any) => {
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

export function generateRandomStyle():Style {
  const getRandom = (list:any[]) => list[Math.floor(Math.random() * list.length)];

  return {
    fillColor: getRandom(['#0078d4', '#217346', '#7719aa', '#d83b01', '#0540F2', '#3D6AF2', '#F2E205', '#F24130']),
    edgeColor: getRandom(['#201f1e', '#323130', '#d0d0d0', '#004578', '#251F1C', '#FFC361']),
    fillOpacity: getRandom([0.5, 0.7, 0.9, 1.0]),
    edgeOpacity: getRandom([0.5, 0.7, 0.9, 1.0]),
    weight: getRandom([0.5, 0.75, 1.0, 1.25]),
    radius: getRandom([8, 9, 10, 11, 12]),
  };
}

export function getLayer(key:number):MapLayer {
  for (let i = 0; i < window.state.layers.length; i += 1) {
    if (window.state.layers[i].key === key) {
      return window.state.layers[i];
    }
  }
  const errorMessage = 'Unable to find layer in state. Layer reference might be corrupted.';
  throw new Error(errorMessage);
}

export function renderLayers() {
  for (let i = 0; i < window.state.layers.length; i += 1) {
    if (window.state.layers[i].hidden) {
      window.state.map.removeLayer(window.state.layers[i].featureGroup);
    } else {
      window.state.map.addLayer(window.state.layers[i].featureGroup);
    }
  }
}

export function createNewMapLayer(name:string):MapLayer {
  const key = getLayerKey();
  const style = generateRandomStyle();

  for (let i = 0; i < window.state.layers.length; i += 1) {
    window.state.map.removeLayer(window.state.layers[i].featureGroup);
  }

  const featureGroup = L.featureGroup();

  const maplayer = {
    name, key, featureGroup, style, hidden: false,
  };

  window.state.layers.push(maplayer);

  renderLayers();

  return maplayer;
}

export function removeLayer(key:number):void {
  for (let i = 0; i < window.state.layers.length; i += 1) {
    window.state.map.removeLayer(window.state.layers[i].featureGroup);
  }

  window.state.layers = window.state.layers.filter((e:any) => e.key !== key);

  renderLayers();
}

export function toggleLayer(key:number):void {
  for (let i = 0; i < window.state.layers.length; i += 1) {
    if (window.state.layers[i].key === key) {
      window.state.layers[i].hidden = !window.state.layers[i].hidden;
    }
  }
  renderLayers();
}

export function updateLayerName(key:number, name:string):void {
  const layer = getLayer(key);
  layer.name = name;
}

export function clearLayers():void {
  for (let i = 0; i < window.state.layers; i += 1) {
    window.state.map.removeLayer(window.state.layers[i].featureGroup);
  }
  window.state.layers = [];
}

export function isLayernameUnique(name:string):boolean {
  for (let i = 0; i < window.state.layers.length; i += 1) {
    if (name === window.state.layers[i].name) {
      return false;
    }
  }
  return true;
}

export function getLayerCount():number {
  return window.state.layers.length;
}

export function getFirstLayer():MapLayer {
  if (window.state.layers.length === 0) {
    throw new Error('No first layer, layerlist is empty!');
  }
  return window.state.layers[0];
}

export function getFirstLayerKey():number {
  if (window.state.layers.length === 0) {
    return -1;
  }
  return window.state.layers[0].key;
}

export function updateLayerStyle(key:number, style:Style):void{
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

export function addDataToLayer(key:number, data:any) {
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
  } catch (err) {
    console.log(err);
    throw new Error('Unable to parse data received from Excel. Malformed?');
  }
}

export function addMarkerToLayer(key:number) {
  const mapLayer = getLayer(key);
  const { featureGroup } = mapLayer;

  const uniqueProperties = getUniqueProperties(featureGroup);

  const properties:any = {};
  for (let i = 0; i < uniqueProperties.length; i += 1) {
    const property = uniqueProperties[i];
    properties[property] = null;
  }

  const { latlng } = window.state.click;

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
