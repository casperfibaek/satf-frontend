import { getGlobal, createStateIfDoesntExists, logToServer } from './utils';
import { onMessageFromParent } from './communication';
import { WindowState } from './types';

declare let window: WindowState;

if (!window.sharedState.initialised.commands) {
  window.sharedState.initialised.commands = true;
  logToServer({ message: 'sharedState', state: window.sharedState.initialised });
// window.sharedState.hello = function hello_world() {
//   logToServer({ message: 'sharedState', state: 'hello defined in commands' });
// };
}

createStateIfDoesntExists();
if (!window.state.initialise.office) {
  Office.onReady(() => {
    try {
      console.log('Office ready from commands.js');
      window.state.initialise = ({ ...window.state.initialise, ...{ office: true } });
      Office.context.ui.addHandlerAsync(Office.EventType.DialogParentMessageReceived, onMessageFromParent);
    } catch (error) {
      const message = 'Unable to initialise OfficeJS, is this running inside office?';
      console.log(message);
      logToServer({ message, error });
      console.log(error);
    }
  });
}

let dialog:any = null;
const g:any = getGlobal();

function sendToDialog(event:string, data:any) {
  dialog.messageChild(JSON.stringify({ event, data }));
}

function oneDown(adr:string):string {
  const sheet = `${adr.split('!')[0]}!`;
  const x = adr.split('!')[1].split(':')[0];
  const y = adr.split('!')[1].split(':')[1];
  const xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
  const yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);

  return `${sheet + xn}:${yn}`;
}

function lettersToNumber(letters:string) {
  const chrs = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const mode = chrs.length - 1;
  let number = 0;
  for (let p = 0; p < letters.length; p += 1) {
    number = number * mode + chrs.indexOf(letters[p]);
  }
  return number;
}

function numberToCol(num:number) {
  let str = '';
  let q;
  let r;
  let _num = num;
  while (_num > 0) {
    q = (_num - 1) / 26;
    r = (_num - 1) % 26;
    _num = Math.floor(q);
    str = String.fromCharCode(65 + r) + str;
  }
  return str;
}

function fitTo(adress:string, data:any[]) {
  const sheet = adress.split('!')[0];
  const adr = adress.split('!')[1];
  const row = Number(adr.replace(/^\D+/g, ''));
  const col = adr.replace(/[^a-zA-Z]/g, '');
  const colNr = lettersToNumber(col);

  return `${sheet}!${adr}:${numberToCol(colNr + data[0].length - 1)}${row + data.length - 1}`;
}

async function handleCoords(coords:any):Promise<boolean> {
  try {
    await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      range.values = [[coords.lat, coords.lng]];
      range.load('address');

      await context.sync().then(async () => {
        const downrange = sheet.getRange(oneDown(range.address));
        downrange.select();

        await context.sync();

        return true;
      });
    });
  } catch (err) {
    return false;
  }
  return false;
}

async function handleDataFromMap(data:any):Promise<boolean> {
  try {
    Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const range = context.workbook.getSelectedRange();
      range.load('address');

      await context.sync();

      const newRange = sheet.getRange(fitTo(range.address, data).split('!')[1]);
      newRange.load('values');

      await context.sync();

      const rows = newRange.values.length;
      const cols = newRange.values[0].length;

      let empty = true;
      for (let row = 0; row < rows; row += 1) {
        if (!empty) { break; }
        for (let col = 0; col < cols; col += 1) {
          const val = newRange.values[row][col];
          if (val !== '') { empty = false; break; }
        }
      }

      if (empty) {
        newRange.values = data;
      } else {
        const message = 'Cells not empty';
        sendToDialog('error', message);

        newRange.select();

        await context.sync();
        throw new Error(message);
      }

      await context.sync();

      return true;
    });
    return true;
  } catch (err) {
    console.error(`Error: ${err}`);
    console.error(`Error stack: ${err.stack}`);
    if (err instanceof OfficeExtension.Error) {
      console.error(`Debug info: ${JSON.stringify(err.debugInfo)}`);
    }
  }
  return false;
}

async function getSelectedCells():Promise<any[][]> {
  try {
    const values = await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.load('values');

      await context.sync();
      return range.values;
    });
    console.log(values);
    return values;
  } catch (err) {
    throw new Error('Invalid selection. No selection?');
  }
}

async function eventDispatcher(event:string, data:any):Promise<void> {
  console.log([event, data]);
  if (event === 'ready') {
    console.log('Map is ready for input');
  } else if (event === 'requestData') {
    const cells = await getSelectedCells();
    sendToDialog('dataFromExcel', cells);
  } else if (event === 'createdMarker') {
    handleCoords(data);
  } else if (event === 'dataFromMap') {
    handleDataFromMap(data);
  } else if (event === 'clearedData') {
    console.log('Map data was cleared.');
  } else {
    console.log('Did not understand event');
  }
}

function onMessageFromDialog(arg:any):void {
  try {
    const messageFromDialog = JSON.parse(arg.message);
    const { event, data } = messageFromDialog;
    eventDispatcher(event, data);
  } catch (err) {
    console.log(err);
  }
}

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
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, onMessageFromDialog);
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

function openDialogMAP(openEvent:Office.AddinCommands.Event):void {
  // The map is relying on interaction between the sheet and the map:
  //   If we are not allowed, for security reasons, to open a popup, we
  //   open an iframe instead.
  openDialog(`${baseUrl}?page=map`, openEvent, true, true, false, (asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      openDialog(`${baseUrl}?page=map`, openEvent, true, true, true);
    }
  });
}

function openDialogSUPPORT(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=support`, openEvent, false);
}

function openDialogDOCUMENTATION(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=documentation`, openEvent, false);
}

g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogMAP = openDialogMAP;
g.openDialogSUPPORT = openDialogSUPPORT;
g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
