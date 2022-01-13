import 'react-app-polyfill/ie11'; import 'react-app-polyfill/stable';

import { getGlobal, getValueForKey, removeValueForKey, setValueForKey } from './utils';

import { getSelectedCells, addCellsToSheet } from './excel_interaction'
import geojsontoArray from './components/map/geojson_to_array'
import { ThemeSettingName } from '@fluentui/style-utilities';


Office.onReady(async () => {

  console.log('Office ready from commands.js');
  let loginState = ''
  const intervalId = setInterval(async ()=>{
    
    const layerData = getValueForKey('layerData')
    if (layerData) {
      const cells = JSON.parse(layerData)
      await addCellsToSheet(cells);
      removeValueForKey('layerData')
    }
    
    const dataRequest = getValueForKey('data_request')
    if (dataRequest === 'true') {
      const cells = await getSelectedCells()
      console.log(cells)
      setValueForKey('data_to_dialogue', JSON.stringify(cells))
    }
    else if (dataRequest === 'error') {
      /// some kind of intuitive error handling
      console.log('something went wrong')
      setValueForKey('data_request', 'false')
    }

    //// toggled whether or not the login button is disabled
    const userLoggedIn = getValueForKey('satf_token')

     if (userLoggedIn != loginState) {
      loginState = userLoggedIn
      if (userLoggedIn) {
      toggleUserGeom(true)
    }
    else {
      toggleUserGeom(false)
    }
  }


  }, 1000)

  
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

function toggleUserGeom(enabledStatus: boolean): void {
  try {
    Office.ribbon.requestUpdate({
      tabs: [
          {
              id: "SatfTab", 
              groups: [
                  {
                    id: "AuthGroup",
                    controls: [
                      {
                          id: "UserGeomButton", 
                          enabled: enabledStatus,
                      }
                    ]
                  }
              ]
          }
      ]
  })
  }
  catch (err) {
    console.log(err)
  }
}


function openDialog(url:string, openEvent:Office.AddinCommands.Event, ask:boolean = true, listen:boolean = false, iFrame = false, callback = (result:any) => { }):void { // eslint-disable-line
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

function openDialogNIRAS(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}/niras.html`, openEvent, false);
}

function openDialogOPM(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}/opm.html`, openEvent, false);
}

function openDialogSATF(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}/satf.html`, openEvent, false);
}

function openDialogSUPPORT(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=support`, openEvent, false);
}

function openDialogDOCUMENTATION(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=documentation`, openEvent, false);
}

function openDialogLOGIN(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=login`, openEvent, false);
}

function openDialogUserGeoms(openEvent:Office.AddinCommands.Event):void {
  openDialog(`${baseUrl}?page=get_user_geoms`, openEvent, false);
}


g.openDialogUserGeoms = openDialogUserGeoms
g.openDialogNIRAS = openDialogNIRAS;
g.openDialogOPM = openDialogOPM;
g.openDialogSATF = openDialogSATF;
g.openDialogSUPPORT = openDialogSUPPORT;
g.openDialogDOCUMENTATION = openDialogDOCUMENTATION;
g.openDialogLOGIN = openDialogLOGIN;
