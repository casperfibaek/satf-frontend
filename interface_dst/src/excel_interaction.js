var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function lettersToNumber(letters) {
    const chrs = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const mode = chrs.length - 1;
    let number = 0;
    for (let p = 0; p < letters.length; p += 1) {
        number = number * mode + chrs.indexOf(letters[p]);
    }
    return number;
}
function numberToCol(num) {
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
function fitTo(adress, data) {
    const sheet = adress.split('!')[0];
    const adr = adress.split('!')[1];
    const row = Number(adr.replace(/^\D+/g, ''));
    const col = adr.replace(/[^a-zA-Z]/g, '');
    const colNr = lettersToNumber(col);
    return `${sheet}!${adr}:${numberToCol(colNr + data[0].length - 1)}${row + data.length - 1}`;
}
export function addCellsToSheet(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Excel.run((context) => __awaiter(this, void 0, void 0, function* () {
                console.log('inside excel run');
                const sheet = context.workbook.worksheets.getActiveWorksheet();
                console.log(sheet);
                const range = context.workbook.getSelectedRange();
                console.log(range);
                yield context.sync();
                range.load('address');
                yield context.sync();
                const newRange = sheet.getRange(fitTo(range.address, data).split('!')[1]);
                newRange.load('values');
                console.log(newRange);
                yield context.sync();
                const rows = newRange.values.length;
                const cols = newRange.values[0].length;
                console.log('rows', rows);
                console.log('cols', cols);
                let empty = true;
                for (let row = 0; row < rows; row += 1) {
                    if (!empty) {
                        break;
                    }
                    for (let col = 0; col < cols; col += 1) {
                        const val = newRange.values[row][col];
                        if (val !== '') {
                            empty = false;
                            break;
                        }
                    }
                }
                if (empty) {
                    newRange.values = data;
                }
                else {
                    newRange.select();
                    yield context.sync();
                    const message = 'Cells not empty';
                    throw new Error(message);
                }
                yield context.sync();
                return true;
            }));
        }
        catch (err) {
            throw new Error(err);
        }
        return false;
    });
}
export function getSelectedCells() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const values = yield Excel.run((context) => __awaiter(this, void 0, void 0, function* () {
                const range = context.workbook.getSelectedRange();
                range.load('values');
                yield context.sync();
                return range.values;
            }));
            console.log(values);
            return values;
        }
        catch (err) {
            throw new Error('Invalid selection. No selection?');
        }
    });
}
//# sourceMappingURL=excel_interaction.js.map