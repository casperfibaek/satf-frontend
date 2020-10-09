import { GeoJsonFeature, GeoJsonFeatureCollection, GeoJsonGeometry } from '../../types';

function findUnique(arrOfObjects:any[]):any[] {
  const found = [];
  for (let i = 0; i < arrOfObjects.length; i += 1) {
    const propertyKeys = Object.keys(arrOfObjects[i]);
    for (let j = 0; j < propertyKeys.length; j += 1) {
      let unique = true;
      for (let k = 0; k < found.length; k += 1) {
        if (found[k] === propertyKeys[j]) {
          unique = false;
          break;
        }
      }
      if (unique) {
        found.push(propertyKeys[j]);
      }
    }
  }
  return found;
}

export default function geojsonToArray(geojson:GeoJsonFeatureCollection|GeoJsonFeature|GeoJsonGeometry, layername:boolean|string = false):any[] {
  let cells:any[] = [];

  const validLayername = (typeof layername === 'string' && layername.length !== 0);

  if (geojson.type === 'FeatureCollection') {
    if (geojson.features.length === 0) {
      console.log('Featurecollection is empty');
      return;
    }

    const latlngs = geojson.features.map((e:any) => e.geometry.coordinates);
    const properties = geojson.features.map((e:any) => e.properties);

    const baseHeaders = findUnique(properties);

    for (let i = 0; i < geojson.features.length; i += 1) {
      const propertyValues = [];

      for (let j = 0; j < baseHeaders.length; j += 1) {
        if (properties[i][baseHeaders[j]] !== undefined) {
          propertyValues.push(properties[i][baseHeaders[j]]);
        } else {
          propertyValues.push(null);
        }
      }
      latlngs[i].reverse();
      latlngs[i] = latlngs[i].concat(propertyValues);
      if (validLayername) { latlngs[i].unshift(layername); }
    }

    let header:any[];
    if (validLayername) {
      header = ['layername', 'latitude', 'longitude'].concat(baseHeaders);
    } else {
      header = ['latitude', 'longitude'].concat(baseHeaders);
    }
    cells = [header, ...latlngs];

    return cells;
  } if (geojson.type === 'Feature') {
    const latlngs = geojson.geometry.coordinates;
    const { properties } = geojson;

    let header:any[];
    if (validLayername) {
      header = ['layername', 'latitude', 'longitude'].concat(Object.keys(properties));
    } else {
      header = ['latitude', 'longitude'].concat(Object.keys(properties));
    }
    cells = [header, latlngs.reverse()];

    return cells;
  } if (geojson.type === 'Point') {
    const latlngs = geojson.coordinates;

    return [['latitude', 'longitude'], [latlngs[1], latlngs[0]]];
  }

  return false;
}
