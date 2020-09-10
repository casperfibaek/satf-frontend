Office.initialize = () => {
    const sideloadMsg = document.getElementById('sideload-msg') as HTMLElement;
    sideloadMsg.style.display = 'none';

    const appBody = document.getElementById('app-body') as HTMLElement;
    appBody.style.display = 'flex';

    // Determine if the user's version of Office supports all the Office.js APIs that are used in the tutorial.
    if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
        console.log('Sorry. The add-in uses Excel.js APIs that are not available in your version of Office.');
    }

    const funEl = document.getElementById('run') as HTMLElement;
    funEl.onclick = function run() { console.log('run!'); };
};
