"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentAccordeon extends ContentAbstract_1.ContentAbstract {
    constructor(title, articles) {
        super(ContentAbstract_1.ContentType.accordeon);
        this.title = title;
        this.articles = articles;
    }
    getImages() {
        let result = [];
        for (let each of this.articles) {
            result = result.concat(each.getImages());
        }
        return result;
    }
}
exports.ContentAccordeon = ContentAccordeon;
