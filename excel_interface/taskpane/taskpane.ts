async function login(username, password) {
  try {
    const response = await fetch('https://satf.azurewebsites.net/api/login_user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log(response);
    const reponseJSON = await response.json();

    localStorage.setItem('token', `${reponseJSON.username}:${reponseJSON.token}`);
  } catch (err) {
    throw Error(err);
  }
}

const loginButton = document.getElementById('login_input');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginForm = document.querySelector('.login');
const welcomeForm = document.querySelector('.welcome');
const welcomeText = document.querySelector('.welcome_text');
const spinner = document.querySelector('.loader');
const errorMessage = document.querySelector('.error_message');

loginButton.onclick = async function test_login() {
  const usernameValue = usernameInput.value;
  const passwordValue = passwordInput.value;
  try {
    spinner.setAttribute('style', 'display:block');
    loginButton.setAttribute('style', 'display:none');
    await login(usernameValue, passwordValue);
    loginForm.setAttribute('style', 'display:none');
    welcomeForm.setAttribute('style', 'display:block');
    welcomeText.innerHTML = usernameValue;
    console.log('Success');
  } catch (err) {
    errorMessage.innerHTML = 'Invalid credentials. Try again.';
    errorMessage.setAttribute('style', 'display:block');
    spinner.setAttribute('style', 'display:none');
    loginButton.setAttribute('style', 'display:block');
  }
};

Office.initialize = () => {
  // Determine user's version of Office
  if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
    console.log('Sorry. The add-in uses Excel.js APIs that are not available in your version of Office.');
  }
};

console.log('Loaded: taskpane.js');
