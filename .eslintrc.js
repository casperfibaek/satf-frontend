module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "airbnb-base"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "Office": true,
        "OfficeExtension": true,
        "Excel": true,
        "L": true,
        "idbKeyval": true,
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "no-console": 0,
        "camelcase": 0,
        "max-len": 0,
    }
};