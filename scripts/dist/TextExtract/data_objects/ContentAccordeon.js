"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentAccordeon extends ContentAbstract_1.ContentAbstract {
    constructor(title, article) {
        super(ContentAbstract_1.ContentType.accordeon);
        this.title = title;
        this.article = article;
    }
}
exports.ContentAccordeon = ContentAccordeon;
