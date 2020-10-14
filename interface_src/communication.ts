const events:any = {
};

async function eventDispatcher(event:string, data:any):Promise<void> {
  try {
    if (events[event]) { events[event](data); } else { console.log('did not understand event'); }
  } catch (err) {
    console.log(err);
  }
}

export function onMessageFromParent(arg:any):void {
  try {
    const messageFromParent = JSON.parse(arg.message);
    const { event, data } = messageFromParent;
    eventDispatcher(event, data);
  } catch (err) {
    console.log(err);
  }
}

export function addEvent(name:string, func:Function):void {
  events[name] = func;
}

export function removeEvent(name:string):void {
  delete events[name];
}

export function sendToParent(event:any, data:any = null):void {
  Office.context.ui.messageParent(JSON.stringify({ event, data }));
}

export default {
  addEvent,
  removeEvent,
  sendToParent,
};
