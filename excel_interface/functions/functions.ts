/* CustomFunctions, executed in Excel cells. Metadata defined in ./functions_meta.json */
import { isValidPluscode, isValidWhatFreeWords, getGlobal } from './functions_utils'; // eslint-disable-line

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
      const apiResponse = await fetch(url, { headers: { Authorization: localStorage.getItem('token') } });
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
      const apiResponse = await fetch(url, { headers: { Authorization: localStorage.getItem('token') } });
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
  const id = localStorage.getItem('token');
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
