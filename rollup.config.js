import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const path = require('path');

const extensions = ['.ts', '.tsx'];

export default [
    {
        input: path.resolve(__dirname, 'excel_interface/commands/commands.ts'),
        output: [{
            file: path.resolve(__dirname, 'excel_interface/commands/commands.js'),
            format: 'iife',
            globals: { office: 'Office', excel: 'Excel' },
        }],
        external: ['window', 'document', 'body', 'console'],
        plugins: [
            babel({ extensions, babelHelpers: 'inline' }),
            resolve({ extensions }),
            commonjs(),
        ],
    },
    {
        input: path.resolve(__dirname, 'excel_interface/map/map.ts'),
        output: [{
            file: path.resolve(__dirname, 'excel_interface/map/map.js'),
            format: 'iife',
            globals: { leaflet: 'L' },
        }],
        external: ['window', 'document', 'body', 'console'],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, babelHelpers: 'inline' }),
        ],
    },
    {
        input: path.resolve(__dirname, 'excel_interface/functions/functions.ts'),
        output: [{
            file: path.resolve(__dirname, 'excel_interface/functions/functions.js'),
            format: 'iife',
            globals: { customFunctions: 'CustomFunctions' },
        }],
        external: ['window', 'document', 'body', 'console'],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, babelHelpers: 'inline' }),
        ],
    },
    {
        input: path.resolve(__dirname, 'excel_interface/taskpane/taskpane.ts'),
        output: [{
            file: path.resolve(__dirname, 'excel_interface/taskpane/taskpane.js'),
            format: 'iife',
            globals: { office: 'Office', excel: 'Excel' },
        }],
        external: ['window', 'document', 'body', 'console'],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({ extensions, babelHelpers: 'inline' }),
        ],
    },
];
