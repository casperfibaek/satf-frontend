import 'react-app-polyfill/ie11'; import 'react-app-polyfill/stable';

import { getGlobal } from './utils';

Office.onReady(() => {
  console.log('Office ready from commands.js');
});

let dialog:any = null;
const g:any = getGlobal();

function onEventFromDialog(arg:any):void {
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

function openDialog(url:string, openEvent:Office.AddinCommands.Event, ask:boolean = true, listen:boolean = false, iFrame = false, callback = (result:any) => { }):void { // eslint-disable-line
  Office.context.ui.displayDialogAsync(url, {
    height: 40, width: 30, promptBeforeOpen: ask, displayInIframe: iFrame,
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

const baseUrl = `${document.location.origin}/interface/`;

function openDialogNIRAS(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}niras.html`, openEvent, false);
}

function openDialogOPM(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}opm.html`, openEvent, false);
}

function openDialogSATF(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}satf.html`, openEvent, false);
}

function openDialogSUPPORT(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=support`, openEvent, false);
  window.carlson.message = () => 'support was opened';
}

function openDialogDOCUMENTATION(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=documentation`, openEvent, false);
}

function openDialogLOGIN(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=taskpane`, openEvent, false);
}

g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogSUPPORT = openDialogSUPPORT;
g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
g.openDialogLOGIN = openDialogLOGIN;
