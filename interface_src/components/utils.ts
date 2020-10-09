export function htmlTable(obj:any):string {
  let table = '<table class=""><tbody>';

  if (obj._data) {
    for (let i = 0; i < obj._data.length; i += 1) {
      table += `<tr><td>${obj._data[i]}</td></tr>`;
    }
  } else {
    const keys = Object.keys(obj);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      const val = obj[key];

      table += `<tr><td>${key}</td><td>${val}</td></tr>`;
    }
  }

  table += '</tbody></table>';
  return table;
}

export default {
  htmlTable,
};
