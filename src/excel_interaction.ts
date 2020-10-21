import { logToServer } from './utils';

function lettersToNumber(letters:string) {
  const chrs = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const mode = chrs.length - 1;
  let number = 0;
  for (let p = 0; p < letters.length; p += 1) {
    number = number * mode + chrs.indexOf(letters[p]);
  }
  return number;
}

function numberToCol(num:number) {
  let str = '';
  let q;
  let r;
  let _num = num;
  while (_num > 0) {
    q = (_num - 1) / 26;
    r = (_num - 1) % 26;
    _num = Math.floor(q);
    str = String.fromCharCode(65 + r) + str;
  }
  return str;
}

function fitTo(adress:string, data:any[]) {
  const sheet = adress.split('!')[0];
  const adr = adress.split('!')[1];
  const row = Number(adr.replace(/^\D+/g, ''));
  const col = adr.replace(/[^a-zA-Z]/g, '');
  const colNr = lettersToNumber(col);

  return `${sheet}!${adr}:${numberToCol(colNr + data[0].length - 1)}${row + data.length - 1}`;
}

export async function addCellsToSheet(data:any):Promise<boolean> {
  try {
    await Excel.run(async (context) => {
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      const range = context.workbook.getSelectedRange();
      range.load('address');

      await context.sync();

      const newRange = sheet.getRange(fitTo(range.address, data).split('!')[1]);
      newRange.load('values');

      await context.sync();

      const rows = newRange.values.length;
      const cols = newRange.values[0].length;

      let empty = true;
      for (let row = 0; row < rows; row += 1) {
        if (!empty) { break; }
        for (let col = 0; col < cols; col += 1) {
          const val = newRange.values[row][col];
          if (val !== '') { empty = false; break; }
        }
      }

      if (empty) {
        newRange.values = data;
      } else {
        newRange.select();

        await context.sync();

        const message = 'Cells not empty';
        throw new Error(message);
      }

      await context.sync();

      return true;
    });
  } catch (err) {
    throw new Error(err);
  }
  return false;
}

export async function getSelectedCells():Promise<any[][]> {
  try {
    const values = await Excel.run(async (context) => {
      const range = context.workbook.getSelectedRange();
      range.load('values');

      await context.sync();
      return range.values;
    });
    console.log(values);
    return values;
  } catch (err) {
    throw new Error('Invalid selection. No selection?');
  }
}
