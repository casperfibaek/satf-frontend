System.register(["./whatfreewords.js", "./pluscodes.js"], function (exports_1, context_1) {
    "use strict";
    var whatfreewords_js_1, pluscodes_js_1, valid, usedRanges, selected1, selected2, selected3;
    var __moduleName = context_1 && context_1.id;
    // Check if valid non-empty 2D array
    function arrayIsValid(arr) {
        // Is it an array?
        if (!Array.isArray(arr)) {
            return false;
        }
        // Is it empty?
        if (arr.length === 0) {
            return false;
        }
        // Is it 2d?
        if (!Array.isArray(arr[0])) {
            return false;
        }
        // Does it have rows?
        if (arr[0].length === 0) {
            return false;
        }
        return true;
    }
    // Find references to geodata
    function searchHeaderForCoordinates(header) {
        // Common phrases.
        var validHeaders = {
            latitude: ['latitude', 'latitudes', 'lat', 'lats', 'y'],
            longitude: ['longitude', 'longitudes', 'lng', 'lngs', 'lon', 'lons', 'long', 'longs', 'x'],
            what3words: ['what3words', 'what3word', 'whatthreewords', 'w3w', 'wfw', 'whatfreewords'],
            pluscode: ['pluscode', 'pluscodes', 'olc', 'openlocationcode'],
            address: ['address', 'addr', 'adr'],
        };
        var validHeadersKeys = Object.keys(validHeaders);
        // State
        var foundHeadersIndex = {
            latitude: false,
            longitude: false,
            what3words: false,
            pluscode: false,
            address: false,
            any: false,
        };
        for (var i = 0; i < header.length; i += 1) {
            var name_1 = header[i];
            // Convert non-strings to strings
            if (typeof name_1 !== 'string') {
                name_1 = String(name_1);
            }
            // Is the name an empty string?
            if (name_1.length === 0) {
                continue;
            }
            // lowercase the name to make comparisons
            name_1 = name_1.toLowerCase();
            // Compare to the valid headers
            for (var j = 0; j < validHeadersKeys.length; j += 1) {
                // Header has already been found
                if (foundHeadersIndex[validHeadersKeys[j]] !== false) {
                    continue;
                }
                // ['latitude', 'lat', 'y'] etc..
                var potentialHeaderValues = validHeaders[validHeadersKeys[j]];
                for (var k = 0; k < potentialHeaderValues.length; k += 1) {
                    // 'latitude' etc..
                    var potentialHeaderValue = potentialHeaderValues[k];
                    // if a valid match is found. Break out and update the foundHeadersIndex
                    if (name_1 === potentialHeaderValue) {
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
        var validRows = new Array(arr.length).fill(false);
        var validCols = new Array(arr[0].length).fill(false);
        for (var row = 0; row < arr.length; row += 1) {
            for (var col = 0; col < arr[0].length; col += 1) {
                var val = arr[row][col];
                if (val) {
                    validRows[row] = true;
                    validCols[col] = true;
                }
            }
        }
        var validatedArray = [];
        for (var row = 0; row < arr.length; row += 1) {
            if (!validRows[row]) {
                continue;
            }
            validatedArray.push([]);
            for (var col = 0; col < arr[0].length; col += 1) {
                if (!validCols[col]) {
                    continue;
                }
                var val = arr[row][col];
                validatedArray[validatedArray.length - 1].push(val);
            }
        }
        return validatedArray;
    }
    // Recursively add _ until its unique
    function renameDuplicate(name, array, prefix) {
        if (prefix === void 0) { prefix = '_'; }
        if (array.indexOf(prefix + name) !== -1) {
            return renameDuplicate(prefix + name, array, prefix);
        }
        return prefix + name;
    }
    // Ensure that the header values are unique
    function uniqueHeader(header) {
        var previous = [];
        for (var i = 0; i < header.length; i += 1) {
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
    function generatePoint(coords, properties) {
        if (properties === void 0) { properties = {}; }
        return {
            type: 'Feature',
            properties: properties,
            geometry: {
                type: 'Point',
                coordinates: coords,
            },
        };
    }
    // Generate a geojson from an array
    function generateGeojson(geometry, attributeArray) {
        var collection = {
            type: 'FeatureCollection',
            features: [],
        };
        for (var i = 0; i < geometry.length; i += 1) {
            var feature = geometry[i];
            var properties = attributeArray[i] ? attributeArray[i] : {};
            collection.features.push(generatePoint(feature, properties));
        }
        return collection;
    }
    function arrayToGeojson(eArr) {
        // Validate array
        if (!arrayIsValid(eArr)) {
            return false;
        }
        // Remove all empty rows and columns
        var arr = removeInvalidRowsAndCols(eArr);
        // First we investigate the header
        var header = arr[0];
        var foundHeaders = searchHeaderForCoordinates(header);
        // If there is a valid header, check for unique values;
        if (foundHeaders.any) {
            header = uniqueHeader(header);
        }
        var selected = {
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
        //   What3Words
        //   LatLng (Min valid rows)
        // if more than 50% of pluscodes are valid, choose pluscodes
        // else if more than 50% of what3words are valid, choose what3words
        // else choose the geom type with the most valid rows.
        if (selected.name === null) {
            var found = [];
            for (var i = 0; i < header.length; i += 1) {
                found.push({
                    latitude: 0,
                    longitude: 0,
                    pluscodes: 0,
                    what3words: 0,
                });
            }
            for (var col = 0; col < header.length; col += 1) {
                for (var row = 0; row < arr.length; row += 1) {
                    var val = arr[row][col];
                    if (valid.isValidLatitude(val)) {
                        found[col].latitude += 1;
                    }
                    if (valid.isValidLongitude(val)) {
                        found[col].longitude += 1;
                    }
                    if (valid.isValidPluscode(val)) {
                        found[col].pluscodes += 1;
                    }
                    if (valid.isValidWhatFreeWords(val)) {
                        found[col].what3words += 1;
                    }
                }
            }
            var ranking = {
                total: arr.length,
                latitude: { amount: 0, col: 0 },
                longitude: { amount: 0, col: 0 },
                pluscodes: { amount: 0, col: 0 },
                what3words: { amount: 0, col: 0 },
            };
            // Choose the best cols
            for (var i = 0; i < found.length; i += 1) {
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
            if ((ranking.pluscodes.amount / ranking.total) >= 0.5) {
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
        var validatedRows = [];
        var geometry = [];
        var properties = [];
        // Validate geometry
        if (selected.name === 'latlng') {
            // Minus one because there is a header in this instance.
            var validLatitudes = new Array(arr.length - 1).fill(false);
            var validLongitudes = new Array(arr.length - 1).fill(false);
            for (var col = 0; col < header.length; col += 1) {
                if (col !== selected.col[0] && col !== selected.col[1]) {
                    continue;
                }
                for (var row = 0; row < arr.length; row += 1) {
                    var val = arr[row][col];
                    if (col === selected.col[0]) {
                        if (valid.isValidLatitude(val)) {
                            validLatitudes[row] = true;
                        }
                    }
                    else if (col === selected.col[1]) {
                        if (valid.isValidLongitude(val)) {
                            validLongitudes[row] = true;
                        }
                    }
                }
            }
            for (var i = 0; i < validLatitudes.length; i += 1) {
                var validLat = validLatitudes[i];
                var validLng = validLongitudes[i];
                if (validLat && validLng) {
                    validatedRows.push(arr[i]);
                    geometry.push([
                        Number(arr[i][selected.col[0]]),
                        Number(arr[i][selected.col[1]]),
                    ]);
                    var rowProperies = {};
                    if (foundHeaders.any) {
                        for (var j = 0; j < header.length; j += 1) {
                            rowProperies[header[j]] = arr[i][j];
                        }
                    }
                    else {
                        rowProperies._data = [];
                        for (var j = 0; j < header.length; j += 1) {
                            rowProperies._data.push(arr[i][j]);
                        }
                    }
                    properties.push(rowProperies);
                }
            }
        }
        else if (selected.name === 'pluscodes') {
            for (var col = 0; col < header.length; col += 1) {
                if (col !== selected.col) {
                    continue;
                }
                for (var row = 0; row < arr.length; row += 1) {
                    var val = arr[row][col];
                    if (valid.isValidPluscode(val)) {
                        validatedRows.push(arr[row]);
                        var decoded = pluscodes_js_1.default.decode(val);
                        geometry.push([decoded.latitudeCenter, decoded.longitudeCenter]);
                        var rowProperies = {};
                        if (foundHeaders.any) {
                            for (var j = 0; j < header.length; j += 1) {
                                rowProperies[header[j]] = arr[row][j];
                            }
                        }
                        else {
                            rowProperies._data = [];
                            for (var j = 0; j < header.length; j += 1) {
                                rowProperies._data.push(arr[row][j]);
                            }
                        }
                        properties.push(rowProperies);
                    }
                }
            }
        }
        else if (selected.name === 'what3words') {
            for (var col = 0; col < header.length; col += 1) {
                if (col !== selected.col) {
                    continue;
                }
                for (var row = 0; row < arr.length; row += 1) {
                    var val = arr[row][col];
                    if (valid.isValidWhatFreeWords(val)) {
                        validatedRows.push(arr[row]);
                        var decoded = whatfreewords_js_1.default.words2latlon(val);
                        geometry.push(decoded);
                        var rowProperies = {};
                        if (foundHeaders.any) {
                            for (var j = 0; j < header.length; j += 1) {
                                rowProperies[header[j]] = arr[row][j];
                            }
                        }
                        else {
                            rowProperies._data = [];
                            for (var j = 0; j < header.length; j += 1) {
                                rowProperies._data.push(arr[row][j]);
                            }
                        }
                        properties.push(rowProperies);
                    }
                }
            }
        }
        if (validatedRows === 0) {
            return false;
        }
        var geojson = generateGeojson(geometry, properties);
        if (geojson.features.length === 0) {
            return false;
        }
        return generateGeojson(geometry, properties);
        // TODO: Add error messages
    }
    function lettersToNumber(letters) {
        var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = 0;
        var j = letters.length - 1;
        for (var i = 0; i < letters.length; i += 1, j -= 1) {
            result += (Math.pow(base.length, j)) * (base.indexOf(letters[i]) + 1);
        }
        return result;
    }
    function numberToLetters(index) {
        var dividend = index;
        var name = '';
        var modulo;
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
        }
        if (getText(range.join('')) === range.join('')) {
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
        var bounds = [null, null, null, null]; // minLetter, minNumber, maxLetter, maxNumber
        if (isUnboundedRange(range)) {
            var type = isUnboundedRangeRowOrCol(range);
            if (type === 'row') {
                bounds[1] = getNumbers(range[0]);
                bounds[3] = getNumbers(range[1]);
            }
            else {
                bounds[0] = lettersToNumber(getText(range[0]));
                bounds[2] = lettersToNumber(getText(range[1]));
            }
        }
        else {
            bounds[0] = lettersToNumber(getText(range[0]));
            bounds[1] = getNumbers(range[0]);
            bounds[2] = lettersToNumber(getText(range[1]));
            bounds[3] = getNumbers(range[1]);
        }
        return bounds;
    }
    function isWithinRange(src, target) {
        var srcRange = getRange(src);
        var targetRange = getRange(target);
        var srcBounds = getBounds(srcRange);
        var targetBounds = getBounds(targetRange);
        if ((srcBounds[1] && srcBounds[3])) {
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
        var targetRange = getRange(targetStr);
        var min = targetRange[0];
        var max = targetRange[1];
        var selectedRange = getRange(str);
        var minLetter = lettersToNumber(getText(min));
        var minNumber = getNumbers(min);
        var maxLetter = lettersToNumber(getText(max));
        var maxNumber = getNumbers(max);
        if (isUnboundedRange(selectedRange)) {
            var type = isUnboundedRangeRowOrCol(selectedRange);
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
        var boundedMin = selectedRange[0];
        var boundedMax = selectedRange[1];
        var boundedMinLetter = lettersToNumber(getText(boundedMin));
        var boundedMinNumber = getNumbers(boundedMin);
        var boundedMaxLetter = lettersToNumber(getText(boundedMax));
        var boundedMaxNumber = getNumbers(boundedMax);
        if ((boundedMinNumber >= minNumber)
            && (boundedMaxNumber <= maxNumber)
            && (boundedMinLetter >= minLetter)
            && (boundedMaxLetter <= maxLetter)) {
            return true;
        }
        return false;
    }
    return {
        setters: [
            function (whatfreewords_js_1_1) {
                whatfreewords_js_1 = whatfreewords_js_1_1;
            },
            function (pluscodes_js_1_1) {
                pluscodes_js_1 = pluscodes_js_1_1;
            }
        ],
        execute: function () {
            valid = {
                isValidPluscode: function (code) {
                    // A separator used to break the code into two parts to aid memorability.
                    var seperator = '+';
                    // The number of characters to place before the separator.
                    var seperatorPosition = 8;
                    // The character used to pad codes.
                    var paddingCharacter = '0';
                    // The character set used to encode the values.
                    var codeAlphabet = '23456789CFGHJMPQRVWX';
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
                        var padMatch = code.match(new RegExp("(" + paddingCharacter + "+)", 'g'));
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
                    var nosepCode = code.replace(new RegExp("\\" + seperator + "+"), '').replace(new RegExp(paddingCharacter + "+"), '');
                    // Check the code contains only valid characters.
                    for (var i = 0, len = nosepCode.length; i < len; i += 1) {
                        var character = nosepCode.charAt(i).toUpperCase();
                        if (character !== seperator && codeAlphabet.indexOf(character) === -1) {
                            return false;
                        }
                    }
                    return true;
                },
                isValidWhatFreeWords: function (str) {
                    if (typeof str !== 'string') {
                        return false;
                    }
                    if (str.split('.').length !== 3) {
                        return false;
                    }
                    if (/^[a-zA-Z.]+$/.test(str) === false) {
                        return false;
                    }
                    return true;
                },
                isValidLatitude: function (num) {
                    if (typeof num === 'string') {
                        if (Number(num)) {
                            if (Number(num) < -90 || Number(num) > 90) {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else if (typeof num === 'number') {
                        if (Number(num) < -90 || Number(num) > 90) {
                            return false;
                        }
                    }
                    return true;
                },
                isValidLongitude: function (num) {
                    if (typeof num === 'string') {
                        if (Number(num)) {
                            if (Number(num) < -180 || Number(num) > 180) {
                                return false;
                            }
                        }
                        else {
                            return false;
                        }
                    }
                    else if (typeof num === 'number') {
                        if (Number(num) < -180 || Number(num) > 180) {
                            return false;
                        }
                    }
                    return true;
                },
            };
            usedRanges = 'random_points_25!A1:J27';
            selected1 = 'random_points_25!D:D';
            selected2 = 'random_points_25!12:12';
            selected3 = 'random_points_25!E31,random_points_25!14:14,random_points_25!15:15,random_points_25!19:19';
            exports_1("default", arrayToGeojson);
        }
    };
});
