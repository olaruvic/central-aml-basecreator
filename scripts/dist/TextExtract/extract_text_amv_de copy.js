"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextExtract_1 = require("./TextExtract");
const path = require("path");
let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json');
let es = new TextExtract_1.TextExtract(output_fpath);
es.extractFromUrl('https://www.amv.de/vermoegensaufbau-und-sicherheitsplan/', true, true, true);
