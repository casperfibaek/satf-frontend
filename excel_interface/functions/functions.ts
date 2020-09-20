window.sharedState = 'empty';
window.sharedState = { bob: 'hund' };

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
 * Converts What3Words to two cells with latitude and longitude
 * @customfunction WHAT3WORDS_TO_LATLNG
 * @param {string} what3words
 * @return {number} Returns two cells with latitude and longitude
 */
async function what3WordsToLatLng(what3words) {
  if (isValidWhatFreeWords(what3words)) {
    try {
      const url = `../../api/whatfreewords_to_latlng?words=${what3words}`;
      const apiResponse = await fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } });
      const responseJSON = await apiResponse.json();

      return responseJSON;
    } catch (err) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    }
  }
  throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Invalid What3Words'));
}

/**
 * Converts a pluscode to two cells with latitude and longitude
 * @customfunction PLUSCODE_TO_LATLNG
 * @param {string} pluscode
 * @return {number} Returns two cells with latitude and longitude
 */
async function plusCodeToLatLng(pluscode) {
  if (isValidPluscode(pluscode)) {
    try {
      const url = `../../api/pluscode_to_latlng?code=${pluscode}`;
      const apiResponse = await fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } });
      const responseJSON = await apiResponse.json();

      return responseJSON;
    } catch (err) {
      throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    }
  }
  throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Invalid pluscode'));
}

function getLatLngInfo(baseurl, latitude, longitude = false) {
  try {
    if (isValidWhatFreeWords(latitude)) {
      return what3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);

        return new Promise(((resolve, reject) => {
          satfApiRequest('get', `${baseurl}?lat=${coords[0]}&lng=${coords[1]}`)
            .then((value) => {
              resolve(value);
            })
            .catch((err) => { reject(err); });
        }));
      });
    }

    if (isValidPluscode(latitude)) {
      return plusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);

        return new Promise(((resolve, reject) => {
          satfApiRequest('get', `${baseurl}?lat=${coords[0]}&lng=${coords[1]}`)
            .then((value) => {
              resolve(value);
            })
            .catch((err) => { reject(err); });
        }));
      });
    }

    return new Promise(((resolve, reject) => {
      satfApiRequest('get', `${baseurl}?lat=${latitude}&lng=${longitude}`)
        .then((value) => {
          resolve(value);
        })
        .catch((err) => { reject(err); });
    }));
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}

// ----------------------- CustomFunctions -----------------------

function LatLngToWhatFreeWords(latitude, longitude) {
  return new Promise((resolve, reject) => {
    satfApiRequest('get', `${apiUrl}latlng_to_whatfreewords?lat=${latitude}&lng=${longitude}`)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  });
}
g.LatLngToWhatFreeWords = LatLngToWhatFreeWords;

function LatLngToPluscode(latitude, longitude) {
  return new Promise((resolve, reject) => {
    satfApiRequest('get', `${apiUrl}latlng_to_pluscode?lat=${latitude}&lng=${longitude}`)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  });
}
g.LatLngToPluscode = LatLngToPluscode;

function helloWorld() {
  const id = globalThis.localStorage.getItem('satf_token');
  console.log('hello hello - from new - see me?');
  return `hello ${id}`;
}
g.helloWorld = helloWorld;

function PopulationDensity(latitude, longitude = false) {
  const baseurl = `${apiUrl}population_density`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(Number(value));
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.PopulationDensity = PopulationDensity;

function PopulationDensityBuffer(bufferMeters, latitude, longitude = false) {
  const url = (buffer, lat, lng) => `${apiUrl}population_density_buffer?lat=${lat}&lng=${lng}&buffer=${buffer}`; // eslint-disable-line
  try {
    if (isValidWhatFreeWords(latitude)) {
      return what3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(bufferMeters, lat, lng))
            .then((value) => {
              resolve(Number(value));
            })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    if (isValidPluscode(latitude)) {
      return plusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(bufferMeters, lat, lng))
            .then((value) => {
              resolve(Number(value));
            })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    const lat = latitude;
    const lng = longitude;

    return new Promise((resolve, reject) => {
      satfApiRequest('get', url(bufferMeters, lat, lng))
        .then((value) => { resolve(Number(value)); })
        .catch((err) => {
          reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    });
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}
g.PopulationDensityBuffer = PopulationDensityBuffer;

function PopulationDensityWalk(minutes, latitude, longitude = false) {
  const url = (buffer, lat, lng) => `${apiUrl}population_density_walk?lat=${lat}&lng=${lng}&minutes=${buffer}`; // eslint-disable-line
  try {
    if (isValidWhatFreeWords(latitude)) {
      return what3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    if (isValidPluscode(latitude)) {
      return plusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    const lat = latitude;
    const lng = longitude;

    return new Promise((resolve, reject) => {
      satfApiRequest('get', url(minutes, lat, lng))
        .then((value) => { resolve(Number(value)); })
        .catch((err) => {
          reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    });
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}
g.PopulationDensityWalk = PopulationDensityWalk;

function PopulationDensityBike(minutes, latitude, longitude = false) {
  const url = (buffer, lat, lng) => `${apiUrl}population_density_bike?lat=${lat}&lng=${lng}&minutes=${buffer}`; // eslint-disable-line
  try {
    if (isValidWhatFreeWords(latitude)) {
      return what3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    if (isValidPluscode(latitude)) {
      return plusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    const lat = latitude;
    const lng = longitude;

    return new Promise((resolve, reject) => {
      satfApiRequest('get', url(minutes, lat, lng))
        .then((value) => { resolve(Number(value)); })
        .catch((err) => {
          reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    });
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}
g.PopulationDensityBike = PopulationDensityBike;

function PopulationDensityCar(minutes, latitude, longitude = false) {
  const url = (buffer, lat, lng) => `${apiUrl}population_density_car?lat=${lat}&lng=${lng}&minutes=${buffer}`; // eslint-disable-line
  try {
    if (isValidWhatFreeWords(latitude)) {
      return what3WordsToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    if (isValidPluscode(latitude)) {
      return plusCodeToLatLng(latitude).then((latlng) => {
        const coords = JSON.parse(latlng);
        const lat = coords[0];
        const lng = coords[1];

        return new Promise((resolve, reject) => {
          satfApiRequest('get', url(minutes, lat, lng))
            .then((value) => { resolve(Number(value)); })
            .catch((err) => {
              reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
      });
    }

    const lat = latitude;
    const lng = longitude;

    return new Promise((resolve, reject) => {
      satfApiRequest('get', url(minutes, lat, lng))
        .then((value) => { resolve(Number(value)); })
        .catch((err) => {
          reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    });
  } catch (err) {
    const error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
    throw error;
  }
}
g.PopulationDensityCar = PopulationDensityCar;

function AdminLevel1(latitude, longitude = false) {
  const baseurl = `${apiUrl}admin_level_1`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.AdminLevel1 = AdminLevel1;

function AdminLevel2(latitude, longitude = false) {
  const baseurl = `${apiUrl}admin_level_2`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.AdminLevel2 = AdminLevel2;

function AdminLevel2FuzzyLev(name) {
  return new Promise(((resolve, reject) => {
    satfApiRequest('get', `${apiUrl}admin_level_2_fuzzy_lev?name=${name}`)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.AdminLevel2FuzzyLev = AdminLevel2FuzzyLev;

function AdminLevel2FuzzyTri(name) {
  return new Promise(((resolve, reject) => {
    satfApiRequest('get', `${apiUrl}admin_level_2_fuzzy_tri?name=${name}`)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.AdminLevel2FuzzyTri = AdminLevel2FuzzyTri;

function UrbanStatus(latitude, longitude = false) {
  const baseurl = `${apiUrl}urban_status`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.UrbanStatus = UrbanStatus;

function UrbanStatusSimple(latitude, longitude = false) {
  const baseurl = `${apiUrl}urban_status_simple`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.UrbanStatusSimple = UrbanStatusSimple;

function NearestPlace(latitude, longitude = false) {
  const baseurl = `${apiUrl}nearest_placename`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.NearestPlace = NearestPlace;

function NearestPoi(latitude, longitude = false) {
  const baseurl = `${apiUrl}nearest_poi`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.NearestPoi = NearestPoi;

function NearestBank(latitude, longitude = false) {
  const baseurl = `${apiUrl}nearest_bank`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.NearestBank = NearestBank;

/**
  * Gets the star count for a given Github repository.
  * @customfunction
  * @param {string} userName string name of Github user or organization.
  * @param {string} repoName string name of the Github repository.
  * @return {number} number of stars given to a Github repository.
  */
function NearestBankDist(latitude, longitude = false) {
  const baseurl = `${apiUrl}nearest_bank_distance`;
  return new Promise(((resolve, reject) => {
    getLatLngInfo(baseurl, latitude, longitude)
      .then((value) => {
        resolve(value);
      })
      .catch((err) => {
        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
      });
  }));
}
g.NearestBankDist = NearestBankDist;

console.log('Loaded: functions.js');
