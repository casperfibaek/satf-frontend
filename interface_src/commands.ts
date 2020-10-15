import 'react-app-polyfill/ie11'; import 'react-app-polyfill/stable';

import { getGlobal } from './utils';

Office.onReady(() => {
  console.log('Office ready from commands.js');
});

let dialog:any = null;
const g:any = getGlobal();

// function lettersToNumber(letters:string) {
//   const chrs = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//   const mode = chrs.length - 1;
//   let number = 0;
//   for (let p = 0; p < letters.length; p += 1) {
//     number = number * mode + chrs.indexOf(letters[p]);
//   }
//   return number;
// }

// function numberToCol(num:number) {
//   let str = '';
//   let q;
//   let r;
//   let _num = num;
//   while (_num > 0) {
//     q = (_num - 1) / 26;
//     r = (_num - 1) % 26;
//     _num = Math.floor(q);
//     str = String.fromCharCode(65 + r) + str;
//   }
//   return str;
// }

// function fitTo(adress:string, data:any[]) {
//   const sheet = adress.split('!')[0];
//   const adr = adress.split('!')[1];
//   const row = Number(adr.replace(/^\D+/g, ''));
//   const col = adr.replace(/[^a-zA-Z]/g, '');
//   const colNr = lettersToNumber(col);

//   return `${sheet}!${adr}:${numberToCol(colNr + data[0].length - 1)}${row + data.length - 1}`;
// }

// async function handleDataFromMap(data:any):Promise<boolean> {
//   try {
//     Excel.run(async (context) => {
//       const sheet = context.workbook.worksheets.getActiveWorksheet();
//       const range = context.workbook.getSelectedRange();
//       range.load('address');

//       await context.sync();

//       const newRange = sheet.getRange(fitTo(range.address, data).split('!')[1]);
//       newRange.load('values');

//       await context.sync();

//       const rows = newRange.values.length;
//       const cols = newRange.values[0].length;

//       let empty = true;
//       for (let row = 0; row < rows; row += 1) {
//         if (!empty) { break; }
//         for (let col = 0; col < cols; col += 1) {
//           const val = newRange.values[row][col];
//           if (val !== '') { empty = false; break; }
//         }
//       }

//       if (empty) {
//         newRange.values = data;
//       } else {
//         const message = 'Cells not empty';
//         // window.sharedState.fireEvent('app', 'error', { message });

//         newRange.select();

//         await context.sync();
//         throw new Error(message);
//       }

//       await context.sync();

//       return true;
//     });
//     return true;
//   } catch (err) {
//     console.error(`Error: ${err}`);
//     console.error(`Error stack: ${err.stack}`);
//     if (err instanceof OfficeExtension.Error) {
//       console.error(`Debug info: ${JSON.stringify(err.debugInfo)}`);
//     }
//   }
//   return false;
// }

// async function getSelectedCells():Promise<any[][]> {
//   try {
//     const values = await Excel.run(async (context) => {
//       const range = context.workbook.getSelectedRange();
//       range.load('values');

//       await context.sync();
//       return range.values;
//     });
//     console.log(values);
//     return values;
//   } catch (err) {
//     throw new Error('Invalid selection. No selection?');
//   }
// }

// window.sharedState.addEvent('commands', 'dataFromMap', (cells:any[]) => {
//   handleDataFromMap(cells);
// });

// window.sharedState.addEvent('commands', 'requestData', async () => {
//   const cells = await getSelectedCells();
//   window.sharedState.fireEvent('app', 'dataFromExcel', cells);
// });

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
  window.carlson.message = () => 'support was opened';
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
