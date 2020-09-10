(function () {
    'use strict';

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

    function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

    /*
     * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
     * See LICENSE in the project root for license information.
     */
    Office.initialize = function init() {
      if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
        console.log('Sorry, this add-in only works with newer versions of Excel.');
      }
    };

    var dialog = null;

    function insertCell(_x) {
      return _insertCell.apply(this, arguments);
    }

    function _insertCell() {
      _insertCell = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(val) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Excel.run( /*#__PURE__*/function () {
                  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(context) {
                    var range;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            range = context.workbook.getSelectedRange();
                            range.values = [[val]];
                            _context.next = 4;
                            return context.sync();

                          case 4:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x8) {
                    return _ref.apply(this, arguments);
                  };
                }());

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
      return _insertCell.apply(this, arguments);
    }

    function oneDown(adr) {
      var sheet = "".concat(adr.split('!')[0], "!");
      var x = adr.split('!')[1].split(':')[0];
      var y = adr.split('!')[1].split(':')[1];
      var xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
      var yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);
      return "".concat(sheet + xn, ":").concat(yn);
    }

    function processMessage(_x2) {
      return _processMessage.apply(this, arguments);
    }

    function _processMessage() {
      _processMessage = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(arg) {
        var coords;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(arg.message === 'newCoords')) {
                  _context5.next = 6;
                  break;
                }

                coords = JSON.parse(localStorage.getItem('newCoords'));
                _context5.next = 4;
                return Excel.run( /*#__PURE__*/function () {
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(context) {
                    var range, sheet;
                    return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            range = context.workbook.getSelectedRange();
                            sheet = context.workbook.worksheets.getActiveWorksheet();
                            range.values = [[coords.lat, coords.lng]];
                            range.load('address');
                            _context4.next = 6;
                            return context.sync().then( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                              var downrange;
                              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                  switch (_context3.prev = _context3.next) {
                                    case 0:
                                      downrange = sheet.getRange(oneDown(range.address));
                                      downrange.select();
                                      _context3.next = 4;
                                      return context.sync();

                                    case 4:
                                    case "end":
                                      return _context3.stop();
                                  }
                                }
                              }, _callee3);
                            })));

                          case 6:
                          case "end":
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function (_x9) {
                    return _ref2.apply(this, arguments);
                  };
                }());

              case 4:
                _context5.next = 9;
                break;

              case 6:
                insertCell(arg.message);
                document.getElementById('user-name').innerHTML = arg.message;
                dialog.close();

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));
      return _processMessage.apply(this, arguments);
    }

    function getSelectedCells() {
      return _getSelectedCells.apply(this, arguments);
    }

    function _getSelectedCells() {
      _getSelectedCells = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
        var values;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                values = null;
                _context7.next = 3;
                return Excel.run( /*#__PURE__*/function () {
                  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(context) {
                    var range;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                        switch (_context6.prev = _context6.next) {
                          case 0:
                            range = context.workbook.getSelectedRange();
                            range.load('values');
                            _context6.next = 4;
                            return context.sync();

                          case 4:
                            values = range.values;

                          case 5:
                          case "end":
                            return _context6.stop();
                        }
                      }
                    }, _callee6);
                  }));

                  return function (_x10) {
                    return _ref4.apply(this, arguments);
                  };
                }());

              case 3:
                return _context7.abrupt("return", JSON.stringify(values));

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));
      return _getSelectedCells.apply(this, arguments);
    }

    function toggleProtection(event) {
      Excel.run(function (context) {
        var sheet = context.workbook.worksheets.getActiveWorksheet();
        sheet.load('protection/protected');
        return context.sync().then(function () {
          if (sheet.protection.protected) {
            sheet.protection.unprotect();
          } else {
            sheet.protection.protect();
          }
        }).then(context.sync);
      }).catch(function (error) {
        console.log("Error: ".concat(error));

        if (error instanceof OfficeExtension.Error) {
          console.log("Debug info: ".concat(JSON.stringify(error.debugInfo)));
        }
      });
      event.completed();
    }

    function openDialogPopup(_x3) {
      return _openDialogPopup.apply(this, arguments);
    }

    function _openDialogPopup() {
      _openDialogPopup = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(event) {
        var range;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return getSelectedCells();

              case 2:
                range = _context8.sent;
                localStorage.setItem('range', range);
                localStorage.setItem('clientID', 'casper123');
                Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/popup/popup.html', {
                  height: 40,
                  width: 30
                }, function (asyncResult) {
                  dialog = asyncResult.value;
                  dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                });
                event.completed();

              case 7:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));
      return _openDialogPopup.apply(this, arguments);
    }

    function openDialogNIRAS(_x4) {
      return _openDialogNIRAS.apply(this, arguments);
    }

    function _openDialogNIRAS() {
      _openDialogNIRAS = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(event) {
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                _context10.next = 3;
                return Excel.run( /*#__PURE__*/function () {
                  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(context) {
                    var range;
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            /**
                            * Insert your Excel code here
                            */
                            range = context.workbook.getSelectedRange(); // Read the range address

                            range.load('address'); // Update the fill color

                            range.format.fill.color = 'yellow';
                            _context9.next = 5;
                            return context.sync();

                          case 5:
                            console.log("The range address was ".concat(range.address, "."));

                          case 6:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x11) {
                    return _ref5.apply(this, arguments);
                  };
                }());

              case 3:
                _context10.next = 8;
                break;

              case 5:
                _context10.prev = 5;
                _context10.t0 = _context10["catch"](0);
                console.error(_context10.t0);

              case 8:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, null, [[0, 5]]);
      }));
      return _openDialogNIRAS.apply(this, arguments);
    }

    function openDialogOPM(event) {
      Office.context.ui.displayDialogAsync('https://www.opml.co.uk', {
        height: 40,
        width: 30,
        promptBeforeOpen: false
      }, function () {
        event.completed();
      });
    }

    function openDialogSATF(event) {
      Office.context.ui.displayDialogAsync('https://www.opml.co.uk/projects/savings-frontier', {
        height: 40,
        width: 30,
        promptBeforeOpen: false
      }, function () {
        event.completed();
      });
    }

    function openDialogHELP(event) {
      Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/contact_help/help.html', {
        height: 40,
        width: 30,
        promptBeforeOpen: false
      });
      event.completed();
    }

    function openDialogCONTACT(_x5) {
      return _openDialogCONTACT.apply(this, arguments);
    }

    function _openDialogCONTACT() {
      _openDialogCONTACT = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(event) {
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/contact_help/contact.html', {
                  height: 40,
                  width: 30,
                  promptBeforeOpen: false
                }, function () {
                  event.completed();
                });

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));
      return _openDialogCONTACT.apply(this, arguments);
    }

    function openDialogMap(_x6) {
      return _openDialogMap.apply(this, arguments);
    }

    function _openDialogMap() {
      _openDialogMap = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(event) {
        var markers;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return getSelectedCells();

              case 2:
                markers = _context12.sent;
                localStorage.setItem('markers', markers);
                Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/map/map.html', {
                  height: 40,
                  width: 30,
                  promptBeforeOpen: false
                }, function (asyncResult) {
                  dialog = asyncResult.value;
                  dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
                });
                event.completed();

              case 6:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));
      return _openDialogMap.apply(this, arguments);
    }

    function addMapData(_x7) {
      return _addMapData.apply(this, arguments);
    } // the add-in command functions need to be available in global scope


    function _addMapData() {
      _addMapData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(event) {
        var markers, localEventNumber;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return getSelectedCells();

              case 2:
                markers = _context13.sent;
                localStorage.setItem('markers', markers);
                localEventNumber = localStorage.getItem('eventNumber');

                if (localEventNumber === null) {
                  localStorage.setItem('eventNumber', '0');
                }

                localStorage.setItem('eventNumber', String(Number(localEventNumber) + 1));
                event.completed();

              case 8:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));
      return _addMapData.apply(this, arguments);
    }

    window.toggleProtection = toggleProtection;
    window.openDialogPopup = openDialogPopup;
    window.openDialogNIRAS = openDialogNIRAS;
    window.openDialogOPM = openDialogOPM;
    window.openDialogHELP = openDialogHELP;
    window.openDialogSATF = openDialogSATF;
    window.openDialogMap = openDialogMap;
    window.openDialogCONTACT = openDialogCONTACT;
    window.addMapData = addMapData;

}());
