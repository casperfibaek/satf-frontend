window.sharedState = 'empty';

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
      const url = `../../api/whatfreewords_to_latlng?words=${what3words}`;
      const apiResponse = await fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } });
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
      const apiResponse = await fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } });
      const responseJSON = await [apiResponse.json()];

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
    try {
      const url = `../../api/gpgps_to_latlng?gpgps=${gpgps}`;
      const apiResponse = await fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } });
      const responseJSON = await apiResponse.json();

      if (apiResponse.ok) { return [responseJSON.message]; }

      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
    } catch (err) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    }
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
  try {
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
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.PARSE_TO_LATLNG = PARSE_TO_LATLNG;

/**
 * Converts Latitude and Longitude to What3Words. An address can be used instead of Latitude.
 * @customfunction LATLNG_TO_WHAT3WORDS
 * @param {any} latitude_or_address
 * @param {number} [longitude]
 * @return {string} Cell with What3Words address.
 */
async function LATLNG_TO_WHAT3WORDS(latitude, longitude = false) {
  try {
    const coords = await parseCoordinates(latitude, longitude);
    const url = `../../api/latlng_to_whatfreewords?lat=${coords[0][0]}&lng=${coords[0][1]}`;
    const apiResponse = await fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } });
    const responseJSON = await apiResponse.json();

    if (apiResponse.ok) { return [responseJSON.message]; }

    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(responseJSON.message));
  } catch (err) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
  }
}
g.LATLNG_TO_WHAT3WORDS = LATLNG_TO_WHAT3WORDS;

// function LatLngToPluscode(latitude, longitude) {
//   return new Promise((resolve, reject) => {
//     satfApiRequest('get', `${apiUrl}latlng_to_pluscode?lat=${latitude}&lng=${longitude}`)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   });
// }
// g.LatLngToPluscode = LatLngToPluscode;

// function helloWorld() {
//   const id = globalThis.localStorage.getItem('satf_token');
//   console.log('hello hello - from new - see me?');
//   return `hello ${id}`;
// }
// g.helloWorld = helloWorld;

// function PopulationDensity(latitude, longitude = false) {
//   const baseurl = `${apiUrl}population_density`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(Number(value));
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.PopulationDensity = PopulationDensity;

// function PopulationDensityBuffer(bufferMeters, latitude, longitude = false) {
//   const url = (buffer, lat, lng) => `${apiUrl}population_density_buffer?lat=${lat}&lng=${lng}&buffer=${buffer}`; // eslint-disable-line
//   try {
//     if (isValidWhatFreeWords(latitude)) {
//       return what3WordsToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(bufferMeters, lat, lng))
//             .then((value) => {
//               resolve(Number(value));
//             })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     if (isValidPluscode(latitude)) {
//       return plusCodeToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(bufferMeters, lat, lng))
//             .then((value) => {
//               resolve(Number(value));
//             })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     const lat = latitude;
//     const lng = longitude;

//     return new Promise((resolve, reject) => {
//       satfApiRequest('get', url(bufferMeters, lat, lng))
//         .then((value) => { resolve(Number(value)); })
//         .catch((err) => {
//           reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//         });
//     });
//   } catch (err) {
//     const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
//     throw error;
//   }
// }
// g.PopulationDensityBuffer = PopulationDensityBuffer;

// function PopulationDensityWalk(minutes, latitude, longitude = false) {
//   const url = (buffer, lat, lng) => `${apiUrl}population_density_walk?lat=${lat}&lng=${lng}&minutes=${buffer}`; // eslint-disable-line
//   try {
//     if (isValidWhatFreeWords(latitude)) {
//       return what3WordsToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(minutes, lat, lng))
//             .then((value) => { resolve(Number(value)); })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     if (isValidPluscode(latitude)) {
//       return plusCodeToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(minutes, lat, lng))
//             .then((value) => { resolve(Number(value)); })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     const lat = latitude;
//     const lng = longitude;

//     return new Promise((resolve, reject) => {
//       satfApiRequest('get', url(minutes, lat, lng))
//         .then((value) => { resolve(Number(value)); })
//         .catch((err) => {
//           reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//         });
//     });
//   } catch (err) {
//     const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
//     throw error;
//   }
// }
// g.PopulationDensityWalk = PopulationDensityWalk;

// function PopulationDensityBike(minutes, latitude, longitude = false) {
//   const url = (buffer, lat, lng) => `${apiUrl}population_density_bike?lat=${lat}&lng=${lng}&minutes=${buffer}`; // eslint-disable-line
//   try {
//     if (isValidWhatFreeWords(latitude)) {
//       return what3WordsToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(minutes, lat, lng))
//             .then((value) => { resolve(Number(value)); })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     if (isValidPluscode(latitude)) {
//       return plusCodeToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(minutes, lat, lng))
//             .then((value) => { resolve(Number(value)); })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     const lat = latitude;
//     const lng = longitude;

//     return new Promise((resolve, reject) => {
//       satfApiRequest('get', url(minutes, lat, lng))
//         .then((value) => { resolve(Number(value)); })
//         .catch((err) => {
//           reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//         });
//     });
//   } catch (err) {
//     const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
//     throw error;
//   }
// }
// g.PopulationDensityBike = PopulationDensityBike;

// function PopulationDensityCar(minutes, latitude, longitude = false) {
//   const url = (buffer, lat, lng) => `${apiUrl}population_density_car?lat=${lat}&lng=${lng}&minutes=${buffer}`; // eslint-disable-line
//   try {
//     if (isValidWhatFreeWords(latitude)) {
//       return what3WordsToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(minutes, lat, lng))
//             .then((value) => { resolve(Number(value)); })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     if (isValidPluscode(latitude)) {
//       return plusCodeToLatLng(latitude).then((latlng) => {
//         const coords = JSON.parse(latlng);
//         const lat = coords[0];
//         const lng = coords[1];

//         return new Promise((resolve, reject) => {
//           satfApiRequest('get', url(minutes, lat, lng))
//             .then((value) => { resolve(Number(value)); })
//             .catch((err) => {
//               reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//             });
//         });
//       });
//     }

//     const lat = latitude;
//     const lng = longitude;

//     return new Promise((resolve, reject) => {
//       satfApiRequest('get', url(minutes, lat, lng))
//         .then((value) => { resolve(Number(value)); })
//         .catch((err) => {
//           reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//         });
//     });
//   } catch (err) {
//     const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
//     throw error;
//   }
// }
// g.PopulationDensityCar = PopulationDensityCar;

// function AdminLevel1(latitude, longitude = false) {
//   const baseurl = `${apiUrl}admin_level_1`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.AdminLevel1 = AdminLevel1;

// function AdminLevel2(latitude, longitude = false) {
//   const baseurl = `${apiUrl}admin_level_2`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.AdminLevel2 = AdminLevel2;

// function AdminLevel2FuzzyLev(name) {
//   return new Promise(((resolve, reject) => {
//     satfApiRequest('get', `${apiUrl}admin_level_2_fuzzy_lev?name=${name}`)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.AdminLevel2FuzzyLev = AdminLevel2FuzzyLev;

// function AdminLevel2FuzzyTri(name) {
//   return new Promise(((resolve, reject) => {
//     satfApiRequest('get', `${apiUrl}admin_level_2_fuzzy_tri?name=${name}`)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.AdminLevel2FuzzyTri = AdminLevel2FuzzyTri;

// function UrbanStatus(latitude, longitude = false) {
//   const baseurl = `${apiUrl}urban_status`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.UrbanStatus = UrbanStatus;

// function UrbanStatusSimple(latitude, longitude = false) {
//   const baseurl = `${apiUrl}urban_status_simple`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.UrbanStatusSimple = UrbanStatusSimple;

// function NearestPlace(latitude, longitude = false) {
//   const baseurl = `${apiUrl}nearest_placename`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.NearestPlace = NearestPlace;

// function NearestPoi(latitude, longitude = false) {
//   const baseurl = `${apiUrl}nearest_poi`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.NearestPoi = NearestPoi;

// function NearestBank(latitude, longitude = false) {
//   const baseurl = `${apiUrl}nearest_bank`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.NearestBank = NearestBank;

// /**
//   * Gets the star count for a given Github repository.
//   * @customfunction
//   * @param {string} userName string name of Github user or organization.
//   * @param {string} repoName string name of the Github repository.
//   * @return {number} number of stars given to a Github repository.
//   */
// function NearestBankDist(latitude, longitude = false) {
//   const baseurl = `${apiUrl}nearest_bank_distance`;
//   return new Promise(((resolve, reject) => {
//     getLatLngInfo(baseurl, latitude, longitude)
//       .then((value) => {
//         resolve(value);
//       })
//       .catch((err) => {
//         reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
//       });
//   }));
// }
// g.NearestBankDist = NearestBankDist;

console.log('Loaded: functions.js');
