/* eslint-disable max-len */

function getGlobal() {
  if (typeof self !== 'undefined') {
    return self;
  } if (typeof window !== 'undefined') {
    return window;
  } if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('Unable to get global namespace.');
}

const g = getGlobal() as any;

function oneDown(adr) {
  const sheet = `${adr.split('!')[0]}!`;
  const x = adr.split('!')[1].split(':')[0];
  const y = adr.split('!')[1].split(':')[1];
  const xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
  const yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);

  return `${sheet + xn}:${yn}`;
}

async function handleCoords(event) {
  const coords = JSON.parse(localStorage.getItem('newCoords'));
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    range.values = [[coords.lat, coords.lng]];
    range.load('address');

    await context.sync().then(async () => {
      const downrange = sheet.getRange(oneDown(range.address));
      downrange.select();

      await context.sync();
    });
  });
  event.completed();
}

async function processMessage(event) {
  if (event.message === 'newCoords') {
    handleCoords(event);
  } else {
    event.completed();
  }
}

async function getSelectedCells() {
  let values = null;
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load('values');

    await context.sync();
    values = range.values;
  });

  return JSON.stringify(values);
}

function toggleProtection(event) {
  Excel.run((context) => {
    const sheet = context.workbook.worksheets.getActiveWorksheet();
    sheet.load('protection/protected');
    return context
      .sync()
      .then(() => {
        if (sheet.protection.protected) {
          sheet.protection.unprotect();
        } else {
          sheet.protection.protect();
        }
      })
      .then(context.sync);
  }).catch((error) => {
    console.log(`Error: ${error}`);
    if (error instanceof OfficeExtension.Error) {
      console.log(`Debug info: ${JSON.stringify(error.debugInfo)}`);
    }
  });
  event.completed();
}

let dialog = {};
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
      console.log('The dialog box has been directed to a URL with the HTTP protocol. HTTPS is required.'); break;
    case 12006:
      console.log('Dialog closed.');
      break;
    default:
      console.log('Unknown error in dialog box.');
      break;
  }
}

function openDialog(url) {
  Office.context.ui.displayDialogAsync(url, { height: 40, width: 30 }, (asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log('Failed to open window and attach listeners..');
      console.log(asyncResult);
    } else {
      dialog = asyncResult.value;
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, onMessageFromDialog);
      dialog.addEventHandler(Office.EventType.DialogEventReceived, onEventFromDialog);
    }
  });
}

function openDialogMAP() { openDialog('https://satf.azurewebsites.net/excel_interface/map/map.html'); }
function openDialogNIRAS() { openDialog('https://satf.azurewebsites.net/excel_interface/commands/niras.html'); }
function openDialogOPM() { openDialog('https://satf.azurewebsites.net/excel_interface/commands/opm.html'); }
function openDialogSATF() { openDialog('https://satf.azurewebsites.net/excel_interface/commands/satf.html'); }
function openDialogSUPPORT() { openDialog('https://satf.azurewebsites.net/excel_interface/support/support.html'); }
function openDialogDOCUMENTATION() { openDialog('https://satf.azurewebsites.net/excel_interface/documentation/documentation.html'); }


Office.onReady().then(() => {
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
