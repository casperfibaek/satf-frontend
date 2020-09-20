"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
window.sharedState = 'empty';
/* CustomFunctions, executed in Excel cells. Metadata defined in ./functions_meta.json */
function isValidPluscode(code) {
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
}
function isValidWhatFreeWords(str) {
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
}
function getGlobal() {
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw new Error('Unable to get global namespace.');
}
Office.onReady(function () { });
var g = getGlobal();
/**
 * Converts What3Words to two cells with latitude and longitude
 * @customfunction WHAT3WORDS_TO_LATLNG
 * @param {string} what3words
 * @return {number} Returns two cells with latitude and longitude
 */
function what3WordsToLatLng(what3words) {
    return __awaiter(this, void 0, void 0, function () {
        var url, apiResponse, responseJSON, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isValidWhatFreeWords(what3words)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    url = "../../api/whatfreewords_to_latlng?words=" + what3words;
                    return [4 /*yield*/, fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } })];
                case 2:
                    apiResponse = _a.sent();
                    return [4 /*yield*/, apiResponse.json()];
                case 3:
                    responseJSON = _a.sent();
                    return [2 /*return*/, responseJSON];
                case 4:
                    err_1 = _a.sent();
                    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_1));
                case 5: throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Invalid What3Words'));
            }
        });
    });
}
/**
 * Converts a pluscode to two cells with latitude and longitude
 * @customfunction PLUSCODE_TO_LATLNG
 * @param {string} pluscode
 * @return {number} Returns two cells with latitude and longitude
 */
function plusCodeToLatLng(pluscode) {
    return __awaiter(this, void 0, void 0, function () {
        var url, apiResponse, responseJSON, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isValidPluscode(pluscode)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    url = "../../api/pluscode_to_latlng?code=" + pluscode;
                    return [4 /*yield*/, fetch(url, { headers: { Authorization: globalThis.localStorage.getItem('satf_token') } })];
                case 2:
                    apiResponse = _a.sent();
                    return [4 /*yield*/, apiResponse.json()];
                case 3:
                    responseJSON = _a.sent();
                    return [2 /*return*/, responseJSON];
                case 4:
                    err_2 = _a.sent();
                    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_2));
                case 5: throw new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String('Invalid pluscode'));
            }
        });
    });
}
function getLatLngInfo(baseurl, latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    try {
        if (isValidWhatFreeWords(latitude)) {
            return what3WordsToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                return new Promise((function (resolve, reject) {
                    satfApiRequest('get', baseurl + "?lat=" + coords[0] + "&lng=" + coords[1])
                        .then(function (value) {
                        resolve(value);
                    })
                        .catch(function (err) { reject(err); });
                }));
            });
        }
        if (isValidPluscode(latitude)) {
            return plusCodeToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                return new Promise((function (resolve, reject) {
                    satfApiRequest('get', baseurl + "?lat=" + coords[0] + "&lng=" + coords[1])
                        .then(function (value) {
                        resolve(value);
                    })
                        .catch(function (err) { reject(err); });
                }));
            });
        }
        return new Promise((function (resolve, reject) {
            satfApiRequest('get', baseurl + "?lat=" + latitude + "&lng=" + longitude)
                .then(function (value) {
                resolve(value);
            })
                .catch(function (err) { reject(err); });
        }));
    }
    catch (err) {
        var error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
        throw error;
    }
}
// ----------------------- CustomFunctions -----------------------
function LatLngToWhatFreeWords(latitude, longitude) {
    return new Promise(function (resolve, reject) {
        satfApiRequest('get', apiUrl + "latlng_to_whatfreewords?lat=" + latitude + "&lng=" + longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    });
}
g.LatLngToWhatFreeWords = LatLngToWhatFreeWords;
function LatLngToPluscode(latitude, longitude) {
    return new Promise(function (resolve, reject) {
        satfApiRequest('get', apiUrl + "latlng_to_pluscode?lat=" + latitude + "&lng=" + longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    });
}
g.LatLngToPluscode = LatLngToPluscode;
function helloWorld() {
    var id = globalThis.localStorage.getItem('satf_token');
    console.log('hello hello - from new - see me?');
    return "hello " + id;
}
g.helloWorld = helloWorld;
function PopulationDensity(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "population_density";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(Number(value));
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.PopulationDensity = PopulationDensity;
function PopulationDensityBuffer(bufferMeters, latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var url = function (buffer, lat, lng) { return apiUrl + "population_density_buffer?lat=" + lat + "&lng=" + lng + "&buffer=" + buffer; }; // eslint-disable-line
    try {
        if (isValidWhatFreeWords(latitude)) {
            return what3WordsToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(bufferMeters, lat, lng))
                        .then(function (value) {
                        resolve(Number(value));
                    })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        if (isValidPluscode(latitude)) {
            return plusCodeToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(bufferMeters, lat, lng))
                        .then(function (value) {
                        resolve(Number(value));
                    })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        var lat_1 = latitude;
        var lng_1 = longitude;
        return new Promise(function (resolve, reject) {
            satfApiRequest('get', url(bufferMeters, lat_1, lng_1))
                .then(function (value) { resolve(Number(value)); })
                .catch(function (err) {
                reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
    }
    catch (err) {
        var error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
        throw error;
    }
}
g.PopulationDensityBuffer = PopulationDensityBuffer;
function PopulationDensityWalk(minutes, latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var url = function (buffer, lat, lng) { return apiUrl + "population_density_walk?lat=" + lat + "&lng=" + lng + "&minutes=" + buffer; }; // eslint-disable-line
    try {
        if (isValidWhatFreeWords(latitude)) {
            return what3WordsToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(minutes, lat, lng))
                        .then(function (value) { resolve(Number(value)); })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        if (isValidPluscode(latitude)) {
            return plusCodeToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(minutes, lat, lng))
                        .then(function (value) { resolve(Number(value)); })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        var lat_2 = latitude;
        var lng_2 = longitude;
        return new Promise(function (resolve, reject) {
            satfApiRequest('get', url(minutes, lat_2, lng_2))
                .then(function (value) { resolve(Number(value)); })
                .catch(function (err) {
                reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
    }
    catch (err) {
        var error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
        throw error;
    }
}
g.PopulationDensityWalk = PopulationDensityWalk;
function PopulationDensityBike(minutes, latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var url = function (buffer, lat, lng) { return apiUrl + "population_density_bike?lat=" + lat + "&lng=" + lng + "&minutes=" + buffer; }; // eslint-disable-line
    try {
        if (isValidWhatFreeWords(latitude)) {
            return what3WordsToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(minutes, lat, lng))
                        .then(function (value) { resolve(Number(value)); })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        if (isValidPluscode(latitude)) {
            return plusCodeToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(minutes, lat, lng))
                        .then(function (value) { resolve(Number(value)); })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        var lat_3 = latitude;
        var lng_3 = longitude;
        return new Promise(function (resolve, reject) {
            satfApiRequest('get', url(minutes, lat_3, lng_3))
                .then(function (value) { resolve(Number(value)); })
                .catch(function (err) {
                reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
    }
    catch (err) {
        var error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
        throw error;
    }
}
g.PopulationDensityBike = PopulationDensityBike;
function PopulationDensityCar(minutes, latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var url = function (buffer, lat, lng) { return apiUrl + "population_density_car?lat=" + lat + "&lng=" + lng + "&minutes=" + buffer; }; // eslint-disable-line
    try {
        if (isValidWhatFreeWords(latitude)) {
            return what3WordsToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(minutes, lat, lng))
                        .then(function (value) { resolve(Number(value)); })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        if (isValidPluscode(latitude)) {
            return plusCodeToLatLng(latitude).then(function (latlng) {
                var coords = JSON.parse(latlng);
                var lat = coords[0];
                var lng = coords[1];
                return new Promise(function (resolve, reject) {
                    satfApiRequest('get', url(minutes, lat, lng))
                        .then(function (value) { resolve(Number(value)); })
                        .catch(function (err) {
                        reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
                    });
                });
            });
        }
        var lat_4 = latitude;
        var lng_4 = longitude;
        return new Promise(function (resolve, reject) {
            satfApiRequest('get', url(minutes, lat_4, lng_4))
                .then(function (value) { resolve(Number(value)); })
                .catch(function (err) {
                reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
            });
        });
    }
    catch (err) {
        var error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err));
        throw error;
    }
}
g.PopulationDensityCar = PopulationDensityCar;
function AdminLevel1(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "admin_level_1";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.AdminLevel1 = AdminLevel1;
function AdminLevel2(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "admin_level_2";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.AdminLevel2 = AdminLevel2;
function AdminLevel2FuzzyLev(name) {
    return new Promise((function (resolve, reject) {
        satfApiRequest('get', apiUrl + "admin_level_2_fuzzy_lev?name=" + name)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.AdminLevel2FuzzyLev = AdminLevel2FuzzyLev;
function AdminLevel2FuzzyTri(name) {
    return new Promise((function (resolve, reject) {
        satfApiRequest('get', apiUrl + "admin_level_2_fuzzy_tri?name=" + name)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.AdminLevel2FuzzyTri = AdminLevel2FuzzyTri;
function UrbanStatus(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "urban_status";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.UrbanStatus = UrbanStatus;
function UrbanStatusSimple(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "urban_status_simple";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.UrbanStatusSimple = UrbanStatusSimple;
function NearestPlace(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "nearest_placename";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.NearestPlace = NearestPlace;
function NearestPoi(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "nearest_poi";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.NearestPoi = NearestPoi;
function NearestBank(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "nearest_bank";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
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
function NearestBankDist(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    var baseurl = apiUrl + "nearest_bank_distance";
    return new Promise((function (resolve, reject) {
        getLatLngInfo(baseurl, latitude, longitude)
            .then(function (value) {
            resolve(value);
        })
            .catch(function (err) {
            reject(new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err)));
        });
    }));
}
g.NearestBankDist = NearestBankDist;
console.log('Loaded: functions.js');
//# sourceMappingURL=functions.js.map