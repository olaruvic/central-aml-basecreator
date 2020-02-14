"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
function stringToFile(pathToFile, stringToSave, log) {
    if (log === null || typeof (log) === 'undefined') {
        log = true;
    }
    try {
        fs.writeFileSync(pathToFile, stringToSave);
        if (log === true) {
            console.log(colors.green(pathToFile + " has been saved!"));
        }
        return true;
    }
    catch (e) {
        console.log(colors.red('\Error: Failed saving \n' + pathToFile));
        console.log(e);
        return false;
    }
}
exports.stringToFile = stringToFile;
