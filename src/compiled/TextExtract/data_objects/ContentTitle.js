"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentTitle extends ContentAbstract_1.ContentAbstract {
    constructor(text) {
        super(ContentAbstract_1.ContentType.title);
        this.text = text.trim();
    }
    static init($, tag) {
        return new ContentTitle($(tag).text());
    }
}
exports.ContentTitle = ContentTitle;
