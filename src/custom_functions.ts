import 'react-app-polyfill/ie11'; import 'react-app-polyfill/stable';
import {
  isValidWhatFreeWords,
  isValidPluscode,
  isValidArray,
  createCoordinateArray,
  isValidLatitude,
  isValidLongitude,
  errNotAvailable,
  errInvalidValue,
  getValueForKey,
  getGlobal,
  getApiUrl,
  haversine,
  setValueForKey,
} from './utils';

import { getSelectedCells, addCellsToSheet } from './excel_interaction'
import geojsonToArray from './components/map/geojson_to_array'
import { ApiReply } from './types';

Office.onReady(() => {
  console.log('Office ready from custom_functions.js');
});

const g:any = getGlobal();
const _apiUrl = `${getApiUrl()}/`;

/**
 * Converts What3Words to two adjacent cells containing Latitude and Longitude.
 * @customfunction WHAT3WORDS_TO_LATLNG
 * @param {any} what3words
 * @return {Promise<number[][]>} Two cells with latitude and longitude
 */
async function WHAT3WORDS_TO_LATLNG(what3words:any):Promise<number[][]> {
  if (isValidWhatFreeWords(what3words)) {
    try {
      const url = `${_apiUrl}what3words_to_latlng?words=${what3words}`;
      const token = getValueForKey('satf_token');

      const apiResponse = await fetch(url, { headers: { Authorization: token } });

      if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

      const responseJSON:ApiReply = await apiResponse.json();
      if (apiResponse.ok) { return [responseJSON.message]; }

      throw errInvalidValue(responseJSON.message);
    } catch (err) {
      throw errInvalidValue(String(err));
    }
  }
  throw errInvalidValue('500: Invalid What3Words');
}
g.WHAT3WORDS_TO_LATLNG = WHAT3WORDS_TO_LATLNG;

/**
 * Converts a Pluscode to two adjacent cells containing Latitude and Longitude.
 * @customfunction PLUSCODE_TO_LATLNG
 * @param {any} pluscode
 * @return {Promise<number[][]>} Two adjacent cells with latitude and longitude
 */
async function PLUSCODE_TO_LATLNG(pluscode:any):Promise<number[][]> {
  if (isValidPluscode(pluscode)) {
    try {
      const url = `${_apiUrl}pluscode_to_latlng?code=${pluscode}`;
      const token = getValueForKey('satf_token');

      const apiResponse = await fetch(url, { headers: { Authorization: token } });

      if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

      const responseJSON:ApiReply = await apiResponse.json();
      if (apiResponse.ok) { return [responseJSON.message]; }

      throw errInvalidValue(responseJSON.message);
    } catch (err) {
      throw errInvalidValue(String(err));
    }
  }
  throw errInvalidValue('500: Invalid Pluscode');
}
g.PLUSCODE_TO_LATLNG = PLUSCODE_TO_LATLNG;

/**
 * Parses an unknown input to Latitude and Longitude if possible.
 * @customfunction PARSE_TO_LATLNG
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number[][]>} Two adjacent cells with latitude and longitude
 */
async function parseToLatlng(latitudeOrAddress:any, longitude:any = false):Promise<number[][]> {
  const coordArray = createCoordinateArray(latitudeOrAddress);

  if (coordArray) {
    return [coordArray];
  } if (isValidLatitude(latitudeOrAddress) && isValidLongitude(longitude)) {
    return [[latitudeOrAddress, longitude]];
  } if (isValidWhatFreeWords(latitudeOrAddress)) {
    const coords = await g.WHAT3WORDS_TO_LATLNG(latitudeOrAddress);
    return coords;
  } if (isValidPluscode(latitudeOrAddress)) {
    const coords = await g.PLUSCODE_TO_LATLNG(latitudeOrAddress);
    return coords;
  }

  throw new Error('500: Unable to parse input');
}

/**
 * Converts Latitude and Longitude to What3Words.
 * An address can be used instead of Latitude.
 * @customfunction LATLNG_TO_WHAT3WORDS
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Cell with What3Words address.
 */
async function LATLNG_TO_WHAT3WORDS(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}latlng_to_what3words?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();

    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.LATLNG_TO_WHAT3WORDS = LATLNG_TO_WHAT3WORDS;

/**
 * Converts Latitude and Longitude to PlusCodes.
 * An address can be used instead of Latitude.
 * @customfunction LATLNG_TO_PLUSCODE
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Cell with PlusCode address.
 */
async function LATLNG_TO_PLUSCODE(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}latlng_to_pluscode?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();

    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.LATLNG_TO_PLUSCODE = LATLNG_TO_PLUSCODE;

/**
 * Tests if there is access to the API and the user is logged in.
 * An address can be used instead of Latitude.
 * @customfunction API_VERSION
 * @return {Promise<string>} Cell saying 'Hello world!' or 'Unauthorised'.
 */
async function API_VERSION():Promise<string> {
  try {
    const url = `${_apiUrl}api_version`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    console.log(responseJSON)
    const message = `version: ${responseJSON.message["version"]}, api_location: ${responseJSON.message["api_environment"]}, client_location: ${responseJSON.message["client_environment"]}`
    console.log(message)
    if (apiResponse.ok) { return message; }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.API_VERSION = API_VERSION;

/**
 * Calculates the amount of people within a circular radius of a point, using population data from WorldPop
 * @customfunction POPDENS_BUFFER
 * @param {any} bufferMeters
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */
async function POPDENS_BUFFER(bufferMeters:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(bufferMeters)) { throw errInvalidValue('Buffer not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}population_density_buffer?buffer=${bufferMeters}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_BUFFER = POPDENS_BUFFER;

/**
 * Calculates the amount of people within a circular radius of a point, during daytime, nighttime and average.
 * An address can be used instead of Latitude.
 * @customfunction POP_BUFFER
 * @param {any} bufferMeters
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<any[][]>} Cells with amount of people during daytime, nightitme and average.
 */
async function POP_BUFFER(bufferMeters:any, latitudeOrAddress:any, longitude:any = false):Promise<any[][]> {
  try {
    if (Number.isNaN(bufferMeters)) { throw errInvalidValue('Buffer not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}population_buffer?buffer=${bufferMeters}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    
    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { 
      if (responseJSON.message.length === 0) { return null; }
      const cell:any[][] = [[],[]];
      for (let i = 0; i < responseJSON.message.length; i += 1) {
        cell[0].push(responseJSON.message[i][0]);
        cell[1].push(Number(responseJSON.message[i][1]));
      }
      
           
      return cell; 
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POP_BUFFER = POP_BUFFER;

/**
 * Calculate the average nightnight in an area.
 * An address can be used instead of Latitude.
 * @customfunction NIGHTLIGHT
 * @param {any} minutes Walking time
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<any[][]>} Timeseries of nightlight
 */
async function NIGHTLIGHT(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<any[][]> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Buffer not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}nightlights?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) {
      if (responseJSON.message.length === 0) { return null; }
      const cell:any[][] = [[], []];
      for (let i = 0; i < responseJSON.message.length; i += 1) {
        cell[0].push(responseJSON.message[i][0]);
        cell[1].push(responseJSON.message[i][1]);
      }
      return cell;
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.NIGHTLIGHT = NIGHTLIGHT;

/**
 * Calculate the demography for an area
 * An address can be used instead of Latitude.
 * @customfunction DEMOGRAPHY
 * @param {any} minutes Walking time 
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<any[][]>} Population by age groups and sex
 */
async function DEMOGRAPHY(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<any[][]> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}demography?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) {
      if (responseJSON.message.length === 0) { return null; }
      const cell:any[][] = [[], []];
      for (let i = 0; i < responseJSON.message.length; i += 1) {
        console.log(responseJSON.message[i])
        cell[0].push(responseJSON.message[i][0]);
        cell[1].push(Math.round(Number(responseJSON.message[i][1])));
      }
      return cell;
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.DEMOGRAPHY = DEMOGRAPHY;

/**
 * Calculates the amount of people within a walkable timeframe of the point. Circular approximation.
 * @customfunction POPDENS_BUFFER_WALK
 * @param {any} minutes
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */
async function POPDENS_BUFFER_WALK(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}population_density_walk?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_BUFFER_WALK = POPDENS_BUFFER_WALK;

/**
 * Calculates the amount of people within a bikeable timeframe of the point. Circular approximation.
 * @customfunction POPDENS_BUFFER_BIKE
 * @param {any} minutes
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */
async function POPDENS_BUFFER_BIKE(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}population_density_bike?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_BUFFER_BIKE = POPDENS_BUFFER_BIKE;

/**
 * Calculates the amount of people within a drivable timeframe of the point. Circular approximation.
 * @customfunction POPDENS_BUFFER_CAR
 * @param {any} minutes
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */
async function POPDENS_BUFFER_CAR(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}population_density_car?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_BUFFER_CAR = POPDENS_BUFFER_CAR;

/**
 * Calculates the amount of people within a walkable timeframe of the point. Traverses the road network creating isocrones.
 * @customfunction POPDENS_ISO_WALK
 * @param {any} minutes
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */
async function POPDENS_ISO_WALK(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}pop_density_isochrone_walk?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_ISO_WALK = POPDENS_ISO_WALK;

/**
 * Calculates the amount of people within a bikeable timeframe of the point. Traverses the road network creating isocrones.
 * @customfunction POPDENS_ISO_BIKE
 * @param {any} minutes
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */
async function POPDENS_ISO_BIKE(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}pop_density_isochrone_bike?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_ISO_BIKE = POPDENS_ISO_BIKE;

/**
 * Calculates the amount of people within a bikeable timeframe of the point. Traverses the road network creating isocrones.
 * @customfunction POPDENS_ISO_CAR
 * @param {any} minutes
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Cell with the amount of people.
 */

async function POPDENS_ISO_CAR(minutes:any, latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    if (Number.isNaN(minutes)) { throw errInvalidValue('Minutes not a number'); }

    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}pop_density_isochrone_car?lat=${coords[0][0]}&lng=${coords[0][1]}&minutes=${minutes}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.POPDENS_ISO_CAR = POPDENS_ISO_CAR;

/**
 * Finds the administrative zone of a point from Latitude and Longitude or an address.
 * Level 1 is regions.
 * @customfunction ADMIN_LEVEL1
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function ADMIN_LEVEL1(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}admin_level_1?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = global.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.ADMIN_LEVEL1 = ADMIN_LEVEL1;

/**
 * Finds the administrative zone of a point from Latitude and Longitude or an address.
 * Level 2 is municipalities.
 * @customfunction ADMIN_LEVEL2
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function ADMIN_LEVEL2(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}admin_level_2?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.ADMIN_LEVEL2 = ADMIN_LEVEL2;

/**
 * Finds the administrative zone that matches the input string the closest.
 * Uses the Levenstein Algorithm.
 * @customfunction ADMIN_LEVEL2_FUZZY_LEV
 * @param {any} latitudeOrAddress
 * @return {Promise<string>} Name of the administrative zone.
 */
async function ADMIN_LEVEL2_FUZZY_LEV(str:any):Promise<string> {
  try {
    const url = `${_apiUrl}admin_level_2_fuzzy_lev?name=${str}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.ADMIN_LEVEL2_FUZZY_LEV = ADMIN_LEVEL2_FUZZY_LEV;

/**
 * Finds the administrative zone that matches the input string the closest.
 * Uses trigrams.
 * @customfunction ADMIN_LEVEL2_FUZZY_TRI
 * @param {any} latitudeOrAddress
 * @return {Promise<string>} Name of the administrative zone.
 */
async function ADMIN_LEVEL2_FUZZY_TRI(str:any):Promise<string> {
  try {
    const url = `${_apiUrl}admin_level_2_fuzzy_tri?name=${str}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.ADMIN_LEVEL2_FUZZY_TRI = ADMIN_LEVEL2_FUZZY_TRI;

/**
 * Finds all the banks and their addresses matching a naming pattern
 * @customfunction BANKS
 * @param {any} name
 * @param {any} [target]
 * @return {Promise<any[][]>}
 */
async function BANKS(name:any, target:any = 0.4):Promise<any[][]> {
  try {
    let _target = 0.4;
    if (!Number.isNaN(Number(target))) { _target = target; }
    if (target === null) { _target = 0.4; }

    const url = `${_apiUrl}get_banks?name=${String(name).replace(/\s/g, '+')}&target=${_target}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();

    if (apiResponse.ok) {
      if (responseJSON.message.length === 0) { return null; }
      const cell = [];
      for (let i = 0; i < responseJSON.message.length; i += 1) {
        cell.push([
          responseJSON.message[i].name,
          Number(responseJSON.message[i].lat),
          Number(responseJSON.message[i].lng),
        ]);
      }
      return cell;
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.BANKS = BANKS;

/**
 * Finds the urban status of a location in Ghana. #landcover #landuse #urban_status
 * @customfunction URBAN_STATUS
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function URBAN_STATUS(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}urban_status?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.URBAN_STATUS = URBAN_STATUS;

/**
 * Finds the simplified (1km majority) urban status of a location in Ghana. #landcover #landuse #urban_status
 * @customfunction URBAN_STATUS_SIMPLE
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function URBAN_STATUS_SIMPLE(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}urban_status_simple?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }
    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.URBAN_STATUS_SIMPLE = URBAN_STATUS_SIMPLE;

/**
 * Finds the nearest placename to the location. Useful to figure out where the point is.
 * @customfunction NEAREST_PLACE
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function NEAREST_PLACE(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}nearest_placename?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.NEAREST_PLACE = NEAREST_PLACE;

/**
 * Finds the nearest point of interest to the location. Useful to figure out where the point is.
 * @customfunction NEAREST_POI
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function NEAREST_POI(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}nearest_poi?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.NEAREST_POI = NEAREST_POI;

/**
 * Finds the nearest bank to a location.
 * @customfunction NEAREST_BANK
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<string>} Name of the administrative zone.
 */
async function NEAREST_BANK(latitudeOrAddress:any, longitude:any = false):Promise<string> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}nearest_bank?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }
    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw errInvalidValue(String(responseJSON.message));
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.NEAREST_BANK = NEAREST_BANK;

/**
 * Calculates the distance to the nearest bank.
 * @customfunction NEAREST_BANK_DIST
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<number>} Name of the administrative zone.
 */
async function NEAREST_BANK_DIST(latitudeOrAddress:any, longitude:any = false):Promise<number> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}nearest_bank_distance?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return Number(responseJSON.message); }

    throw errInvalidValue(String(responseJSON.message));
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.NEAREST_BANK_DIST = NEAREST_BANK_DIST;

/**
 * Calculates the walking time/distance between two points.
 * @customfunction TIME_DISTANCE_A_TO_B_WALK
 * @param {any} lat1 Latitude of first point
 * @param {any} lng1 Longitude of first point
 * @param {any} lat2 Latitude of second point
 * @param {any} lng2 Longitude of second point
 * @param {any} [timeOrDistance] Whether to return time (minutes) or distance (meters). Defaults to time.
 * @return {Promise<string>} Cell with PlusCode address.
 */
async function TIME_DISTANCE_A_TO_B_WALK(lat1:any, lng1:any, lat2:any, lng2:any, timeOrDistance:any = 'time'):Promise<string | number> {
  try {
    const coords1 = await parseToLatlng(lat1, lng1);
    const coords2 = await parseToLatlng(lat2, lng2);
    const url = `${_apiUrl}a_to_b_time_distance_walk?lat1=${coords1[0][0]}&lng1=${coords1[0][1]}&lat2=${coords2[0][0]}&lng2=${coords2[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();

    if (apiResponse.ok) {
      if (timeOrDistance === 'time') {
        return String(responseJSON.message.time);
      }
      return Number(responseJSON.message.distance);
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.TIME_DISTANCE_A_TO_B_WALK = TIME_DISTANCE_A_TO_B_WALK;

/**
 * Calculates the biking time/distance between two points.
 * @customfunction TIME_DISTANCE_A_TO_B_BIKE
 * @param {any} lat1 Latitude of first point
 * @param {any} lng1 Longitude of first point
 * @param {any} lat2 Latitude of second point
 * @param {any} lng2 Longitude of second point
 * @param {any} [timeOrDistance] Whether to return time (minutes) or distance (meters). Defaults to time.
 * @return {Promise<string>} Cell with PlusCode address.
 */
async function TIME_DISTANCE_A_TO_B_BIKE(lat1:any, lng1:any, lat2:any, lng2:any, timeOrDistance:any = 'time'):Promise<string | number> {
  try {
    const coords1 = await parseToLatlng(lat1, lng1);
    const coords2 = await parseToLatlng(lat2, lng2);
    const url = `${_apiUrl}a_to_b_time_distance_bike?lat1=${coords1[0][0]}&lng1=${coords1[0][1]}&lat2=${coords2[0][0]}&lng2=${coords2[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();

    if (apiResponse.ok) {
      if (timeOrDistance === 'time') {
        return String(responseJSON.message.time);
      }
      return Number(responseJSON.message.distance);
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.TIME_DISTANCE_A_TO_B_BIKE = TIME_DISTANCE_A_TO_B_BIKE;

/**
 * Calculates the driving time/distance between two points.
 * @customfunction TIME_DISTANCE_A_TO_B_CAR
 * @param {any} lat1 Latitude of first point
 * @param {any} lng1 Longitude of first point
 * @param {any} lat2 Latitude of second point
 * @param {any} lng2 Longitude of second point
 * @param {any} [timeOrDistance] Whether to return time (minutes) or distance (meters). Defaults to time.
 * @return {Promise<string>} Cell with PlusCode address.
 */
async function TIME_DISTANCE_A_TO_B_CAR(lat1:any, lng1:any, lat2:any, lng2:any, timeOrDistance:any = 'time'):Promise<string | number> {
  try {
    const coords1 = await parseToLatlng(lat1, lng1);
    const coords2 = await parseToLatlng(lat2, lng2);
    const url = `${_apiUrl}a_to_b_time_distance_car?lat1=${coords1[0][0]}&lng1=${coords1[0][1]}&lat2=${coords2[0][0]}&lng2=${coords2[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();

    if (apiResponse.ok) {
      if (timeOrDistance === 'time') {
        return String(responseJSON.message.time);
      }
      return Number(responseJSON.message.distance);
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.TIME_DISTANCE_A_TO_B_CAR = TIME_DISTANCE_A_TO_B_CAR;

/**
 * Calculates the distance between two points
 * @customfunction DISTANCE_A_B
 * @param {any} lat1 Latitude of first point
 * @param {any} lng1 Longitude of first point
 * @param {any} lat2 Latitude of second point
 * @param {any} lng2 Longitude of second point
 * @return {Promise<number>} Cell with PlusCode address.
 */
async function DISTANCE_A_B(lat1:any, lng1:any, lat2:any, lng2:any):Promise<string | number> {
  try {
    const coords1 = await parseToLatlng(lat1, lng1);
    const coords2 = await parseToLatlng(lat2, lng2);

    const distance = haversine(coords1[0], coords2[0], { format: "[lat,lon]", unit: "meter" });
    return distance;
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.DISTANCE_A_B = DISTANCE_A_B;

/**
 * Finds network COVERAGE
 * @customfunction NETWORK_COVERAGE
 * @param {any} lat Latitude
 * @param {any} lng Longitude
 * @return {Promise<string>} Technology available
 */
async function NETWORK_COVERAGE(latitudeOrAddress:any, longitude:any = false):Promise<string> { // eslint-disable-line
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}network_coverage?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    // const technology = ['LTE', 'LTE', 'LTE', '3G', '3G', '4G', 'GME', 'GME', 'GME', 'GME'];
    // const techIndex = Math.floor(Math.random() * technology.length);
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.NETWORK_COVERAGE = NETWORK_COVERAGE;


/**
 * Finds network COVERAGE from MCE source
 * @customfunction MCE_COVERAGE
 * @param {any} lat Latitude
 * @param {any} lng Longitude
 * @return {Promise<string>} Technology available
 */
async function MCE_COVERAGE(latitudeOrAddress:any, longitude:any = false):Promise<string> { // eslint-disable-line
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}mce_coverage?lat=${coords[0][0]}&lng=${coords[0][1]}`;

    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}
g.MCE_COVERAGE = MCE_COVERAGE;

/**
 * Finds network COVERAGE from OCI source
 * @customfunction OCI_COVERAGE
 * @param {any} lat Latitude
 * @param {any} lng Longitude
 * @return {Promise<string>} Technology available
 */
async function OCI_COVERAGE(latitudeOrAddress:any, longitude:any = false):Promise<string> { // eslint-disable-line
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}oci_coverage?lat=${coords[0][0]}&lng=${coords[0][1]}`;

    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) { return String(responseJSON.message); }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}

g.OCI_COVERAGE = OCI_COVERAGE;


/**
 * Shows the weather forecast for the next 7 days on a location
 * An address can be used instead of Latitude.
 * @customfunction WEATHER_FORECAST
 * @param {any} latitudeOrAddress
 * @param {any} [longitude]
 * @return {Promise<any[][]>} Weather forecast
 */
async function WEATHER_FORECAST(latitudeOrAddress:any, longitude:any = false):Promise<any[][]> {
  try {
    const coords = await parseToLatlng(latitudeOrAddress, longitude);
    const url = `${_apiUrl}get_forecast?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) {
      if (responseJSON.message.length === 0) { return null; }
      const cell:any[] = []; 
      // push headers
      const header = ['Date', 'Description', 'Temp_min(°C)', 'Temp_max(°C)', 'Humidity(%)', 'Rain(mm)', 'Clouds(%)', 'Probability of Precipitation(%)', 'Alerts']
      cell.push(header);
      for (let i = 0; i < responseJSON.message.length; i += 1) {
      // push values
        const values = Object.values(responseJSON.message[i])
        if (values.length < 7) {
          values.splice(5, 0, 0)
        }

        cell.push(values);
        
      }
      console.log(cell)

      // await addCellsToSheet(cell);

      return cell
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}

g.WEATHER_FORECAST = WEATHER_FORECAST;


/**
 * Shows the Normalized Difference Vegetation Index (NDVI) statistics over time for a specificed number of days when the data is available on a buffered location 
 * @customfunction AVG_NDVI
 * @param {any} latitude
 * @param {any} longitude
 * @param {any} numberOfDays Number of days for when the data needs to be requested (minimum of 5 days)
 * @param {any} [buffer] buffer of the area to be analyzed: 100m, 500m, or 1000m. Defaults to 100m.
 * @return {Promise<any[][]>} NDVI statistics for each day the date is available over a specified amount of time
 */
async function AVG_NDVI(latitude:any, longitude:any, numberOfDays:any, buffer:any=false):Promise<any[][]> {
  try {
    const coords = await parseToLatlng(latitude, longitude);
    const url = `${_apiUrl}avg_NDVI?lat=${coords[0][0]}&lng=${coords[0][1]}&number_days=${numberOfDays}&buffer=${buffer}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) {
      if (responseJSON.message.length === 0) { return null; }
      const cell:any[] = []; 
      // push headers
      const header = ['Date', 'Min', 'Max', 'Mean', 'stDev']
      cell.push(header);
      for (let i = 0; i < responseJSON.message.length; i += 1) {
      // push values
        const values = Object.values(responseJSON.message[i])

        cell.push(values);
        
      }
      console.log(cell)

      // await addCellsToSheet(cell);

      return cell
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}

g.MONTHLY_NDVI = MONTHLY_NDVI;


/**
 * Shows the Normalized Difference Vegetation Index (NDVI) statistics over a 30 day period when the data is available on a buffered location 
 * @customfunction MONTHLY_NDVI
 * @param {any} latitude
 * @param {any} longitude
 * @param {any} startMonth month of the year to start the analysis in numeric form (from 1 to 12)
 * @param {any} endMonth month of the year to end the analysis in numeric form (from 1 to 12)
 * @param {any} year year in numeric form (starting from 2016)
 * @param {any} [buffer] buffer of the area to be analyzed: 100m, 500m, or 1000m. Defaults to 100m.
 * @return {Promise<any[][]>} NDVI statistics for each month and year specified, aggregated over a 30 day period
 */
async function MONTHLY_NDVI(latitude:any, longitude:any, startMonth:any, endMonth:any, year:any, buffer:any=false):Promise<any[][]> {
  try {
    const coords = await parseToLatlng(latitude, longitude);
    const url = `${_apiUrl}maxNDVI_monthly?lat=${coords[0][0]}&lng=${coords[0][1]}&start_month=${startMonth}&end_month=${endMonth}&year=${year}&buffer=${buffer}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }

    const responseJSON:ApiReply = await apiResponse.json();
    if (apiResponse.ok) {
      if (responseJSON.message.length === 0) { return null; }
      const cell:any[] = []; 
      // push headers
      const header = ['Date', 'Min', 'Max', 'Mean', 'stDev']
      cell.push(header);
      for (let i = 0; i < responseJSON.message.length; i += 1) {
      // push values
        const values = Object.values(responseJSON.message[i])

        cell.push(values);
        
      }
      console.log(cell)

      // await addCellsToSheet(cell);

      return cell
    }

    throw errInvalidValue(responseJSON.message);
  } catch (err) {
    throw errInvalidValue(err);
  }
}

g.MONTHLY_NDVI = MONTHLY_NDVI;

// import arrayToGeojson from './components/map/array_to_geojson'

///// TODO: finalize geometries functions


// /**
//  * Sends geometries to database
//  * @customfunction SENDGEOMS
//  * @return nothing
//  */

// async function SENDGEOMS() { // eslint-disable-line

//   setValueForKey('satf_token', 'casper:golden_ticket')

//   try {
//     let cells = await getSelectedCells();
    
//     if (cells[0][0] == '#CALC!') {
//       cells[0][0] == 'layername'
//     }
    
//     const geojson = await arrayToGeojson(cells);

//     console.log(geojson)
//     console.log(JSON.stringify(geojson))

//     const url = `${_apiUrl}send_geoms`;
//     const token = getValueForKey('satf_token');
//     debugger;
//     const apiResponse = await fetch(url, {
//       headers: {
//         Authorisation: token,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       method: "POST",
//       body: JSON.stringify({geojson, token})
//   })
//   const responseJSON = await apiResponse.json()
//   if (apiResponse.status === 401) { throw errNotAvailable('401: Unauthorised user'); }
//   if (apiResponse.ok) { return String(responseJSON.message); }
//   } catch (err) {
//     throw errInvalidValue(err)
// }
// }
// g.SENDGEOMS = SENDGEOMS;



// /**
//  * Sends geometries to database
//  * @customfunction FETCHGEOMS
//  * @param id
//  * @return {Promise<string>} Technology available
//  */

//  async function FETCHGEOMS(id) { // eslint-disable-line
//   try {
//     const token = getValueForKey('satf_token')
//     const userName = token.split(':')[0] 
//     const apiResponse = await fetch(`${_apiUrl}get_layer_geoms/${userName}/${id}`, {
//       method: 'get',
//       headers: {
//         //  Authorisation: token, 
//           'Content-Type': 'application/json',
//         },
//       });
//       // if (apiResponse.ok) {
//         // send repsonse to excel
//     const responseJSON = await apiResponse.json()
//     // const cells = ParseGeometries(responseJSON)

//     const cells = geojsonToArray(responseJSON.results, 'Hello World');
//     console.log(cells)
//     try {
//       await addCellsToSheet(cells);
//     } catch (error) {
//       console.log(error);
//     }
//       // }      
//   }
//    catch (error) {
//     console.log(error);
//   }
// }


