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
Office.onReady(function () {
    // If needed, Office.js is ready to be called
});
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
var dialog;
function messageHandler(arg) {
    dialog.close();
    console.log(arg.message);
}
function eventHandler(arg) {
    // In addition to general system errors, there are 2 specific errors
    // and one event that you can handle individually.
    switch (arg.error) {
        case 12002:
            console.log('Cannot load URL, no such page or bad URL syntax.');
            break;
        case 12003:
            console.log('HTTPS is required.');
            break;
        case 12006:
            // The dialog was closed, typically because the user the pressed X button.
            console.log('Dialog closed by user');
            break;
        default:
            console.log('Undefined error in dialog window');
            break;
    }
}
function dialogCallback(asyncResult) {
    if (asyncResult.status === 'failed') {
        // In addition to general system errors, there are 3 specific errors for
        // displayDialogAsync that you can handle individually.
        switch (asyncResult.error.code) {
            case 12004:
                console.log('Domain is not trusted');
                break;
            case 12005:
                console.log('HTTPS is required');
                break;
            case 12007:
                console.log('A dialog is already opened.');
                break;
            default:
                console.log(asyncResult.error.message);
                break;
        }
    }
    else {
        dialog = asyncResult.value;
        /* Messages are sent by developers programatically from the dialog using office.context.ui.messageParent(...) */
        dialog.addEventHandler(Office.EventType.DialogMessageReceived, messageHandler);
        /* Events are sent by the platform in response to user actions or errors. For example, the dialog is closed via the 'x' button */
        dialog.addEventHandler(Office.EventType.DialogEventReceived, eventHandler);
    }
}
function openDialogOPM() {
    Office.context.ui.displayDialogAsync('https://www.opml.co.uk', { height: 50, width: 50 }, dialogCallback);
}
function openDialogNIRAS() {
    // IMPORTANT: IFrame mode only works in Online (Web) clients. Desktop clients (Windows, IOS, Mac) always display as a pop-up inside of Office apps.
    Office.context.ui.displayDialogAsync('https://www.niras.com', { height: 50, width: 50, displayInIframe: true }, dialogCallback);
}
function openDialogWindow(link, event, iframe, height, width, prompt) {
    if (iframe === void 0) { iframe = false; }
    if (height === void 0) { height = 40; }
    if (width === void 0) { width = 30; }
    if (prompt === void 0) { prompt = false; }
    Office.context.ui.displayDialogAsync(link, {
        height: height,
        width: width,
        promptBeforeOpen: prompt,
        displayInIframe: iframe,
    }, function (asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            console.log(asyncResult.error.code + ": " + asyncResult.error.message);
            event.completed();
        }
        else {
            g.dialog = asyncResult.value;
            g.dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
        }
    });
}
// async function openDialogNIRAS(event) {
//   Office.context.ui.displayDialogAsync('https://www.niras.com', {
//     height: 40,
//     width: 30,
//     promptBeforeOpen: false,
//   }, () => {
//     event.completed();
//   });
//   // openDialogWindow('https://www.niras.com', event);
// }
// async function openDialogOPM(event) {
//   openDialogWindow('https://www.opml.co.uk', event);
//   event.completed();
// }
function openDialogSATF(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            openDialogWindow('https://www.opml.co.uk/projects/savings-frontier', event);
            return [2 /*return*/];
        });
    });
}
function openDialogSUPPORT(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // openDialogWindow('../support/support.html', event);
            openDialogWindow('https://127.0.0.1/excel_interface/support/support.html', event, true);
            return [2 /*return*/];
        });
    });
}
function openDialogDOCUMENTATION(event) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            openDialogWindow('../documentation/documentation.html', event, true);
            return [2 /*return*/];
        });
    });
}
function openDialogMAP(event) {
    return __awaiter(this, void 0, void 0, function () {
        var markers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getSelectedCells()];
                case 1:
                    markers = _a.sent();
                    localStorage.setItem('markers', markers);
                    openDialogWindow('../map/map.html', event);
                    return [2 /*return*/];
            }
        });
    });
}
// the add-in command functions need to be available in global scope
g.toggleProtection = toggleProtection;
g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogMAP = openDialogMAP;
g.openDialogSUPPORT = openDialogSUPPORT;
g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
console.log('Loaded: commands.js');
//# sourceMappingURL=commands.js.map