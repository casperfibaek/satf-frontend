// global CustomFunctions
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
function isWhat3WordsString(str) {
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
function LatLngToWhat3Words(latitude, longitude) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error, data, err_1, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://marl.io/api/satf/latlng_to_whatfreewords?lat=" + latitude + "&lng=" + longitude)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_1));
                    throw error;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function What3WordsToLatLng(str) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error, data, err_2, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://api.what3words.com/v3/convert-to-coordinates?words=" + str + "&key=TI2OVXV0")];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.coordinates];
                case 3:
                    err_2 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_2));
                    throw error;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function PopulationDensity(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_3, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/population_density?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_3 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_3));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function PopulationDensityBuffer(buffer_in_meters, latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_4, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/population_density_buffer?lat=" + lat + "&lng=" + lng + "&buffer=" + buffer_in_meters)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_4 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_4));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function AdminLevel1(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_5, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/admin_level_1?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_5 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_5));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function AdminLevel2(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_6, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/admin_level_2?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_6 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_6));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function AdminLevel2FuzzyLev(name) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error, data, err_7, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://localhost/api/satf/admin_level_2_fuzzy_lev?name=" + name)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    err_7 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_7));
                    throw error;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function AdminLevel2FuzzyTri(name) {
    return __awaiter(this, void 0, void 0, function () {
        var res, error, data, err_8, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://localhost/api/satf/admin_level_2_fuzzy_tri?name=" + name)];
                case 1:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    err_8 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_8));
                    throw error;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function UrbanStatus(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_9, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/urban_status?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_9 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_9));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function UrbanStatusSimple(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_10, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/urban_status_simple?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_10 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_10));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function NearestPlace(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_11, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/nearest_placename?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_11 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_11));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function NearestPoi(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_12, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/nearest_poi?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_12 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_12));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function NearestBank(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_13, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/nearest_bank?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.text()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 5:
                    err_13 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_13));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function NearestBankDist(latitude, longitude) {
    if (longitude === void 0) { longitude = false; }
    return __awaiter(this, void 0, void 0, function () {
        var lat, lng, coords, res, error, data, err_14, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    lat = latitude;
                    lng = longitude;
                    if (!isWhat3WordsString(latitude)) return [3 /*break*/, 2];
                    return [4 /*yield*/, What3WordsToLatLng(latitude)];
                case 1:
                    coords = _a.sent();
                    lat = coords.lat;
                    lng = coords.lng;
                    _a.label = 2;
                case 2: return [4 /*yield*/, fetch("https://localhost/api/satf/nearest_bank_distance?lat=" + lat + "&lng=" + lng)];
                case 3:
                    res = _a.sent();
                    if (!res.ok) {
                        error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(res.statusText));
                        throw error;
                    }
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _a.sent();
                    return [2 /*return*/, data.distance];
                case 5:
                    err_14 = _a.sent();
                    error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(err_14));
                    throw error;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function helloWorld1() {
    return 'helloWorld1';
}
