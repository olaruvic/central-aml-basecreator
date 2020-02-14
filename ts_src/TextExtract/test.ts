const clipboardy = require('clipboardy');
import htmlToRtf = require('html-to-rtf');

let html = '<p><b>ein fetter</b> und <i>ein kursiver</i> Text</p>';

let rtf = htmlToRtf.convertHtmlToRtf(html);

clipboardy.writeSync(rtf);
console.log(">>", clipboardy.readSync());
