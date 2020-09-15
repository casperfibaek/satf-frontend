"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function login(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseJSON, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://satf.azurewebsites.net/api/login_user', {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: username, password: password }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    responseJSON = _a.sent();
                    localStorage.setItem('token', responseJSON.username + ":" + responseJSON.token);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    throw Error(err_1);
                case 4: return [2 /*return*/];
            }
        });
    });
}
function register(username, password, confirm) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseJSON, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://satf.azurewebsites.net/api/create_user', {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: username, password: password, confirm: confirm }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    responseJSON = _a.sent();
                    return [2 /*return*/, responseJSON];
                case 3:
                    err_2 = _a.sent();
                    throw Error(err_2);
                case 4: return [2 /*return*/];
            }
        });
    });
}
function delete_user(token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, responseJSON, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('https://satf.azurewebsites.net/api/delete_user', {
                            method: 'post',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ token: token }),
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    responseJSON = _a.sent();
                    return [2 /*return*/, responseJSON];
                case 3:
                    err_3 = _a.sent();
                    throw Error(err_3);
                case 4: return [2 /*return*/];
            }
        });
    });
}
var loginButton = document.getElementById('login_input');
var logoutButton = document.getElementById('logout_input');
var usernameInput = document.getElementById('username');
var usernameInputRegister = document.getElementById('username_register');
var passwordInput = document.getElementById('password');
var passwordInputRegister = document.getElementById('password_register');
var confirmInput = document.getElementById('confirm_register');
var loginForm = document.querySelector('.login');
var welcomeForm = document.querySelector('.welcome');
var welcomeText = document.querySelector('.welcome_text');
var spinner = document.querySelector('.loader');
var errorMessage = document.querySelector('.error_message');
var registerUser = document.getElementById('register_input');
var registerUserSubmit = document.getElementById('register_input_submit');
var registerUserForm = document.querySelector('.register_user');
var backButton = document.getElementById('back_input');
var deleteButton = document.getElementById('delete_input');
loginButton.onclick = function test_login() {
    return __awaiter(this, void 0, void 0, function () {
        var usernameValue, passwordValue, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usernameValue = usernameInput.value;
                    passwordValue = passwordInput.value;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    spinner.setAttribute('style', 'display:block');
                    loginButton.setAttribute('style', 'display:none');
                    return [4 /*yield*/, login(usernameValue, passwordValue)];
                case 2:
                    _a.sent();
                    loginForm.setAttribute('style', 'display:none');
                    welcomeForm.setAttribute('style', 'display:block');
                    welcomeText.innerHTML = usernameValue;
                    return [3 /*break*/, 4];
                case 3:
                    err_4 = _a.sent();
                    errorMessage.innerHTML = 'Invalid credentials. Try again.';
                    errorMessage.setAttribute('style', 'display:block');
                    spinner.setAttribute('style', 'display:none');
                    loginButton.setAttribute('style', 'display:block');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
logoutButton.onclick = function test_logout() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            usernameInput.value = '';
            passwordInput.value = '';
            localStorage.removeItem('token');
            welcomeForm.setAttribute('style', 'display:none');
            errorMessage.setAttribute('style', 'display:none');
            loginForm.setAttribute('style', 'display:block');
            loginButton.setAttribute('style', 'display:block');
            spinner.setAttribute('style', 'display:none');
            return [2 /*return*/];
        });
    });
};
registerUser.onclick = function test_register() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loginForm.setAttribute('style', 'display:none');
            registerUserForm.setAttribute('style', 'display:block');
            return [2 /*return*/];
        });
    });
};
backButton.onclick = function test_back() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            loginForm.setAttribute('style', 'display:block');
            registerUserForm.setAttribute('style', 'display:none');
            return [2 /*return*/];
        });
    });
};
registerUserSubmit.onclick = function test_register_submit() {
    return __awaiter(this, void 0, void 0, function () {
        var usernameValue, passwordValue, confirmValue, registered, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    usernameValue = usernameInputRegister.value;
                    passwordValue = passwordInputRegister.value;
                    confirmValue = confirmInput.value;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, register(usernameValue, passwordValue, confirmValue)];
                case 2:
                    registered = _a.sent();
                    console.log(registered);
                    registerUserForm.setAttribute('style', 'display:none');
                    welcomeForm.setAttribute('style', 'display:block');
                    welcomeText.innerHTML = usernameValue;
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    console.log(err_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
deleteButton.onclick = function test_delete_user() {
    return __awaiter(this, void 0, void 0, function () {
        var token, deleted, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, delete_user(token)];
                case 2:
                    deleted = _a.sent();
                    console.log(deleted);
                    welcomeForm.setAttribute('style', 'display:none');
                    errorMessage.setAttribute('style', 'display:block');
                    loginForm.setAttribute('style', 'display:block');
                    loginButton.setAttribute('style', 'display:block');
                    spinner.setAttribute('style', 'display:none');
                    usernameInput.value = '';
                    passwordInput.value = '';
                    errorMessage.innerHTML = 'User deleted';
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    console.log(err_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
Office.initialize = function () {
    // Determine user's version of Office
    if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
        console.log('Sorry. The add-in uses Excel.js APIs that are not available in your version of Office.');
    }
};
console.log('Loaded: taskpane.js');
//# sourceMappingURL=taskpane.js.map