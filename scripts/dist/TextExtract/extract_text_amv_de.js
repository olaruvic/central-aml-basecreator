"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const TextExtractAMV_1 = require("./TextExtractAMV");
let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json');
let es = new TextExtractAMV_1.TextExtractAMV(output_fpath);
es.extractFromUrl('https://www.amv.de/sonstiges/', true, true, true, (json) => {
    console.log("------------------------------------------------");
    console.dir(json, { colors: true, depth: 100 });
    console.log("------------------------------------------------");
    console.log(JSON.stringify(json));
});
