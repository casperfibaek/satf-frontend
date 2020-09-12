Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

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

async function insertCell(val) {
  await Excel.run(async (context) => {
    const range = context.workbook.getSelectedRange();
    range.values = [[val]];

    await context.sync();
  });
}

function oneDown(adr) {
  const sheet = `${adr.split('!')[0]}!`;
  const x = adr.split('!')[1].split(':')[0];
  const y = adr.split('!')[1].split(':')[1];
  const xn = x.replace(/\d+/g, '') + (Number(x.match(/\d+/)[0]) + 1);
  const yn = y.replace(/\d+/g, '') + (Number(y.match(/\d+/)[0]) + 1);

  return `${sheet + xn}:${yn}`;
}

async function processMessage(arg) {
  if (arg.message === 'newCoords') {
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
  } else {
    insertCell(arg.message);
    document.getElementById('user-name').innerHTML = arg.message;
    g.dialog.close();
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

function openDialogWindow(link, event, height = 40, width = 30, prompt = false) {
  Office.context.ui.displayDialogAsync(link, {
    height,
    width,
    promptBeforeOpen: prompt,
  }, (asyncResult) => {
    if (asyncResult.status === Office.AsyncResultStatus.Failed) {
      console.log(`${asyncResult.error.code}: ${asyncResult.error.message}`);
    }
    event.completed();
  });
}

function openDialogNIRAS(event) {
  openDialogWindow('https://www.niras.com', event);
}
function openDialogOPM(event) {
  openDialogWindow('https://www.opml.co.uk', event);
}
function openDialogSATF(event) {
  openDialogWindow('https://www.opml.co.uk/projects/savings-frontier', event);
}
function openDialogSUPPORT(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/support/support.html', event);
}
function openDialogDOCUMENTATION(event) {
  openDialogWindow('https://satf.azurewebsites.net/excel_interface/documentation/documentation.html', event);
}

async function openDialogMAP(event) {
  const markers = await getSelectedCells();
  localStorage.setItem('markers', markers);

  Office.context.ui.displayDialogAsync(
    'https://satf.azurewebsites.net/excel_interface/map/map.html',
    {
      height: 40,
      width: 30,
      promptBeforeOpen: false,
    },
    (asyncResult) => {
      g.dialog = asyncResult.value;
      g.dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
    },
  );

  event.completed();
}

async function addMapData(event) {
  const markers = await getSelectedCells();
  localStorage.setItem('markers', markers);

  const localEventNumber = localStorage.getItem('eventNumber');
  if (localEventNumber === null) {
    localStorage.setItem('eventNumber', '0');
  }
  localStorage.setItem('eventNumber', String(Number(localEventNumber) + 1));

  event.completed();
}

// the add-in command functions need to be available in global scope
g.toggleProtection = toggleProtection;
g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogMAP = openDialogMAP;
g.openDialogSUPPORT = openDialogSUPPORT;
g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
g.addMapData = addMapData;
