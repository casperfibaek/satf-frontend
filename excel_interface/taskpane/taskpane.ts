async function login(username, password) {
  try {
    const postObject = JSON.stringify({ username, password });
    console.log(postObject);

    const response = await fetch('https://satf.azurewebsites.net/api/login_user', {
      method: 'post',
      body: postObject,
    });
    console.log(response);

    const reponseJSON = await response.json();
    console.log(reponseJSON);

    localStorage.setItem('token', `${reponseJSON.username}:${reponseJSON.token}`);
  } catch (err) {
    throw Error(err);
  }
}

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
  funEl.onclick = async function run() {
    try {
      await login('Elaine', 'bobhund2');
      console.log('Successfully logged in!');
    } catch (err) {
      console.log(err);
    }
  };
};

console.log('Loaded: taskpane.js');
