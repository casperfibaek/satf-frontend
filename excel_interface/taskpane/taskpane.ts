Office.initialize = () => {
  const sideloadMsg = document.getElementById('sideload-msg');
  sideloadMsg.style.display = 'none';

  const appBody = document.getElementById('app-body');
  appBody.style.display = 'flex';

  // Determine user's version of Office
  if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
    console.log('Sorry. The add-in uses Excel.js APIs that are not available in your version of Office.');
  }

  const funEl = document.getElementById('run');
  funEl.onclick = function run() { console.log('run!'); };
};