Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById('sideload-msg').style.display = 'none';
    document.getElementById('app-body').style.display = 'flex';
  }

  Excel.run((context) => {
    context.workbook.customFunctions.addAll();
    return context.sync().then(() => {
      console.log('Added all custom functions');
    });
  }).catch((error) => {
    console.error(error);
  });

  // Determine if the user's version of Office supports all the Office.js APIs that are used in the tutorial.
  if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
    console.log('Sorry. The tutorial add-in uses Excel.js APIs that are not available in your version of Office.');
  }

  // Assign event handlers and other initialization logic.
  document.getElementById('run').onclick = function run() { console.log('run!'); };
});
