"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
var ParagraphContentType;
(function (ParagraphContentType) {
    ParagraphContentType["text"] = "text";
    ParagraphContentType["footnote"] = "footnote";
})(ParagraphContentType = exports.ParagraphContentType || (exports.ParagraphContentType = {}));
class ContentArticleDataUnorderedList extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor() {
        super(ContentArticleDataAbstract_1.ArticleContentType.ul);
        this.listItems = [];
    }
    static init($, tag) {
        let ul = new ContentArticleDataUnorderedList();
        for (let li of tag.children) {
            let text = $(li).text().trim();
            if (text.length > 0) {
                ul.listItems.push(text);
            }
        }
        return ul;
    }
}
exports.ContentArticleDataUnorderedList = ContentArticleDataUnorderedList;
