"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
const fs = require("fs");
function fileToString(filePath, stopOnError) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        return (typeof (content) == 'undefined' || content == null ? '' : content);
    }
    catch (e) {
        console.log(colors.bgRed('There was an error reading the file: ' + filePath));
        console.log(e);
    }
    if (stopOnError === true) {
        process.exit();
        return '';
    }
    return '';
}
exports.fileToString = fileToString;
