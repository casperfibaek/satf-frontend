"use strict";
/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */
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
/* global global, Office, self, window */
Office.initialize = function init() {
    if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
        console.log('Sorry, this add-in only works with newer versions of Excel.');
    }
};
var dialog = null;
function insertCell(val) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                        var range;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    range = context.workbook.getSelectedRange();
                                    range.values = [[val]];
                                    return [4 /*yield*/, context.sync()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function oneDown(adr) {
    var sheet = adr.split('!')[0] + "!";
    var x = adr.split('!')[1].split(':')[0];
    var y = adr.split('!')[1].split(':')[1];
    var xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
    var yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);
    return sheet + xn + ":" + yn;
}
function processMessage(arg) {
    return __awaiter(this, void 0, void 0, function () {
        var coords_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(arg.message === 'newCoords')) return [3 /*break*/, 2];
                    coords_1 = JSON.parse(localStorage.getItem('newCoords'));
                    return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                            var range, sheet;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        range = context.workbook.getSelectedRange();
                                        sheet = context.workbook.worksheets.getActiveWorksheet();
                                        range.values = [[coords_1.lat, coords_1.lng]];
                                        range.load('address');
                                        return [4 /*yield*/, context.sync().then(function () { return __awaiter(_this, void 0, void 0, function () {
                                                var downrange;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            downrange = sheet.getRange(oneDown(range.address));
                                                            downrange.select();
                                                            return [4 /*yield*/, context.sync()];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    insertCell(arg.message);
                    document.getElementById('user-name').innerHTML = arg.message;
                    dialog.close();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getSelectedCells() {
    return __awaiter(this, void 0, void 0, function () {
        var values;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    values = null;
                    return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                            var range;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        range = context.workbook.getSelectedRange();
                                        range.load('values');
                                        return [4 /*yield*/, context.sync()];
                                    case 1:
                                        _a.sent();
                                        values = range.values;
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, JSON.stringify(values)];
            }
        });
    });
}
function toggleProtection(event) {
    Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getActiveWorksheet();
        sheet.load('protection/protected');
        return context
            .sync()
            .then(function () {
            if (sheet.protection.protected) {
                sheet.protection.unprotect();
            }
            else {
                sheet.protection.protect();
            }
        })
            .then(context.sync);
    }).catch(function (error) {
        console.log("Error: " + error);
        if (error instanceof OfficeExtension.Error) {
            console.log("Debug info: " + JSON.stringify(error.debugInfo));
        }
    });
    event.completed();
}
function openDialogPopup(event) {
    return __awaiter(this, void 0, void 0, function () {
        var range;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSelectedCells()];
                case 1:
                    range = _a.sent();
                    localStorage.setItem('range', range);
                    localStorage.setItem('clientID', 'casper123');
                    Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/popup/popup.html', {
                        height: 40,
                        width: 30,
                    }, function (asyncResult) {
                        dialog = asyncResult.value;
                        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                    });
                    event.completed();
                    return [2 /*return*/];
            }
        });
    });
}
function openDialogNIRAS(event) {
    Office.context.ui.displayDialogAsync('https://www.niras.com/', {
        height: 40,
        width: 30,
        promptBeforeOpen: false,
    }, function () {
        event.completed();
    });
}
function openDialogOPM(event) {
    Office.context.ui.displayDialogAsync('https://www.opml.co.uk', {
        height: 40,
        width: 30,
        promptBeforeOpen: false,
    }, function () {
        event.completed();
    });
}
function openDialogSATF(event) {
    Office.context.ui.displayDialogAsync('https://www.opml.co.uk/projects/savings-frontier', {
        height: 40,
        width: 30,
        promptBeforeOpen: false,
    }, function () {
        event.completed();
    });
}
function openDialogHELP(event) {
    Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/contact_help/help.html', {
        height: 40,
        width: 30,
        promptBeforeOpen: false,
    });
    event.completed();
}
function openDialogCONTACT(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/contact_help/contact.html', {
                height: 40,
                width: 30,
                promptBeforeOpen: false,
            }, function () {
                event.completed();
            });
            return [2 /*return*/];
        });
    });
}
function openDialogMap(event) {
    return __awaiter(this, void 0, void 0, function () {
        var markers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSelectedCells()];
                case 1:
                    markers = _a.sent();
                    localStorage.setItem('markers', markers);
                    Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/map/map.html', {
                        height: 40,
                        width: 30,
                        promptBeforeOpen: false,
                    }, function (asyncResult) {
                        dialog = asyncResult.value;
                        dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                    });
                    event.completed();
                    return [2 /*return*/];
            }
        });
    });
}
function addMapData(event) {
    return __awaiter(this, void 0, void 0, function () {
        var markers, localEventNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSelectedCells()];
                case 1:
                    markers = _a.sent();
                    localStorage.setItem('markers', markers);
                    localEventNumber = localStorage.getItem('eventNumber');
                    if (localEventNumber === null) {
                        localStorage.setItem('eventNumber', '0');
                    }
                    localStorage.setItem('eventNumber', String(Number(localEventNumber) + 1));
                    event.completed();
                    return [2 /*return*/];
            }
        });
    });
}
// the add-in command functions need to be available in global scope
window.toggleProtection = toggleProtection;
window.openDialogPopup = openDialogPopup;
window.openDialogNIRAS = openDialogNIRAS;
window.openDialogOPM = openDialogOPM;
window.openDialogHELP = openDialogHELP;
window.openDialogSATF = openDialogSATF;
window.openDialogMap = openDialogMap;
window.openDialogCONTACT = openDialogCONTACT;
window.addMapData = addMapData;
