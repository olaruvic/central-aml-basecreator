"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug_1 = require("../../Debug/Debug");
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
const ContentArticle_1 = require("./ContentArticle");
class ContentArticleDataTooltip extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor() {
        super(ContentArticleDataAbstract_1.ArticleContentType.tooltip_amv);
        this.tooltip_id = null;
        this.tooltip = null;
    }
    static init_amv(currentUrl, $, tag) {
        let result = new ContentArticleDataTooltip();
        result._parse_amv(currentUrl, $, tag);
        return result;
    }
    _parse_amv(url, $, tag) {
        let tooltip_id = $(tag).prop('data-inline-target');
        if (typeof (tooltip_id) != 'undefined' && tooltip_id != null && tooltip_id.trim().length > 0) {
            let tooltip_data = $('#' + tooltip_id);
            if (tooltip_data.length > 0) {
                this.tooltip_id = tooltip_id;
                let tooltip_content = tooltip_data.get(0);
                this._parse_tooltip_amv_content(url, $, tooltip_content);
            }
        }
    }
    _parse_tooltip_amv_content(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/am-rt/i.test(tagObj.prop('class'))) {
                        this.tooltip = ContentArticle_1.ContentArticle.init(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1601")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1602")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
}
exports.ContentArticleDataTooltip = ContentArticleDataTooltip;
