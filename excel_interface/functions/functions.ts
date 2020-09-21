/* CustomFunctions, executed in Excel cells. Metadata defined in ./functions_meta.json */
function isValidPluscode(code) {
  // A separator used to break the code into two parts to aid memorability.
  const seperator = '+';

  // The number of characters to place before the separator.
  const seperatorPosition = 8;

  // The character used to pad codes.
  const paddingCharacter = '0';

  // The character set used to encode the values.
  const codeAlphabet = '23456789CFGHJMPQRVWX';

  if (!code || typeof code !== 'string') {
    return false;
  }
  // The separator is required.
  if (code.indexOf(seperator) === -1) {
    return false;
  }
  if (code.indexOf(seperator) !== code.lastIndexOf(seperator)) {
    return false;
  }
  // Is it the only character?
  if (code.length === 1) {
    return false;
  }
  // Is it in an illegal position?
  if (code.indexOf(seperator) > seperatorPosition || code.indexOf(seperator) % 2 === 1) {
    return false;
  }
  // We can have an even number of padding characters before the separator,
  // but then it must be the final character.
  if (code.indexOf(paddingCharacter) > -1) {
    // Not allowed to start with them!
    if (code.indexOf(paddingCharacter) === 0) {
      return false;
    }
    // There can only be one group and it must have even length.
    const padMatch = code.match(new RegExp(`(${paddingCharacter}+)`, 'g'));
    if (
      padMatch.length > 1 || padMatch[0].length % 2 === 1 || padMatch[0].length > seperatorPosition - 2
    ) {
      return false;
    }
    // If the code is long enough to end with a separator, make sure it does.
    if (code.charAt(code.length - 1) !== seperator) {
      return false;
    }
  }
  // If there are characters after the separator, make sure there isn't just
  // one of them (not legal).
  if (code.length - code.indexOf(seperator) - 1 === 1) {
    return false;
  }

  // Strip the separator and any padding characters.
  const nosepCode = code.replace(new RegExp(`\\${seperator}+`), '').replace(new RegExp(`${paddingCharacter}+`), '');
  // Check the code contains only valid characters.
  for (let i = 0, len = nosepCode.length; i < len; i += 1) {
    const character = nosepCode.charAt(i).toUpperCase();
    if (character !== seperator && codeAlphabet.indexOf(character) === -1) {
      return false;
    }
  }
  return true;
}

function isValidWhatFreeWords(str) {
  if (typeof str !== 'string') { return false; }
  if (str.split('.').length !== 3) { return false; }
  if (/^[a-zA-Z.]+$/.test(str) === false) { return false; }

  return true;
}

function isValidGhanaPostalGPS(str) {
  if (typeof str !== 'string') { return false; }
  const arr = str.split('-');

  if (arr.length !== 3) { return false; }
  if (arr[0].length !== 2) { return false; }
  if (arr[1].length < 3 || arr[1].length > 5) { return false; }
  if (arr[2].length < 3 || arr[2].length > 5) { return false; }
  if (/^\d+$/.test(arr[0]) === true) { return false; }
  if (/^[a-zA-Z]+$/.test(arr[0]) === false) { return false; }
  if (/^\d+$/.test(arr[1]) === false) { return false; }
  if (/^\d+$/.test(arr[2]) === false) { return false; }

  return true;
}

function isValidLatitude(lat) {
  const number = Number(lat);
  try {
    if (isNaN(number)) { return false; }
    if (number < -90 || number > 90) { return false; }
    return true;
  } catch {
    return false;
  }
}

function isValidLongitude(lat) {
  const number = Number(lat);
  try {
    if (isNaN(number)) { return false; }
    if (number < -180 || number > 180) { return false; }
    return true;
  } catch {
    return false;
  }
}

function coordinateArray(arr) {
  if (!Array.isArray(arr)) { return false; }
  if (arr.length === 0 || arr.length > 2) { return false; }
  if (arr.length === 1) {
    if (arr[0].length !== 2) { return false; }
    if (!isValidLatitude(arr[0][0])) { return false; }
    if (!isValidLongitude(arr[0][1])) { return false; }
    return [Number(arr[0][0]), Number(arr[0][1])];
  } if (arr.length === 2) {
    if (Array.isArray(arr[0]) && Array.isArray(arr[1])) {
      if (!isValidLatitude(arr[0][0])) { return false; }
      if (!isValidLongitude(arr[1][0])) { return false; }
      return [Number(arr[0][0]), Number(arr[1][0])];
    }
    if (!isValidLatitude(arr[0])) { return false; }
    if (!isValidLongitude(arr[1])) { return false; }
    return [Number(arr[0]), Number(arr[1])];
  }
  return false;
}

function getGlobal() {
  if (typeof self !== 'undefined') {
    return self;
  } if (typeof window !== 'undefined') {
    return window;
  } if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('Unable to get global namespace.');
}

Office.onReady(() => {});

const g = getGlobal() as any;

/**
 * Converts What3Words to two adjacent cells containing Latitude and Longitude.
 * @customfunction WHAT3WORDS_TO_LATLNG
 * @param {string} what3words
 * @return {number[][]} Two cells with latitude and longitude
 */
async function WHAT3WORDS_TO_LATLNG(what3words) {
  if (isValidWhatFreeWords(what3words)) {
    try {
      const url = `../../api/what3words_to_latlng?words=${what3words}`;
      const token = g.localStorage.getItem('satf_token');

      const apiResponse = await fetch(url, { headers: { Authorization: token } });

      if (apiResponse.status === 401) {
        throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, String('Unauthorised user'));
      }

      const responseJSON = await apiResponse.json();
      if (apiResponse.ok) { return [responseJSON.message]; }

      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
    } catch (err) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    }
  }
  throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('500: Invalid What3Words'));
}
g.WHAT3WORDS_TO_LATLNG = WHAT3WORDS_TO_LATLNG;

/**
 * Converts a Pluscode to two adjacent cells containing Latitude and Longitude.
 * @customfunction PLUSCODE_TO_LATLNG
 * @param {string} pluscode
 * @return {number[][]} Two adjacent cells with latitude and longitude
 */
async function PLUSCODE_TO_LATLNG(pluscode) {
  if (isValidPluscode(pluscode)) {
    try {
      const url = `../../api/pluscode_to_latlng?code=${pluscode}`;
      const token = g.localStorage.getItem('satf_token');

      const apiResponse = await fetch(url, { headers: { Authorization: token } });

      if (apiResponse.status === 401) {
        throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, String('Unauthorised user'));
      }

      const responseJSON = await apiResponse.json();
      if (apiResponse.ok) { return [responseJSON.message]; }

      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
    } catch (err) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    }
  }
  throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('500: Invalid pluscode'));
}
g.PLUSCODE_TO_LATLNG = PLUSCODE_TO_LATLNG;

/**
 * Converts a Ghana Digital Address (Ghana Postal GPS) to two adjacent cells containing Latitude and Longitude.
 * @customfunction GPGPS_TO_LATLNG
 * @param {string} gpgps
 * @return {number[][]} Two adjacent cells with latitude and longitude
 */
async function GPGPS_TO_LATLNG(gpgps) {
  if (isValidGhanaPostalGPS(gpgps)) {
    return [[0.0, 0.0]];
    // try {
    //   const url = `../../api/gpgps_to_latlng?gpgps=${gpgps}`;
    //   const token = g.localStorage.getItem('satf_token');
    //   const apiResponse = await fetch(url, { headers: { Authorization: token } });
    //   const responseJSON = await apiResponse.json();

    //   if (apiResponse.ok) { return [responseJSON.message]; }

    //   throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
    // } catch (err) {
    //   throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    // }
  }
  throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('500: Invalid Ghana Digital Address'));
}
g.GPGPS_TO_LATLNG = GPGPS_TO_LATLNG;

/**
 * Parses an unknown input to Latitude and Longitude if possible.
 * @customfunction PARSE_TO_LATLNG
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {number[][]} Two adjacent cells with latitude and longitude
 */
async function PARSE_TO_LATLNG(latitude_or_address, longitude = false) {
  const coordArray = coordinateArray(latitude_or_address);

  if (coordArray) {
    return [coordArray];
  } if (isValidLatitude(latitude_or_address) && isValidLongitude(longitude)) {
    return [[latitude_or_address, longitude]];
  } if (isValidWhatFreeWords(latitude_or_address)) {
    const coords = await WHAT3WORDS_TO_LATLNG(latitude_or_address);
    return coords;
  } if (isValidPluscode(latitude_or_address)) {
    const coords = await PLUSCODE_TO_LATLNG(latitude_or_address);
    return coords;
  } if (isValidGhanaPostalGPS(latitude_or_address)) {
    const coords = await GPGPS_TO_LATLNG(latitude_or_address);
    return coords;
  }

  throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('400: Unable to parse input'));
}
g.PARSE_TO_LATLNG = PARSE_TO_LATLNG;

/**
 * Converts Latitude and Longitude to What3Words.
 * An address can be used instead of Latitude.
 * @customfunction LATLNG_TO_WHAT3WORDS
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with What3Words address.
 */
async function LATLNG_TO_WHAT3WORDS(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/latlng_to_what3words?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, String('Unauthorised user'));
    }

    const responseJSON = await apiResponse.json();

    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.LATLNG_TO_WHAT3WORDS = LATLNG_TO_WHAT3WORDS;

/**
 * Converts Latitude and Longitude to PlusCodes.
 * An address can be used instead of Latitude.
 * @customfunction LATLNG_TO_PLUSCODE
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with PlusCode address.
 */
async function LATLNG_TO_PLUSCODE(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/latlng_to_pluscode?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, String('Unauthorised user'));
    }

    const responseJSON = await apiResponse.json();

    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.LATLNG_TO_PLUSCODE = LATLNG_TO_PLUSCODE;

/**
 * Converts Latitude and Longitude to Ghana Digital Address (Ghana Postal GPS).
 * An address can be used instead of Latitude.
 * @customfunction LATLNG_TO_GPGPS
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with Ghana Digital Address.
 */
async function LATLNG_TO_GPGPS(latitude, longitude = false) {
  try {
    await PARSE_TO_LATLNG(latitude, longitude);
    return 'CP-0968-1906';
  } catch {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Unable to parse input'));
  }
  // try {
  //   const coords = await PARSE_TO_LATLNG(latitude, longitude);
  //   const url = `../../api/latlng_to_pluscode?lat=${coords[0][0]}&lng=${coords[0][1]}`;
  //   const token = g.localStorage.getItem('satf_token');

  //   const apiResponse = await fetch(url, { headers: { Authorization: token } });
  //   const responseJSON = await apiResponse.json();

  //   if (apiResponse.ok) { return responseJSON.message; }

  //   throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  // } catch (err) {
  //   throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  // }
}
g.LATLNG_TO_GPGPS = LATLNG_TO_GPGPS;

/**
 * Tests if there is access to the API and the user is logged in.
 * An address can be used instead of Latitude.
 * @customfunction HELLO_WORLD
 * @return {string} Cell saying 'Hello world!' or 'Unauthorised'.
 */
async function HELLO_WORLD() {
  try {
    const url = '../../api/hello_world';
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.HELLO_WORLD = HELLO_WORLD;

/**
 * Calculates the amount of people within a circular radius of a point.
 * An address can be used instead of Latitude.
 * @customfunction POPDENS_BUFFER
 * @param {number} bufferMeters
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {number} Cell with amount of people.
 */
async function POPDENS_BUFFER(bufferMeters, latitude_or_address, longitude = false) {
  try {
    if (isNaN(bufferMeters)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Buffer not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/population_density_buffer?buffer=${bufferMeters}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_BUFFER = POPDENS_BUFFER;

/**
 * Calculates the amount of people within a walkable timeframe of the point. Circular approximation.
 * @customfunction POPDENS_BUFFER_WALK
 * @param {number} minutes
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with the amount of people.
 */
async function POPDENS_BUFFER_WALK(minutes, latitude_or_address, longitude = false) {
  try {
    if (isNaN(minutes)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Minutes not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/population_density_walk?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_BUFFER_WALK = POPDENS_BUFFER_WALK;

/**
 * Calculates the amount of people within a bikeable timeframe of the point. Circular approximation.
 * @customfunction POPDENS_BUFFER_BIKE
 * @param {number} minutes
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with the amount of people.
 */
async function POPDENS_BUFFER_BIKE(minutes, latitude_or_address, longitude = false) {
  try {
    if (isNaN(minutes)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Minutes not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/population_density_bike?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_BUFFER_BIKE = POPDENS_BUFFER_BIKE;

/**
 * Calculates the amount of people within a drivable timeframe of the point. Circular approximation.
 * @customfunction POPDENS_BUFFER_CAR
 * @param {number} minutes
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with the amount of people.
 */
async function POPDENS_BUFFER_CAR(minutes, latitude_or_address, longitude = false) {
  try {
    if (isNaN(minutes)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Minutes not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/population_density_car?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_BUFFER_CAR = POPDENS_BUFFER_CAR;

/**
 * Calculates the amount of people within a walkable timeframe of the point. Traverses the road network creating isocrones.
 * @customfunction POPDENS_ISO_WALK
 * @param {number} minutes
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with the amount of people.
 */
async function POPDENS_ISO_WALK(minutes, latitude_or_address, longitude = false) {
  try {
    if (isNaN(minutes)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Minutes not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/pop_density_isochrone_walk?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_ISO_WALK = POPDENS_ISO_WALK;

/**
 * Calculates the amount of people within a bikeable timeframe of the point. Traverses the road network creating isocrones.
 * @customfunction POPDENS_ISO_BIKE
 * @param {number} minutes
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with the amount of people.
 */
async function POPDENS_ISO_BIKE(minutes, latitude_or_address, longitude = false) {
  try {
    if (isNaN(minutes)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Minutes not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/pop_density_isochrone_bike?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_ISO_BIKE = POPDENS_ISO_BIKE;

/**
 * Calculates the amount of people within a drivable timeframe of the point. Traverses the road network creating isocrones.
 * @customfunction POPDENS_ISO_CAR
 * @param {number} minutes
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with the amount of people.
 */
async function POPDENS_ISO_CAR(minutes, latitude_or_address, longitude = false) {
  try {
    if (isNaN(minutes)) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Minutes not a number'));
    }
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/pop_density_isochrone_car?minutes=${minutes}&lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.POPDENS_ISO_CAR = POPDENS_ISO_CAR;

/**
 * Finds the administrative zone of a point from Latitude and Longitude or an address.
 * Level 1 is regions.
 * @customfunction ADMIN_LEVEL1
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Name of the administrative zone.
 */
async function ADMIN_LEVEL1(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/admin_level_1?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.ADMIN_LEVEL1 = ADMIN_LEVEL1;

/**
 * Finds the administrative zone of a point from Latitude and Longitude or an address.
 * Level 2 is municipalities.
 * @customfunction ADMIN_LEVEL2
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Name of the administrative zone.
 */
async function ADMIN_LEVEL2(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/admin_level_2?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.ADMIN_LEVEL2 = ADMIN_LEVEL2;

/**
 * Finds the administrative zone that matches the input string the closest.
 * Uses the Levenstein Algorithm.
 * @customfunction ADMIN_LEVEL2_FUZZY_LEV
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function ADMIN_LEVEL2_FUZZY_LEV(str) {
  try {
    const url = `../../api/admin_level_2_fuzzy_lev?name=${str}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.ADMIN_LEVEL2_FUZZY_LEV = ADMIN_LEVEL2_FUZZY_LEV;

/**
 * Finds the administrative zone that matches the input string the closest.
 * Uses trigrams.
 * @customfunction ADMIN_LEVEL2_FUZZY_TRI
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function ADMIN_LEVEL2_FUZZY_TRI(str) {
  try {
    const url = `../../api/admin_level_2_fuzzy_tri?name=${str}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.ADMIN_LEVEL2_FUZZY_TRI = ADMIN_LEVEL2_FUZZY_TRI;

/**
 * Finds all the banks and their addresses matching a naming pattern
 * @customfunction GET_BANKS
 * @param {string} name
 * @param {number} [target]
 * @return {any[][]}
 */
async function GET_BANKS(name, target = 0.4) {
  try {
    const url = `../../api/get_banks?name=${String(name).replace(/\s/g, '+')}&target=${Number(target)}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.GET_BANKS = GET_BANKS;

/**
 * Finds the urban status of a location. #landcover #landuse #urban_status
 * @customfunction URBAN_STATUS
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function URBAN_STATUS(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/urban_status?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.URBAN_STATUS = URBAN_STATUS;

/**
 * Finds the simplified (1km majority) urban status of a location. #landcover #landuse #urban_status
 * @customfunction URBAN_STATUS_SIMPLE
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function URBAN_STATUS_SIMPLE(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/urban_status_simple?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.URBAN_STATUS_SIMPLE = URBAN_STATUS_SIMPLE;

/**
 * Finds the nearest placename to the location. Useful to figure out where the point is.
 * @customfunction NEAREST_PLACE
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function NEAREST_PLACE(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/nearest_placename?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.NEAREST_PLACE = NEAREST_PLACE;

/**
 * Finds the nearest point of interest to the location. Useful to figure out where the point is.
 * @customfunction NEAREST_POI
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function NEAREST_POI(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/nearest_poi?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.NEAREST_POI = NEAREST_POI;

/**
 * Finds the nearest bank to a location.
 * @customfunction NEAREST_BANK
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function NEAREST_BANK(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/nearest_bank?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.NEAREST_BANK = NEAREST_BANK;

/**
 * Calculates the distance to the nearest bank.
 * @customfunction NEAREST_BANK_DIST
 * @param {string} latitude_or_address
 * @return {string} Name of the administrative zone.
 */
async function NEAREST_BANK_DIST(latitude_or_address, longitude = false) {
  try {
    const coords = await PARSE_TO_LATLNG(latitude_or_address, longitude);
    const url = `../../api/nearest_bank_distance?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const token = g.localStorage.getItem('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });
    if (apiResponse.status === 401) { return 'Unauthorised'; }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.NEAREST_BANK_DIST = NEAREST_BANK_DIST;

console.log('Loaded: functions.js');
