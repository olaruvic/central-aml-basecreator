"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("./../../Debug/Debug");
const ContentAbstract_1 = require("./ContentAbstract");
const ContentArticleDataTitle_1 = require("./ContentArticleDataTitle");
const ContentArticleDataParagraph_1 = require("./ContentArticleDataParagraph");
const ContentArticleDataUnorderedList_1 = require("./ContentArticleDataUnorderedList");
const ContentArticleDataTable_1 = require("./ContentArticleDataTable");
const ContentArticleDataPriceCatcher_1 = require("./ContentArticleDataPriceCatcher");
const ContentArticleDataTitleHx_1 = require("./ContentArticleDataTitleHx");
class ContentArticle extends ContentAbstract_1.ContentAbstract {
    constructor() {
        super(ContentAbstract_1.ContentType.article);
        this.data = [];
    }
    static init(currentUrl, $, tag) {
        let article = new ContentArticle();
        for (let each of tag.children) {
            if (each.type != 'tag')
                continue;
            const cls = $(each).prop('class');
            switch (each.name) {
                case 'span':
                    article.data.push(ContentArticleDataTitle_1.ContentArticleDataTitle.init($, each));
                    break;
                case 'p':
                    let p = ContentArticleDataParagraph_1.ContentArticleDataParagraph.init(currentUrl, $, each);
                    if (p.text.length > 0) {
                        article.data.push(p);
                    }
                    break;
                case 'ul':
                    article.data.push(ContentArticleDataUnorderedList_1.ContentArticleDataUnorderedList.init($, each));
                    break;
                case 'table':
                    article.data.push(ContentArticleDataTable_1.ContentArticleDataTable.init($, each));
                    break;
                case 'div':
                    if (/pricetag-inner/i.test(cls)) {
                        article.data.push(ContentArticleDataPriceCatcher_1.ContentArticleDataPriceCatcher.init(currentUrl, $, each));
                    }
                    else {
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown DIV TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
                    }
                    break;
                case 'h3':
                    article.data.push(ContentArticleDataTitleHx_1.ContentArticleDataTitleHx.init_h3($, each));
                    break;
                case 'h4':
                    article.data.push(ContentArticleDataTitleHx_1.ContentArticleDataTitleHx.init_h4($, each));
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
                    break;
            }
        }
        return article;
    }
}
exports.ContentArticle = ContentArticle;
