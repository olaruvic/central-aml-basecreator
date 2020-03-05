"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DebugTag_1 = require("../DebugTag");
const Debug_1 = require("../../Debug/Debug");
const colors = require('colors');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentTitle_amv extends ContentAbstract_1.ContentAbstract {
    constructor(text) {
        super(ContentAbstract_1.ContentType.title_amv);
        this.text = text.trim();
    }
    static init($, tag) {
        return new ContentTitle_amv($(tag).text());
    }
    static init_central(url, $, tag, result) {
        const page_header = $(tag).find('.page-header');
        if (page_header.length <= 0) {
            const txt_maxLen = 30;
            const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: 'page-header' not found! type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
            return;
        }
        for (let each_tag of page_header[0].children) {
            let tagObj = $(each_tag);
            DebugTag_1.DebugTag.print($, each_tag);
        }
        process.exit(1);
    }
}
exports.ContentTitle_amv = ContentTitle_amv;
