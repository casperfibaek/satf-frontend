/* eslint-disable no-continue, max-len, no-console, no-underscore-dangle */
/* globals pluscodes, WhatFreeWords */


const valid = {
  isValidPluscode(code) {
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
  },

  isValidWhatFreeWords(str) {
    if (typeof str !== 'string') { return false; }
    if (str.split('.').length !== 3) { return false; }
    if (/^[a-zA-Z.]+$/.test(str) === false) { return false; }

    return true;
  },

  isValidLatitude(num) {
    if (typeof num === 'string') {
      if (Number(num)) {
        if (Number(num) < -90 || Number(num) > 90) { return false; }
      } else {
        return false;
      }
    } else if (typeof num === 'number') {
      if (Number(num) < -90 || Number(num) > 90) { return false; }
    }
    return true;
  },

  isValidLongitude(num) {
    if (typeof num === 'string') {
      if (Number(num)) {
        if (Number(num) < -180 || Number(num) > 180) { return false; }
      } else {
        return false;
      }
    } else if (typeof num === 'number') {
      if (Number(num) < -180 || Number(num) > 180) { return false; }
    }
    return true;
  },
};


// Check if valid non-empty 2D array
function arrayIsValid(arr) {
  // Is it an array?
  if (!Array.isArray(arr)) { return false; }

  // Is it empty?
  if (arr.length === 0) { return false; }

  // Is it 2d?
  if (!Array.isArray(arr[0])) { return false; }

  // Does it have rows?
  if (arr[0].length === 0) { return false; }

  return true;
}

// Find references to geodata
function searchHeaderForCoordinates(header) {
  // Common phrases.
  const validHeaders = {
    latitude: ['latitude', 'latitudes', 'lat', 'lats', 'y'],
    longitude: ['longitude', 'longitudes', 'lng', 'lngs', 'lon', 'lons', 'long', 'longs', 'x'],
    what3words: ['what3words', 'what3word', 'whatthreewords', 'w3w', 'wfw', 'whatfreewords'],
    pluscode: ['pluscode', 'pluscodes', 'olc', 'openlocationcode'],
    address: ['address', 'addr', 'adr'],
  };

  const validHeadersKeys = Object.keys(validHeaders);

  // State
  const foundHeadersIndex = {
    latitude: false,
    longitude: false,
    what3words: false,
    pluscode: false,
    address: false,
    any: false,
  };

  for (let i = 0; i < header.length; i += 1) {
    let name = header[i];

    // Convert non-strings to strings
    if (typeof name !== 'string') { name = String(name); }

    // Is the name an empty string?
    if (name.length === 0) { continue; }

    // lowercase the name to make comparisons
    name = name.toLowerCase();

    // Compare to the valid headers
    for (let j = 0; j < validHeadersKeys.length; j += 1) {
      // Header has already been found
      if (foundHeadersIndex[validHeadersKeys[j]] !== false) { continue; }

      // ['latitude', 'lat', 'y'] etc..
      const potentialHeaderValues = validHeaders[validHeadersKeys[j]];

      for (let k = 0; k < potentialHeaderValues.length; k += 1) {
        // 'latitude' etc..
        const potentialHeaderValue = potentialHeaderValues[k];

        // if a valid match is found. Break out and update the foundHeadersIndex
        if (name === potentialHeaderValue) {
          foundHeadersIndex[validHeadersKeys[j]] = i;
          break;
        }
      }
    }
  }

  // Was there a valid match?
  if (foundHeadersIndex.latitude !== false && foundHeadersIndex.longitude !== false) {
    foundHeadersIndex.any = true;
  } else if (foundHeadersIndex.what3words !== false) {
    foundHeadersIndex.any = true;
  } else if (foundHeadersIndex.pluscode !== false) {
    foundHeadersIndex.any = true;
  } else if (foundHeadersIndex.address !== false) {
    foundHeadersIndex.any = true;
  }

  return foundHeadersIndex;
}

// Remove all empty rows and cols
function removeInvalidRowsAndCols(arr) {
  const validRows = new Array(arr.length).fill(false);
  const validCols = new Array(arr[0].length).fill(false);

  for (let row = 0; row < arr.length; row += 1) {
    for (let col = 0; col < arr[0].length; col += 1) {
      const val = arr[row][col];
      if (val) { validRows[row] = true; validCols[col] = true; }
    }
  }

  const validatedArray = [];
  for (let row = 0; row < arr.length; row += 1) {
    if (!validRows[row]) { continue; }
    validatedArray.push([]);
    for (let col = 0; col < arr[0].length; col += 1) {
      if (!validCols[col]) { continue; }

      const val = arr[row][col];
      validatedArray[validatedArray.length - 1].push(val);
    }
  }

  return validatedArray;
}

// Recursively add _ until its unique
function renameDuplicate(name, array, prefix = '_') {
  if (array.indexOf(prefix + name) !== -1) {
    return renameDuplicate(prefix + name, array, prefix);
  }
  return prefix + name;
}

// Ensure that the header values are unique
function uniqueHeader(header) {
  const previous = [];

  for (let i = 0; i < header.length; i += 1) {
    if (previous.indexOf(header[i]) !== -1) {
      previous.push(renameDuplicate(header[i], previous));
    } else {
      previous.push(header[i]);
    }
  }

  return previous;
}

// Generate a geojson point
function generatePoint(coords, properties = {}) {
  return {
    type: 'Feature',
    properties,
    geometry: {
      type: 'Point',
      coordinates: coords,
    },
  };
}

// Generate a geojson from an array
function generateGeojson(geometry, attributeArray) {
  const collection = {
    type: 'FeatureCollection',
    features: [],
  };

  for (let i = 0; i < geometry.length; i += 1) {
    const feature = geometry[i];
    const properties = attributeArray[i] ? attributeArray[i] : {};

    collection.features.push(generatePoint(feature, properties));
  }

  return collection;
}


window.arrayToGeojson = function arrayToGeojson(eArr) {
  // Validate array
  if (!arrayIsValid(eArr)) { return false; }

  // Remove all empty rows and columns
  const arr = removeInvalidRowsAndCols(eArr);

  // First we investigate the header
  let header = arr[0];
  const foundHeaders = searchHeaderForCoordinates(header);

  // If there is a valid header, check for unique values;
  if (foundHeaders.any) { header = uniqueHeader(header); }

  const selected = {
    name: null,
    col: null,
    amount: null,
  };

  if (typeof foundHeaders.latitude === 'number' && typeof foundHeaders.longitude === 'number') {
    selected.name = 'latlng';
    selected.col = [foundHeaders.latitude, foundHeaders.longitude];
  } else if (typeof foundHeaders.pluscode === 'number') {
    selected.name = 'pluscodes';
    selected.col = foundHeaders.pluscode;
  } else if (typeof foundHeaders.what3words === 'number') {
    selected.name = 'what3words';
    selected.col = foundHeaders.what3words;
  }

  // No headers indicating geometry has been found or not enough valid rows indicated by the headers.
  // Search for geometry in the columns.
  // Calculate percent of valid rows
  // Priority:
  //   Pluscode
  //   What3Words
  //   LatLng (Min valid rows)
  // if more than 50% of pluscodes are valid, choose pluscodes
  // else if more than 50% of what3words are valid, choose what3words
  // else choose the geom type with the most valid rows.

  if (selected.name === null) {
    const found = [];
    for (let i = 0; i < header.length; i += 1) {
      found.push({
        latitude: 0,
        longitude: 0,
        pluscodes: 0,
        what3words: 0,
      });
    }

    for (let col = 0; col < header.length; col += 1) {
      for (let row = 0; row < arr.length; row += 1) {
        const val = arr[row][col];

        if (valid.isValidLatitude(val)) { found[col].latitude += 1; }
        if (valid.isValidLongitude(val)) { found[col].longitude += 1; }
        if (valid.isValidPluscode(val)) { found[col].pluscodes += 1; }
        if (valid.isValidWhatFreeWords(val)) { found[col].what3words += 1; }
      }
    }

    const ranking = {
      total: arr.length,
      latitude: { amount: 0, col: 0 },
      longitude: { amount: 0, col: 0 },
      pluscodes: { amount: 0, col: 0 },
      what3words: { amount: 0, col: 0 },
    };

    // Choose the best cols
    for (let i = 0; i < found.length; i += 1) {
      if (found[i].latitude > ranking.latitude.amount) {
        ranking.latitude.amount = found[i].latitude;
        ranking.latitude.col = i;
      } else if (found[i].longitude > ranking.longitude.amount) {
        ranking.longitude.amount = found[i].longitude;
        ranking.longitude.col = i;
      }

      if (found[i].pluscodes > ranking.pluscodes.amount) {
        ranking.pluscodes.amount = found[i].pluscodes;
        ranking.pluscodes.col = i;
      }

      if (found[i].what3words > ranking.what3words.amount) {
        ranking.what3words.amount = found[i].what3words;
        ranking.what3words.col = i;
      }
    }

    if ((ranking.pluscodes.amount / ranking.total) >= 0.5) {
      selected.name = 'pluscodes';
      selected.col = ranking.pluscodes.col;
      selected.amount = ranking.pluscodes.amount;
    } else if ((ranking.what3words.amount / ranking.total) >= 0.5) {
      selected.name = 'what3words';
      selected.col = ranking.what3words.col;
      selected.amount = ranking.what3words.amount;
    } else if ((ranking.pluscodes.amount >= ranking.what3words.amount) && (ranking.pluscodes.amount >= Math.min(ranking.latitude.amount, ranking.longitude.amount))) {
      selected.name = 'pluscodes';
      selected.col = ranking.pluscodes.col;
      selected.amount = ranking.pluscodes.amount;
    } else if (((ranking.what3words.amount > ranking.pluscodes.amount) && (ranking.what3words.amount > Math.min(ranking.latitude.amount, ranking.longitude.amount)))) {
      selected.name = 'what3words';
      selected.col = ranking.what3words.col;
      selected.amount = ranking.what3words.amount;
    } else {
      selected.name = 'latlng';
      selected.col = [ranking.latitude.col, ranking.longitude.col];
      selected.amount = Math.min(ranking.latitude.amount, ranking.longitude.amount);
    }

    if (selected.amount === null) { return false; }
  }

  const validatedRows = [];
  const geometry = [];
  const properties = [];

  // Validate geometry
  if (selected.name === 'latlng') {
    // Minus one because there is a header in this instance.
    const validLatitudes = new Array(arr.length - 1).fill(false);
    const validLongitudes = new Array(arr.length - 1).fill(false);

    for (let col = 0; col < header.length; col += 1) {
      if (col !== selected.col[0] && col !== selected.col[1]) { continue; }
      for (let row = 0; row < arr.length; row += 1) {
        const val = arr[row][col];
        if (col === selected.col[0]) {
          if (valid.isValidLatitude(val)) {
            validLatitudes[row] = true;
          }
        } else if (col === selected.col[1]) {
          if (valid.isValidLongitude(val)) {
            validLongitudes[row] = true;
          }
        }
      }
    }

    for (let i = 0; i < validLatitudes.length; i += 1) {
      const validLat = validLatitudes[i];
      const validLng = validLongitudes[i];

      if (validLat && validLng) {
        validatedRows.push(arr[i]);
        geometry.push([
          Number(arr[i][selected.col[0]]),
          Number(arr[i][selected.col[1]]),
        ]);

        const rowProperies = {};
        if (foundHeaders.any) {
          for (let j = 0; j < header.length; j += 1) {
            rowProperies[header[j]] = arr[i][j];
          }
        } else {
          rowProperies._data = [];
          for (let j = 0; j < header.length; j += 1) {
            rowProperies._data.push(arr[i][j]);
          }
        }
        properties.push(rowProperies);
      }
    }
  } else if (selected.name === 'pluscodes') {
    for (let col = 0; col < header.length; col += 1) {
      if (col !== selected.col) { continue; }
      for (let row = 0; row < arr.length; row += 1) {
        const val = arr[row][col];
        if (valid.isValidPluscode(val)) {
          validatedRows.push(arr[row]);

          const decoded = pluscodes.decode(val);
          geometry.push([decoded.latitudeCenter, decoded.longitudeCenter]);

          const rowProperies = {};
          if (foundHeaders.any) {
            for (let j = 0; j < header.length; j += 1) {
              rowProperies[header[j]] = arr[row][j];
            }
          } else {
            rowProperies._data = [];
            for (let j = 0; j < header.length; j += 1) {
              rowProperies._data.push(arr[row][j]);
            }
          }

          properties.push(rowProperies);
        }
      }
    }
  } else if (selected.name === 'what3words') {
    for (let col = 0; col < header.length; col += 1) {
      if (col !== selected.col) { continue; }
      for (let row = 0; row < arr.length; row += 1) {
        const val = arr[row][col];
        if (valid.isValidWhatFreeWords(val)) {
          validatedRows.push(arr[row]);

          const decoded = WhatFreeWords.words2latlon(val);
          geometry.push(decoded);

          const rowProperies = {};
          if (foundHeaders.any) {
            for (let j = 0; j < header.length; j += 1) {
              rowProperies[header[j]] = arr[row][j];
            }
          } else {
            rowProperies._data = [];
            for (let j = 0; j < header.length; j += 1) {
              rowProperies._data.push(arr[row][j]);
            }
          }
          properties.push(rowProperies);
        }
      }
    }
  }

  if (validatedRows === 0) { return false; }

  const geojson = generateGeojson(geometry, properties);

  if (geojson.features.length === 0) { return false; }

  return generateGeojson(geometry, properties);

  // TODO: Add error messages
};


const usedRanges = 'random_points_25!A1:J27';
const selected1 = 'random_points_25!D:D';
const selected2 = 'random_points_25!12:12';
const selected3 = 'random_points_25!E31,random_points_25!14:14,random_points_25!15:15,random_points_25!19:19';

function lettersToNumber(letters) {
  const base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 0;
  let j = letters.length - 1;

  for (let i = 0; i < letters.length; i += 1, j -= 1) {
    result += (base.length ** j) * (base.indexOf(letters[i]) + 1);
  }

  return result;
}

function numberToLetters(index) {
  let dividend = index;
  let name = '';
  let modulo;
  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    name = String.fromCharCode(65 + modulo) + name;
    dividend = Math.round((dividend - modulo) / 26);
  }
  return name;
}

function getRange(str) {
  return str.split('!')[1].split(':');
}

function getNumbers(str) {
  return Number(str.replace(/[^0-9]/g, ''));
}

function getText(str) {
  return str.replace(/[0-9]/g, '');
}

function isUnboundedRange(range) {
  if (Number(range[0]) && Number(range[1])) {
    return true;
  } if (getText(range.join('')) === range.join('')) {
    return true;
  }

  return false;
}

function isUnboundedRangeRowOrCol(range) {
  if (Number(range[0]) && Number(range[1])) {
    return 'row';
  }
  return 'col';
}

function getBounds(range) {
  const bounds = [null, null, null, null]; // minLetter, minNumber, maxLetter, maxNumber

  if (isUnboundedRange(range)) {
    const type = isUnboundedRangeRowOrCol(range);
    if (type === 'row') {
      bounds[1] = getNumbers(range[0]);
      bounds[3] = getNumbers(range[1]);
    } else {
      bounds[0] = lettersToNumber(getText(range[0]));
      bounds[2] = lettersToNumber(getText(range[1]));
    }
  } else {
    bounds[0] = lettersToNumber(getText(range[0]));
    bounds[1] = getNumbers(range[0]);
    bounds[2] = lettersToNumber(getText(range[1]));
    bounds[3] = getNumbers(range[1]);
  }

  return bounds;
}

function isWithinRange(src, target) {
  const srcRange = getRange(src);
  const targetRange = getRange(target);

  const srcBounds = getBounds(srcRange);
  const targetBounds = getBounds(targetRange);

  if (
    (srcBounds[1] && srcBounds[3])
  ) {
    //
  }
}

// TODO:

// isWithinRange
// isOverlapsRange
// getIntersection
// getExtration
// mergeRanges
// getValues and addresses from multiSelection


function isWithinRangeOld(str, targetStr) {
  const targetRange = getRange(targetStr);
  const min = targetRange[0];
  const max = targetRange[1];

  const selectedRange = getRange(str);

  const minLetter = lettersToNumber(getText(min));
  const minNumber = getNumbers(min);
  const maxLetter = lettersToNumber(getText(max));
  const maxNumber = getNumbers(max);

  if (isUnboundedRange(selectedRange)) {
    const type = isUnboundedRangeRowOrCol(selectedRange);
    if (type === 'row') {
      if ((getNumbers(selectedRange[0]) >= minNumber) && (getNumbers(selectedRange[1]) <= maxNumber)) {
        return true;
      }
      return false;
    }
    if ((lettersToNumber(getText(selectedRange[0])) >= minLetter) && (lettersToNumber(getText(selectedRange[1])) <= maxLetter)) {
      return true;
    }
    return false;
  }
  const boundedMin = selectedRange[0];
  const boundedMax = selectedRange[1];

  const boundedMinLetter = lettersToNumber(getText(boundedMin));
  const boundedMinNumber = getNumbers(boundedMin);
  const boundedMaxLetter = lettersToNumber(getText(boundedMax));
  const boundedMaxNumber = getNumbers(boundedMax);

  if (
    (boundedMinNumber >= minNumber)
      && (boundedMaxNumber <= maxNumber)
      && (boundedMinLetter >= minLetter)
      && (boundedMaxLetter <= maxLetter)) {
    return true;
  }

  return false;
}
