"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("./../../Debug/Debug");
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
const ContentArticleDataParagraph_1 = require("./ContentArticleDataParagraph");
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
    static init(url, $, tag) {
        let result = new ContentArticleDataUnorderedList();
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/li/i.test(each_tag.name)) {
                        result.listItems.push(ContentArticleDataParagraph_1.ContentArticleDataParagraph.init(url, $, each_tag, false));
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1401")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1402")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        return result;
    }
}
exports.ContentArticleDataUnorderedList = ContentArticleDataUnorderedList;
