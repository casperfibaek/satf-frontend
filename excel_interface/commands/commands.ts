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

let dialog;

function messageHandler(arg) {
  const messageFromDialog = JSON.parse(arg.message);
  console.log(arg.message);

  dialog.messageChild(JSON.stringify({
    message: 'Send from parent.',
  }));

  if (messageFromDialog.messageType === 'dialogClosed') {
    dialog.close();
  }
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

function dialogCallback(asyncResult, event) {
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
  } else {
    dialog = asyncResult.value;

    /* Messages are sent by developers programatically from the dialog using office.context.ui.messageParent(...) */
    dialog.addEventHandler(Office.EventType.DialogMessageReceived, messageHandler);

    /* Events are sent by the platform in response to user actions or errors. For example, the dialog is closed via the 'x' button */
    dialog.addEventHandler(Office.EventType.DialogEventReceived, eventHandler);
  }

  event.completed();
}

function openDialogWindow(link, event, iframe = false, height = 40, width = 30, prompt = false) {
  Office.context.ui.displayDialogAsync(link, {
    height,
    width,
    promptBeforeOpen: prompt,
    displayInIframe: iframe,
  }, (asyncResult) => {
    dialogCallback(asyncResult, event);
  });
}

function openDialogNIRAS(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/commands/niras.html', event);
}
function openDialogOPM(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/commands/opm.html', event);
}
async function openDialogSATF(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/commands/satf.html', event);
}
async function openDialogSUPPORT(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/support/support.html', event);
}
async function openDialogDOCUMENTATION(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/documentation/documentation.html', event);
}

async function openDialogMAP(event) {
  const markers = await getSelectedCells();
  localStorage.setItem('markers', markers);

  openDialogWindow('https://satf.azurewebsites.net/excel_interface/map/map.html', event);
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
