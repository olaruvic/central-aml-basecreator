"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
class ContentArticleDataTitleHx extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(cType, text, className) {
        super(cType);
        this.text = text.trim();
        this.className = className;
    }
    static init_h3($, tag) {
        const o = $(tag);
        return new ContentArticleDataTitleHx(ContentArticleDataAbstract_1.ArticleContentType.title_h3, o.text(), o.prop('class'));
    }
    static init_h4($, tag) {
        const o = $(tag);
        return new ContentArticleDataTitleHx(ContentArticleDataAbstract_1.ArticleContentType.title_h4, o.text(), o.prop('class'));
    }
}
exports.ContentArticleDataTitleHx = ContentArticleDataTitleHx;
