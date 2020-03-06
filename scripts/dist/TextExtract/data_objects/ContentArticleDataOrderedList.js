"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
var ParagraphContentType;
(function (ParagraphContentType) {
    ParagraphContentType["text"] = "text";
    ParagraphContentType["footnote"] = "footnote";
})(ParagraphContentType = exports.ParagraphContentType || (exports.ParagraphContentType = {}));
class ContentArticleDataOrderedList extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor() {
        super(ContentArticleDataAbstract_1.ArticleContentType.ol);
        this.listItems = [];
    }
    static init($, tag) {
        let ol = new ContentArticleDataOrderedList();
        for (let li of tag.children) {
            let text = $(li).text().trim();
            if (text.length > 0) {
                ol.listItems.push(text);
            }
        }
        return ol;
    }
}
exports.ContentArticleDataOrderedList = ContentArticleDataOrderedList;
