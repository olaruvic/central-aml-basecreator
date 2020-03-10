"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
class ContentTooltip extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(text, subtitle) {
        super(ContentArticleDataAbstract_1.ArticleContentType.tooltip_amv);
    }
}
exports.ContentTooltip = ContentTooltip;
