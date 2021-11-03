import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { getGlobal } from './utils';
Office.onReady(() => {
    console.log('Office ready from commands.js');
});
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