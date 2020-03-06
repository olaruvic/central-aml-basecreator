"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.ContentTitle_amv = ContentTitle_amv;
