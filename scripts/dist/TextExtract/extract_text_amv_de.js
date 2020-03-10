"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextExtractAMV_1 = require("./TextExtractAMV");
const path = require("path");
let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json');
let es = new TextExtractAMV_1.TextExtractAMV(output_fpath);
es.extractFromUrl('https://www.amv.de/vermoegensaufbau-und-sicherheitsplan/', true, true, true, (json) => {
    console.log("------------------------------------------------");
    console.dir(json, { colors: true, depth: 100 });
    console.log("------------------------------------------------");
    console.log(JSON.stringify(json));
});
