"use strict";
/* eslint-disable max-len */
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
var g = getGlobal();
function oneDown(adr) {
    var sheet = adr.split('!')[0] + "!";
    var x = adr.split('!')[1].split(':')[0];
    var y = adr.split('!')[1].split(':')[1];
    var xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
    var yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);
    return sheet + xn + ":" + yn;
}
function handleCoords(event) {
    return __awaiter(this, void 0, void 0, function () {
        var coords;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    coords = JSON.parse(localStorage.getItem('newCoords'));
                    return [4 /*yield*/, Excel.run(function (context) { return __awaiter(_this, void 0, void 0, function () {
                            var range, sheet;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        range = context.workbook.getSelectedRange();
                                        sheet = context.workbook.worksheets.getActiveWorksheet();
                                        range.values = [[coords.lat, coords.lng]];
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
                    event.completed();
                    return [2 /*return*/];
            }
        });
    });
}
function processMessage(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (event.message === 'newCoords') {
                handleCoords(event);
            }
            else {
                event.completed();
            }
            return [2 /*return*/];
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
var dialog = {};
g.dialog = dialog;
function onMessageFromDialog(arg) {
    console.log(arg);
    dialog.messageChild(JSON.stringify({
        message: 'Parent recieved message you send before.',
    }));
}
function onEventFromDialog(arg) {
    switch (arg.error) {
        case 12002:
            console.log('The dialog box has been directed to a page that it cannot find or load, or the URL syntax is invalid.');
            break;
        case 12003:
            console.log('The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.');
            break;
        case 12006:
            console.log('Dialog closed.');
            dialog.close();
            break;
        default:
            console.log('Unknown error in dialog box.');
            break;
    }
}
function openDialog(url, ask, listen) {
    if (ask === void 0) { ask = true; }
    if (listen === void 0) { listen = false; }
    Office.context.ui.displayDialogAsync(url, { height: 40, width: 30, promptBeforeOpen: ask }, function (asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            console.log('Failed to open window and attach listeners..');
            console.log(asyncResult);
        }
        if (listen) {
            dialog = asyncResult.value;
            dialog.addEventHandler(Office.EventType.DialogMessageReceived, onMessageFromDialog);
            dialog.addEventHandler(Office.EventType.DialogEventReceived, onEventFromDialog);
        }
    });
}
function openDialogMAP() { openDialog('https://satf.azurewebsites.net/excel_interface/map/map.html', true, true); }
function openDialogNIRAS() { openDialog('https://satf.azurewebsites.net/excel_interface/commands/niras.html', false); }
function openDialogOPM() { openDialog('https://satf.azurewebsites.net/excel_interface/commands/opm.html', false); }
function openDialogSATF() { openDialog('https://satf.azurewebsites.net/excel_interface/commands/satf.html', false); }
function openDialogSUPPORT() { openDialog('https://satf.azurewebsites.net/excel_interface/support/support.html', false); }
function openDialogDOCUMENTATION() { openDialog('https://satf.azurewebsites.net/excel_interface/documentation/documentation.html', false); }
Office.onReady().then(function () {
    // the add-in command functions need to be available in global scope
    console.log('Office ready in parent.');
    g.toggleProtection = toggleProtection;
    g.openDialogNIRAS = openDialogNIRAS;
    g.openDialogOPM = openDialogOPM;
    g.openDialogSATF = openDialogSATF;
    g.openDialogMAP = openDialogMAP;
    g.openDialogSUPPORT = openDialogSUPPORT;
    g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
});
console.log('Loaded: commands.js');
//# sourceMappingURL=commands.js.map