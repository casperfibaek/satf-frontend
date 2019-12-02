// global CustomFunctions
/* eslint-disable no-unused-vars */

function makeRequest(method, url, timeout = 12000) {
  return new Promise(((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.timeout = timeout;
    xhr.onload = function changeHappened() {
      if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject(new Error({
          status: this.status,
          statusText: xhr.statusText,
        }));
      }
    };
    xhr.onerror = function errorHappened() {
      reject(new Error({
        status: this.status,
        statusText: xhr.statusText,
      }));
    };
    xhr.ontimeout = function timeoutHappened() {
      reject(new Error({
        status: this.status,
        statusText: `Timeout: ${method}@${url}`,
      }));
    };
    xhr.send();
  }));
}

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
    if (padMatch.length > 1 || padMatch[0].length % 2 === 1 || padMatch[0].length > seperatorPosition - 2) {
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

function LatLngToWhatFreeWords(latitude, longitude) {
  return new Promise((resolve, reject) => {
    makeRequest('get', `https://marl.io/api/satf/latlng_to_whatfreewords?lat=${latitude}&lng=${longitude}`)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  });
}

function What3WordsToLatLng(words) {
  return new Promise((resolve, reject) => {
    makeRequest('get', `https://marl.io/api/satf/whatfreewords_to_latlng?words=${words}`)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  });
}

function LatLngToPluscode(latitude, longitude) {
  return new Promise((resolve, reject) => {
    makeRequest('get', `https://marl.io/api/satf/latlng_to_pluscode?lat=${latitude}&lng=${longitude}`)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  });
}

function PlusCodeToLatLng(code) {
  return new Promise((resolve, reject) => {
    makeRequest('get', `https://marl.io/api/satf/pluscode_to_latlng?code=${code}`)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  });
}

function getLatLngInfo(baseurl, latitude, longitude = false) {
  try {
    if (isValidWhatFreeWords(latitude)) {
      return What3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);

        return new Promise(((resolve, reject) => {
          makeRequest('get', `${baseurl}?lat=${coords[0]}&lng=${coords[1]}`)
            .then((value) => { resolve(value); })
            .catch((err) => { reject(err); });
        }));
      });
    }

    if (isValidPluscode(latitude)) {
      return PlusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);

        return new Promise(((resolve, reject) => {
          makeRequest('get', `${baseurl}?lat=${coords[0]}&lng=${coords[1]}`)
            .then((value) => { resolve(value); })
            .catch((err) => { reject(err); });
        }));
      });
    }

    return new Promise(((resolve, reject) => {
      makeRequest('get', `${baseurl}?lat=${latitude}&lng=${longitude}`)
        .then((value) => { resolve(value); })
        .catch((err) => { reject(err); });
    }));
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

function helloWorld() {
  return 'hello';
}

function PopulationDensity(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/population_density';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(Number(value)); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}

function PopulationDensityBuffer(buffer_in_meters, latitude, longitude = false) {
  const url = (buffer, lat, lng) => `https://marl.io/api/satf/population_density_buffer?lat=${lat}&lng=${lng}&buffer=${buffer}`;
  try {
    if (isValidWhatFreeWords(latitude)) {
      return What3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          makeRequest('get', url(buffer_in_meters, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
        });
      });
    }

    if (isValidPluscode(latitude)) {
      return PlusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          makeRequest('get', url(buffer_in_meters, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
        });
      });
    }

    const lat = latitude;
    const lng = longitude;

    return new Promise((resolve, reject) => {
      makeRequest('get', url(buffer_in_meters, lat, lng))
        .then((value) => { resolve(Number(value)); })
        .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
    });
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

function PopulationDensityWalk(minutes, latitude, longitude = false) {
  const url = (buffer, lat, lng) => `https://marl.io/api/satf/population_density_walk?lat=${lat}&lng=${lng}&minutes=${buffer}`;
  try {
    if (isValidWhatFreeWords(latitude)) {
      return What3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          makeRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
        });
      });
    }

    if (isValidPluscode(latitude)) {
      return PlusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          makeRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
        });
      });
    }

    const lat = latitude;
    const lng = longitude;

    return new Promise((resolve, reject) => {
      makeRequest('get', url(minutes, lat, lng))
        .then((value) => { resolve(Number(value)); })
        .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
    });
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

function AdminLevel1(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/admin_level_1';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}

function AdminLevel2(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/admin_level_2';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}

function AdminLevel2FuzzyLev(name) {
  return new Promise(((resolve, reject) => {
    makeRequest('get', `https://marl.io/api/satf/admin_level_2_fuzzy_lev?name=${name}`)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}

function AdminLevel2FuzzyTri(name) {
  return new Promise(((resolve, reject) => {
    makeRequest('get', `https://marl.io/api/satf/admin_level_2_fuzzy_tri?name=${name}`)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}


function UrbanStatus(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/urban_status';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}


function UrbanStatusSimple(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/urban_status_simple';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}


function NearestPlace(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/nearest_placename';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}


function NearestPoi(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/nearest_poi';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}


function NearestBank(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/nearest_bank';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}


function NearestBankDist(latitude, longitude = false) {
  const baseurl = 'https://marl.io/api/satf/nearest_bank_distance';
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => { resolve(value); })
      .catch((err) => { reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err))); });
  }));
}
