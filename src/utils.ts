import { WindowState } from './types';

declare let window: WindowState;

export function getGlobal() {
  if (typeof self !== 'undefined') { return self; } // eslint-disable-line
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }

  throw new Error('Unable to get global namespace.');
}

export function setValueForKey(key:string, value:string):void {
  const g = getGlobal() as any;
  g.window.localStorage.setItem(key, value);
}

export function getValueForKey(key: string):string {
  const g = getGlobal() as any;
  return g.window.localStorage.getItem(key);
}

export function removeValueForKey(key: string):void {
  const g = getGlobal() as any;
  g.window.localStorage.removeItem(key);
}

export function logToServer(error:any) {
  fetch('https://localhost:3000/api/error_log', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(error),
  });
}

export const isNumber = (value:any):boolean => !Number.isNaN(Number(value));

export async function what3wordsToLatLng(what3words:string): Promise<[number, number]> {
  try {
    const url = `../api/what3words_to_latlng?words=${what3words}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw new Error('401: Unauthorised user'); }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new Error(responseJSON.message);
  } catch (err) {
    throw new Error(String(err));
  }
}

export async function pluscodeToLatLng(pluscode:string): Promise<[number, number]> {
  try {
    const url = `../api/pluscode_to_latlng?code=${pluscode}`;
    const token = getValueForKey('satf_token');

    const apiResponse = await fetch(url, { headers: { Authorization: token } });

    if (apiResponse.status === 401) { throw new Error('401: Unauthorised user'); }

    const responseJSON = await apiResponse.json();
    if (apiResponse.ok) { return responseJSON.message; }

    throw new Error(responseJSON.message);
  } catch (err) {
    throw new Error(String(err));
  }
}

export function isValidWhatFreeWords(str:any):Boolean {
  if (typeof str !== 'string') { return false; }
  if (str.split('.').length !== 3) { return false; }
  if (/^[a-zA-Z.]+$/.test(str) === false) { return false; }

  return true;
}

export function isValidPluscode(code:any):Boolean {
  const seperator = '+';
  const seperatorPosition = 8;
  const paddingCharacter = '0';
  const codeAlphabet = '23456789CFGHJMPQRVWX';

  if (!code || typeof code !== 'string') { return false; }
  if (code.indexOf(seperator) === -1) { return false; }
  if (code.indexOf(seperator) !== code.lastIndexOf(seperator)) { return false; }

  if (code.length === 1) { return false; }
  if (code.indexOf(seperator) > seperatorPosition || code.indexOf(seperator) % 2 === 1) { return false; }
  if (code.indexOf(paddingCharacter) > -1) {
    if (code.indexOf(paddingCharacter) === 0) { return false; }

    const padMatch = code.match(new RegExp(`(${paddingCharacter}+)`, 'g'));
    if (padMatch.length > 1 || padMatch[0].length % 2 === 1 || padMatch[0].length > seperatorPosition - 2) { return false; }
    if (code.charAt(code.length - 1) !== seperator) { return false; }
  }

  if (code.length - code.indexOf(seperator) - 1 === 1) { return false; }

  const nosepCode = code.replace(new RegExp(`\\${seperator}+`), '').replace(new RegExp(`${paddingCharacter}+`), '');

  for (let i = 0, len = nosepCode.length; i < len; i += 1) {
    const character = nosepCode.charAt(i).toUpperCase();
    if (character !== seperator && codeAlphabet.indexOf(character) === -1) { return false; }
  }
  return true;
}

export function isValidGhanaPostalGPS(str:String):Boolean {
  if (typeof str !== 'string') { return false; }
  const arr = str.split('-');

  if (arr.length !== 3) { return false; }
  if (arr[0].length !== 2) { return false; }
  if (arr[1].length < 3 || arr[1].length > 5) { return false; }
  if (arr[2].length < 3 || arr[2].length > 5) { return false; }
  if (/^\d+$/.test(arr[0]) === true) { return false; }
  if (/^[a-zA-Z]+$/.test(arr[0]) === false) { return false; }
  if (/^\d+$/.test(arr[1]) === false) { return false; }
  if (/^\d+$/.test(arr[2]) === false) { return false; }

  return true;
}

export function isValidLatitude(lat:any):Boolean {
  try {
    if (isNumber(lat)) {
      const number = Number(lat);
      if (number < -90 || number > 90) { return false; }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isValidLongitude(lng:any):Boolean {
  try {
    if (isNumber(lng)) {
      const number = Number(lng);
      if (number < -180 || number > 180) { return false; }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isValidArray(arr:any) {
  // Is it an array?
  if (!Array.isArray(arr)) { return false; }

  // Is it empty?
  if (arr.length === 0) { return false; }

  // Is it 2d?
  if (!Array.isArray(arr[0])) { return false; }

  // Does it have rows?
  if (arr[0].length === 0) { return false; }

  return true;
}

export function createCoordinateArray(arr:any): number[] | false {
  if (!Array.isArray(arr)) { return false; }
  if (arr.length === 0 || arr.length > 2) { return false; }
  if (arr.length === 1) {
    if (arr[0].length !== 2) { return false; }
    if (!isValidLatitude(arr[0][0])) { return false; }
    if (!isValidLongitude(arr[0][1])) { return false; }
    return [Number(arr[0][0]), Number(arr[0][1])];
  } if (arr.length === 2) {
    if (Array.isArray(arr[0]) && Array.isArray(arr[1])) {
      if (!isValidLatitude(arr[0][0])) { return false; }
      if (!isValidLongitude(arr[1][0])) { return false; }
      return [Number(arr[0][0]), Number(arr[1][0])];
    }
    if (!isValidLatitude(arr[0])) { return false; }
    if (!isValidLongitude(arr[1])) { return false; }
    return [Number(arr[0]), Number(arr[1])];
  }
  return false;
}

export const excelTheme = {
  palette: {
    themePrimary: '#217346',
    themeLighterAlt: '#f2f9f5',
    themeLighter: '#cee9da',
    themeLight: '#a8d5bc',
    themeTertiary: '#62ab83',
    themeSecondary: '#318456',
    themeDarkAlt: '#1e673f',
    themeDark: '#195735',
    themeDarker: '#134027',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
  },
};

export const errInvalidValue = (msg:string) => new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, String(msg));
export const errNotAvailable = (msg:string) => new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, String(msg));

export function getApiUrl() {
  // const { origin } = document.location;
  // if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
  //   return 'localhost:8080/api';
  // }
  return 'https://satf-api.azurewebsites.net/api';
}
