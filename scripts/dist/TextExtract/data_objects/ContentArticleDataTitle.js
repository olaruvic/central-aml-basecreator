"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
class ContentArticleDataTitle extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(text, className) {
        super(ContentArticleDataAbstract_1.ArticleContentType.title);
        this.text = text.trim();
        this.className = className;
    }
    static init($, tag) {
        const o = $(tag);
        return new ContentArticleDataTitle(o.text(), o.prop('class'));
    }
    getImages() {
        return [];
    }
}
exports.ContentArticleDataTitle = ContentArticleDataTitle;
