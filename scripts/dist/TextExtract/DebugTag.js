"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug_1 = require("./../Debug/Debug");
const colors = require("colors");
const fs = require('fs');
const path = require('path');
const root = require('../../../root');
const needle = require('needle');
const _url = require('url');
const cheerio = require('cheerio');
class DebugTag {
    static print($, tag) {
        const txt_maxLen = 30;
        const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
        const children = tag.children;
        const num_children = (typeof (children) != 'undefined' && children != null ? children.length : "-");
        console.log(`${colors.cyan(new Debug_1.Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] children=[${num_children}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
    }
}
exports.DebugTag = DebugTag;
