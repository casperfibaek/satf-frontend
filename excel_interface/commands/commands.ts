Office.onReady(() => {
  // If needed, Office.js is ready to be called
});

let dialog = null;

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
    dialog.close();
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

async function openDialogNIRAS(event) {
  try {
    await Excel.run(async (context) => {
      /**
           * Insert your Excel code here
           */
      const range = context.workbook.getSelectedRange();

      // Read the range address
      range.load('address');

      // Update the fill color
      range.format.fill.color = 'yellow';

      await context.sync();
      console.log(`The range address was ${range.address}.`);
    });
  } catch (error) {
    console.error(error);
  }

  Office.context.ui.displayDialogAsync('https://www.niras.com/', {
    height: 40,
    width: 30,
    promptBeforeOpen: false,
  }, () => {
    event.completed();
  });
}

function openDialogOPM(event) {
  Office.context.ui.displayDialogAsync('https://www.opml.co.uk', {
    height: 40,
    width: 30,
    promptBeforeOpen: false,
  }, () => {
    event.completed();
  });
}

function openDialogSATF(event) {
  Office.context.ui.displayDialogAsync('https://www.opml.co.uk/projects/savings-frontier', {
    height: 40,
    width: 30,
    promptBeforeOpen: false,
  }, () => {
    event.completed();
  });
}

async function openDialogSUPPORT(event) {
  Office.context.ui.displayDialogAsync('https://satf.azurewebsites.net/excel_interface/support/support.html', {
    height: 40,
    width: 30,
    promptBeforeOpen: false,
  }, () => {
    event.completed();
  });
}

async function openDialogMap(event) {
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
      dialog = asyncResult.value;
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
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

// the add-in command functions need to be available in global scope
g.toggleProtection = toggleProtection;
g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogMap = openDialogMap;
g.openDialogSUPPORT = openDialogSUPPORT;
g.addMapData = addMapData;
