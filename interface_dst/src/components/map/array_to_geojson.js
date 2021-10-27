var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isValidArray, isValidLatitude, isValidLongitude, isValidPluscode, isValidWhatFreeWords, pluscodeToLatLng, what3wordsToLatLng, } from '../../utils';
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
        if (typeof name !== 'string') {
            name = String(name);
        }
        // Is the name an empty string?
        if (name.length === 0) {
            continue;
        }
        // lowercase the name to make comparisons
        name = name.toLowerCase();
        // Compare to the valid headers
        for (let j = 0; j < validHeadersKeys.length; j += 1) {
            // Header has already been found
            if (foundHeadersIndex[validHeadersKeys[j]] !== false) {
                continue;
            }
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
    }
    else if (foundHeadersIndex.what3words !== false) {
        foundHeadersIndex.any = true;
    }
    else if (foundHeadersIndex.pluscode !== false) {
        foundHeadersIndex.any = true;
    }
    else if (foundHeadersIndex.address !== false) {
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
            if (val) {
                validRows[row] = true;
                validCols[col] = true;
            }
        }
    }
    const validatedArray = [];
    for (let row = 0; row < arr.length; row += 1) {
        if (!validRows[row]) {
            continue;
        }
        validatedArray.push([]);
        for (let col = 0; col < arr[0].length; col += 1) {
            if (!validCols[col]) {
                continue;
            }
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
        }
        else {
            previous.push(header[i]);
        }
    }
    return previous;
}
// Generate a geojson point
function generatePoint(coords, properties = {}) {
    const geometry = {
        type: 'Point',
        coordinates: coords.slice().reverse(),
    };
    return {
        type: 'Feature',
        properties,
        geometry,
    };
}
// Generate a geojson from an array
function generateGeojson(geometryArray, propertiesArray) {
    const collection = {
        type: 'FeatureCollection',
        features: [],
    };
    for (let i = 0; i < geometryArray.length; i += 1) {
        const geometry = geometryArray[i];
        const properties = propertiesArray[i] ? propertiesArray[i] : {};
        if (typeof geometry[0] === 'number' && typeof geometry[1] === 'number' && geometry.length === 2) {
            collection.features.push(generatePoint(geometry, properties));
        }
    }
    return collection;
}
function arrayToGeojson(excelCells) {
    return __awaiter(this, void 0, void 0, function* () {
        // Validate array
        if (!isValidArray(excelCells)) {
            return false;
        }
        // Remove all empty rows and columns
        const arr = removeInvalidRowsAndCols(excelCells);
        // First we investigate the header
        let header = arr[0];
        const foundHeaders = searchHeaderForCoordinates(header);
        // If there is a valid header, check for unique values;
        if (foundHeaders.any) {
            header = uniqueHeader(header);
        }
        const selected = {
            name: null,
            col: null,
            amount: null,
        };
        if (typeof foundHeaders.latitude === 'number' && typeof foundHeaders.longitude === 'number') {
            selected.name = 'latlng';
            selected.col = [foundHeaders.latitude, foundHeaders.longitude];
        }
        else if (typeof foundHeaders.pluscode === 'number') {
            selected.name = 'pluscodes';
            selected.col = foundHeaders.pluscode;
        }
        else if (typeof foundHeaders.what3words === 'number') {
            selected.name = 'what3words';
            selected.col = foundHeaders.what3words;
        }
        // No headers indicating geometry has been found or not enough valid rows indicated by the headers.
        // Search for geometry in the columns.
        // Calculate percent of valid rows
        // Priority:
        //   Pluscode
        //   LatLng (Min valid rows)
        //   What3Words
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
                    if (isValidLatitude(val)) {
                        found[col].latitude += 1;
                    }
                    if (isValidLongitude(val)) {
                        found[col].longitude += 1;
                    }
                    if (isValidPluscode(val)) {
                        found[col].pluscodes += 1;
                    }
                    if (isValidWhatFreeWords(val)) {
                        found[col].what3words += 1;
                    }
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
                }
                else if (found[i].longitude > ranking.longitude.amount) {
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
            if (Math.min(ranking.latitude.amount, ranking.longitude.amount) > 0) {
                selected.name = 'latlng';
                selected.col = [ranking.latitude.col, ranking.longitude.col];
                selected.amount = Math.min(ranking.latitude.amount, ranking.longitude.amount);
            }
            else if ((ranking.pluscodes.amount / ranking.total) >= 0.5) {
                selected.name = 'pluscodes';
                selected.col = ranking.pluscodes.col;
                selected.amount = ranking.pluscodes.amount;
            }
            else if ((ranking.what3words.amount / ranking.total) >= 0.5) {
                selected.name = 'what3words';
                selected.col = ranking.what3words.col;
                selected.amount = ranking.what3words.amount;
            }
            else if ((ranking.pluscodes.amount >= ranking.what3words.amount) && (ranking.pluscodes.amount >= Math.min(ranking.latitude.amount, ranking.longitude.amount))) {
                selected.name = 'pluscodes';
                selected.col = ranking.pluscodes.col;
                selected.amount = ranking.pluscodes.amount;
            }
            else if (((ranking.what3words.amount > ranking.pluscodes.amount) && (ranking.what3words.amount > Math.min(ranking.latitude.amount, ranking.longitude.amount)))) {
                selected.name = 'what3words';
                selected.col = ranking.what3words.col;
                selected.amount = ranking.what3words.amount;
            }
            else {
                selected.name = 'latlng';
                selected.col = [ranking.latitude.col, ranking.longitude.col];
                selected.amount = Math.min(ranking.latitude.amount, ranking.longitude.amount);
            }
            if (selected.amount === null) {
                return false;
            }
        }
        const validatedRows = [];
        const properties = [];
        let geometry = [];
        // Validate geometry
        if (selected.name === 'latlng') {
            // Minus one because there is a header in this instance.
            const validLatitudes = new Array(arr.length - 1).fill(false);
            const validLongitudes = new Array(arr.length - 1).fill(false);
            for (let col = 0; col < header.length; col += 1) {
                if (col !== selected.col[0] && col !== selected.col[1]) {
                    continue;
                }
                for (let row = 0; row < arr.length; row += 1) {
                    const val = arr[row][col];
                    if (col === selected.col[0]) {
                        if (isValidLatitude(val)) {
                            validLatitudes[row] = true;
                        }
                    }
                    else if (col === selected.col[1]) {
                        if (isValidLongitude(val)) {
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
                    }
                    else {
                        rowProperies._data = [];
                        for (let j = 0; j < header.length; j += 1) {
                            rowProperies._data.push(arr[i][j]);
                        }
                    }
                    properties.push(rowProperies);
                }
            }
        }
        else if (selected.name === 'pluscodes') {
            for (let col = 0; col < header.length; col += 1) {
                if (col !== selected.col) {
                    continue;
                }
                for (let row = 0; row < arr.length; row += 1) {
                    const val = arr[row][col];
                    if (isValidPluscode(val)) {
                        validatedRows.push(arr[row]);
                        try {
                            geometry.push(pluscodeToLatLng(val));
                        }
                        catch (err) {
                            throw new Error('Unable to convert pluscodes to latlng');
                        }
                        const rowProperies = {};
                        if (foundHeaders.any) {
                            for (let j = 0; j < header.length; j += 1) {
                                rowProperies[header[j]] = arr[row][j];
                            }
                        }
                        else {
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
        else if (selected.name === 'what3words') {
            for (let col = 0; col < header.length; col += 1) {
                if (col !== selected.col) {
                    continue;
                }
                for (let row = 0; row < arr.length; row += 1) {
                    const val = arr[row][col];
                    if (isValidWhatFreeWords(val)) {
                        validatedRows.push(arr[row]);
                        try {
                            geometry.push(what3wordsToLatLng(val));
                        }
                        catch (err) {
                            throw new Error('Unable to convert what3words to latLng.');
                        }
                        const rowProperies = {};
                        if (foundHeaders.any) {
                            for (let j = 0; j < header.length; j += 1) {
                                rowProperies[header[j]] = arr[row][j];
                            }
                        }
                        else {
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
        if (selected.name === 'what3words' || selected.name === 'pluscodes') {
            yield Promise.all(geometry);
            geometry = yield Promise.all(geometry.map((g) => g.json()));
        }
        if (validatedRows.length === 0) {
            return false;
        }
        const geojson = generateGeojson(geometry, properties);
        if (geojson.features.length === 0) {
            return false;
        }
        return generateGeojson(geometry, properties);
    });
}
export default arrayToGeojson;
//# sourceMappingURL=array_to_geojson.js.map