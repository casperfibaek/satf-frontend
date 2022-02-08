var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { getGlobal, getValueForKey, removeValueForKey, setValueForKey } from './utils';
import { getSelectedCells, addCellsToSheet } from './excel_interaction';
Office.onReady(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Office ready from commands.js');
    let loginState = '';
    const intervalId = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const layerData = getValueForKey('layerData');
        if (layerData) {
            const cells = JSON.parse(layerData);
            yield addCellsToSheet(cells);
            removeValueForKey('layerData');
        }
        const dataRequest = getValueForKey('data_request');
        if (dataRequest === 'true') {
            const cells = yield getSelectedCells();
            console.log(cells);
            setValueForKey('data_to_dialogue', JSON.stringify(cells));
        }
        else if (dataRequest === 'error') {
            /// some kind of intuitive error handling
            console.log('something went wrong');
            setValueForKey('data_request', 'false');
        }
        //// toggled whether or not the login button is disabled
        const userLoggedIn = getValueForKey('satf_token');
        if (userLoggedIn != loginState) {
            loginState = userLoggedIn;
            if (userLoggedIn) {
                toggleUserGeom(true);
            }
            else {
                toggleUserGeom(false);
            }
        }
    }), 1000);
}));
let dialog = null;
const g = getGlobal();
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
            break;
        default:
            console.log('Unknown error in dialog box.');
            break;
    }
}
function toggleUserGeom(enabledStatus) {
    try {
        Office.ribbon.requestUpdate({
            tabs: [
                {
                    id: "SatfTab",
                    groups: [
                        {
                            id: "AuthGroup",
                            controls: [
                                {
                                    id: "UserGeomButton",
                                    enabled: enabledStatus,
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
    catch (err) {
        console.log(err);
    }
}
function openDialog(url, openEvent, ask = true, listen = false, iFrame = false, callback = (result) => { }) {
    Office.context.ui.displayDialogAsync(url, {
        height: 50, width: 30, promptBeforeOpen: ask, displayInIframe: iFrame,
    }, (asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            console.log('Failed to open window and attach listeners..');
            console.log(asyncResult);
        }
        if (listen) {
            dialog = asyncResult.value;
            dialog.addEventHandler(Office.EventType.DialogEventReceived, onEventFromDialog);
        }
        openEvent.completed();
        callback(asyncResult);
    });
}
const baseUrl = `${document.location.origin}`;
function openDialogNIRAS(openEvent) {
    openDialog(`${baseUrl}/niras.html`, openEvent, false);
}
function openDialogOPM(openEvent) {
    openDialog(`${baseUrl}/opm.html`, openEvent, false);
}
function openDialogSATF(openEvent) {
    openDialog(`${baseUrl}/satf.html`, openEvent, false);
}
function openDialogSUPPORT(openEvent) {
    openDialog(`${baseUrl}?page=support`, openEvent, false);
}
function openDialogDOCUMENTATION(openEvent) {
    openDialog(`${baseUrl}?page=documentation`, openEvent, false);
}
function openDialogLOGIN(openEvent) {
    openDialog(`${baseUrl}?page=login`, openEvent, false);
}
function openDialogUserGeoms(openEvent) {
    openDialog(`${baseUrl}?page=get_user_geoms`, openEvent, false);
}
g.openDialogUserGeoms = openDialogUserGeoms;
g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogSUPPORT = openDialogSUPPORT;
g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
g.openDialogLOGIN = openDialogLOGIN;
//# sourceMappingURL=commands.js.map