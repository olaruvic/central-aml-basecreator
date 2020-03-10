"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TextExtractCentral_1 = require("./TextExtractCentral");
const path = require("path");
let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json');
let es = new TextExtractCentral_1.TextExtractCentral(output_fpath);
es.extractFromUrl('https://www.central.de/produkte/', true, true, true);
