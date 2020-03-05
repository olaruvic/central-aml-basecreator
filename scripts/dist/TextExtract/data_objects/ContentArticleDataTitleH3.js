"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
class ContentArticleDataTitleH3 extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(text, className) {
        super(ContentArticleDataAbstract_1.ArticleContentType.title_h3);
        this.text = text.trim();
        this.className = className;
    }
    static init($, tag) {
        const o = $(tag);
        return new ContentArticleDataTitleH3(o.text(), o.prop('class'));
    }
}
exports.ContentArticleDataTitleH3 = ContentArticleDataTitleH3;
