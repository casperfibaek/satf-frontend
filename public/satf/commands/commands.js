// The Office.onReady command, even empty, is needed by office-js to work at all(?)

Office.onReady(() => {
  (async function startDB() {
    idbKeyval
      .set('hello', { cat: 'drives' })
      .then(() => console.log('It worked!'))
      .catch((err) => {
        console.log('It failed!', err);
      });
  }());
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


async function openDialogPopup(event) {
  const range = await getSelectedCells();
  localStorage.setItem('range', range);
  localStorage.setItem('clientID', 'casper123');

  Office.context.ui.displayDialogAsync(
    'https://marl.io/satf/popup/popup.html',
    {
      height: 40,
      width: 30,
    },
    (asyncResult) => {
      dialog = asyncResult.value;
      dialog.addEventHandler(Office.EventType.DialogMessageReceived, processMessage);
    },
  );

  event.completed();
}


function openDialogNIRAS(event) {
  Office.context.ui.displayDialogAsync('https://marl.io/satf/info_niras.html', {
    height: 40,
    width: 30,
  }, () => {
    event.completed();
  });
}


function openDialogOPM(event) {
  Office.context.ui.displayDialogAsync('https://marl.io/satf/info_opm.html', {
    height: 40,
    width: 30,
  }, () => {
    event.completed();
  });
}


function openDialogSATF(event) {
  Office.context.ui.displayDialogAsync('https://marl.io/satf/info_satf.html', {
    height: 40,
    width: 30,
  }, () => {
    event.completed();
  });
}


function openDialogHELP(event) {
  Office.context.ui.displayDialogAsync('https://marl.io/satf/help.html', {
    height: 40,
    width: 30,
  });

  event.completed();
}


async function openDialogCONTACT(event) {
  Office.context.ui.displayDialogAsync('https://marl.io/satf/contact.html', {
    height: 40,
    width: 30,
  }, () => {
    event.completed();
  });
}


async function openDialogMap(event) {
  const markers = await getSelectedCells();
  localStorage.setItem('markers', markers);

  Office.context.ui.displayDialogAsync(
    'https://marl.io/satf/map/map.html',
    {
      height: 40,
      width: 30,
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

/* eslint-disable */
function getGlobal() {
  return typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
        ? global
        : undefined;
}
/* eslint-enable */

const g = getGlobal();

// the add-in command functions need to be available in global scope
g.toggleProtection = toggleProtection;
g.openDialogPopup = openDialogPopup;
g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogHELP = openDialogHELP;
g.openDialogSATF = openDialogSATF;
g.openDialogMap = openDialogMap;
g.openDialogCONTACT = openDialogCONTACT;
g.addMapData = addMapData;
