/* eslint-disable max-len */

let dialog = null;

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

function sendToDialog(event, data) {
  dialog.sendMessage(JSON.stringify({ event, data }));
}

function oneDown(adr) {
  const sheet = `${adr.split('!')[0]}!`;
  const x = adr.split('!')[1].split(':')[0];
  const y = adr.split('!')[1].split(':')[1];
  const xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
  const yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);

  return `${sheet + xn}:${yn}`;
}

async function handleCoords(coords) {
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
}

async function getSelectedCells() {
  let values = null;
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.load('values');

    await context.sync();
    values = range.values;
  });

  return values;
}

async function eventDispatcher(event, data) {
  console.log(event);
  console.log(data);
  if (event === 'ready') {
    console.log('Map is ready for input');
  } else if (event === 'requestData') {
    const cells = await getSelectedCells();
    sendToDialog('selectedCells', cells);
  } else if (event === 'createdMarker') {
    handleCoords(data);
  } else {
    console.log('Did not understand event');
  }
}

function onMessageFromDialog(arg) {
  try {
    const messageFromDialog = JSON.parse(arg.message);
    const { event, data } = messageFromDialog;
    eventDispatcher(event, data);
  } catch (err) {
    console.log(err);
  }
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
      dialog.close();
      break;
    default:
      console.log('Unknown error in dialog box.');
      break;
  }
}

function openDialog(url, ask = true, listen = false) {
  Office.context.ui.displayDialogAsync(url, { height: 40, width: 30, promptBeforeOpen: ask }, (asyncResult) => {
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

Office.onReady().then(() => {
  // the add-in command functions need to be available in global scope
  g.openDialogNIRAS = openDialogNIRAS;
  g.openDialogOPM = openDialogOPM;
  g.openDialogSATF = openDialogSATF;
  g.openDialogMAP = openDialogMAP;
  g.openDialogSUPPORT = openDialogSUPPORT;
  g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
});

console.log('Loaded: commands.js');
