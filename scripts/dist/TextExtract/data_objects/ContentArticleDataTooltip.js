"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("./../../Debug/Debug");
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
class ContentArticleDataTooltip extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(text, className, textComponents) {
        super(ContentArticleDataAbstract_1.ArticleContentType.tooltip);
        this.text = text.trim();
        this.className = (typeof (className) != 'undefined' && className != null ? className : null);
        this.textComponents = textComponents;
    }
    static init(currentUrl, $, tag) {
        let textComponents = [];
        for (let each of tag.children) {
            const cls = $(each).prop('class');
            const txt_maxLen = 30;
            const txt = $(each).text().trim().replace(/[\n\r]+/, '');
            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
            switch (each.type) {
                case 'text':
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        const o = $(tag);
        return new ContentArticleDataTooltip(o.text(), o.prop('class'), textComponents);
    }
}
exports.ContentArticleDataTooltip = ContentArticleDataTooltip;
