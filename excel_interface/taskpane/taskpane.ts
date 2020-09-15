async function login(username, password) {
  try {
    const response = await fetch('https://satf.azurewebsites.net/api/login_user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const responseJSON = await response.json();

    localStorage.setItem('token', `${responseJSON.username}:${responseJSON.token}`);
  } catch (err) {
    throw Error(err);
  }
}

async function register(username, password, confirm) {
  try {
    const response = await fetch('https://satf.azurewebsites.net/api/create_user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, confirm }),
    });

    const responseJSON = await response.json();

    return responseJSON;
  } catch (err) {
    throw Error(err);
  }
}

async function delete_user(token) {
  try {
    const response = await fetch('https://satf.azurewebsites.net/api/delete_user', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const responseJSON = await response.json();

    return responseJSON;
  } catch (err) {
    throw Error(err);
  }
}

const loginButton = document.getElementById('login_input');
const logoutButton = document.getElementById('logout_input');
const usernameInput = document.getElementById('username');
const usernameInputRegister = document.getElementById('username_register');
const passwordInput = document.getElementById('password');
const passwordInputRegister = document.getElementById('password_register');
const confirmInput = document.getElementById('confirm_register');
const loginForm = document.querySelector('.login');
const welcomeForm = document.querySelector('.welcome');
const welcomeText = document.querySelector('.welcome_text');
const spinner = document.querySelector('.loader');
const errorMessage = document.querySelector('.error_message');
const registerUser = document.getElementById('register_input');
const registerUserSubmit = document.getElementById('register_input_submit');
const registerUserForm = document.querySelector('.register_user');
const backButton = document.getElementById('back_input');
const deleteButton = document.getElementById('delete_input');

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
  } catch (err) {
    errorMessage.innerHTML = 'Invalid credentials. Try again.';
    errorMessage.setAttribute('style', 'display:block');
    spinner.setAttribute('style', 'display:none');
    loginButton.setAttribute('style', 'display:block');
  }
};

logoutButton.onclick = async function test_logout() {
  usernameInput.value = '';
  passwordInput.value = '';
  localStorage.removeItem('token');
  welcomeForm.setAttribute('style', 'display:none');
  errorMessage.setAttribute('style', 'display:none');
  loginForm.setAttribute('style', 'display:block');
  loginButton.setAttribute('style', 'display:block');
  spinner.setAttribute('style', 'display:none');
};

registerUser.onclick = async function test_register() {
  loginForm.setAttribute('style', 'display:none');
  registerUserForm.setAttribute('style', 'display:block');
};

backButton.onclick = async function test_back() {
  loginForm.setAttribute('style', 'display:block');
  registerUserForm.setAttribute('style', 'display:none');
};

registerUserSubmit.onclick = async function test_register_submit() {
  const usernameValue = usernameInputRegister.value;
  const passwordValue = passwordInputRegister.value;
  const confirmValue = confirmInput.value;

  try {
    const registered = await register(usernameValue, passwordValue, confirmValue);
    console.log(registered);
    registerUserForm.setAttribute('style', 'display:none');
    welcomeForm.setAttribute('style', 'display:block');
    welcomeText.innerHTML = usernameValue;
  } catch (err) {
    console.log(err);
  }
};

deleteButton.onclick = async function test_delete_user() {
  const token = localStorage.getItem('token');
  try {
    const deleted = await delete_user(token);
    console.log(deleted);
    welcomeForm.setAttribute('style', 'display:none');
    errorMessage.setAttribute('style', 'display:block');
    loginForm.setAttribute('style', 'display:block');
    loginButton.setAttribute('style', 'display:block');
    spinner.setAttribute('style', 'display:none');
    usernameInput.value = '';
    passwordInput.value = '';
    errorMessage.innerHTML = 'User deleted';
  } catch (err) {
    console.log(err);
  }
};

Office.initialize = () => {
  // Determine user's version of Office
  if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
    console.log('Sorry. The add-in uses Excel.js APIs that are not available in your version of Office.');
  }
};

console.log('Loaded: taskpane.js');
