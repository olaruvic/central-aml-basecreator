"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
const ContentArticle_1 = require("./ContentArticle");
class ContentArticleDataPriceCatcher extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor() {
        super(ContentArticleDataAbstract_1.ArticleContentType.tooltip_central_priceCatcher);
        this.text = null;
        this.price = null;
        this.tooltip = null;
    }
    getImages() {
        let result = [];
        if (typeof (this.tooltip) != 'undefined' && this.tooltip != null) {
            result = result.concat(this.tooltip.getImages());
        }
        return result;
    }
    static init(currentUrl, $, tag) {
        let priceCatcher = new ContentArticleDataPriceCatcher();
        for (let each of tag.children) {
            const cls = $(each).prop('class');
            const txt_maxLen = 30;
            const txt = $(each).text().trim().replace(/[\n\r]+/, '');
            switch (each.type) {
                case 'text':
                    break;
                case 'tag':
                    switch (each.name) {
                        case 'span':
                            if (/txt/i.test(cls)) {
                                priceCatcher.text = $(each).text().trim();
                            }
                            else if (/prize/i.test(cls)) {
                                priceCatcher.price = $(each).text().trim();
                            }
                            else if (/icon-info/i.test(cls)) {
                            }
                            else {
                                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown SPAN TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                            }
                            break;
                        case 'div':
                            if (/tooltip-content/i.test(cls)) {
                                priceCatcher.tooltip = ContentArticle_1.ContentArticle.init(currentUrl, $, each);
                            }
                            else {
                                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown DIV TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                            }
                            break;
                        default:
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                            break;
                    }
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        return priceCatcher;
    }
}
exports.ContentArticleDataPriceCatcher = ContentArticleDataPriceCatcher;
