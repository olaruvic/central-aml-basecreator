"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
const ContentAbstract_1 = require("./ContentAbstract");
const ContentArticle_1 = require("./ContentArticle");
const ParagraphContent_1 = require("./ParagraphContent");
const ContentArticleDataParagraph_1 = require("./ContentArticleDataParagraph");
class ContentTeaser_amv extends ContentAbstract_1.ContentAbstract {
    constructor(className) {
        super(ContentAbstract_1.ContentType.teaser_amv);
        this.type = ContentAbstract_1.ContentType.teaser_amv;
        this.className = className;
        this.header = null;
        this.text = null;
        this.image = null;
        this.button = null;
    }
    static init_amv(url, $, tag) {
        const tagObj = $(tag);
        let result = new ContentTeaser_amv(tagObj.prop('class'));
        result._parse_amv(url, $, tag);
        return result;
    }
    getImages() {
        let result = [];
        if (typeof (this.text) != 'undefined' && this.text != null) {
            result = result.concat(this.text.getImages());
        }
        if (typeof (this.image) != 'undefined' && this.image != null) {
            result = result.concat(this.image.getImages());
        }
        return result;
    }
    _parse_amv(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/header/i.test(each_tag.name)) {
                        this._parse_amv_teaser_header(url, $, each_tag);
                    }
                    else if (each_tag.name.toLowerCase() == 'p') {
                        let p = ContentArticleDataParagraph_1.ContentArticleDataParagraph.init(url, $, each_tag, false);
                        if (p.textComponents.length > 0) {
                            let obj = new ContentArticle_1.ContentArticle();
                            obj.data.push(p);
                            this.text = obj;
                        }
                    }
                    else if (/footer/i.test(each_tag.name)) {
                        this.button = tagObj.text().trim();
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1701")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1702")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_amv_teaser_header(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/am-content-teaser-img/i.test(cls)) {
                        this._parse_amv_teaser_header_image(url, $, each_tag);
                    }
                    else if (/am-h1/i.test(cls)) {
                        this.header = tagObj.text().trim();
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1703")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1704")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_amv_teaser_header_image(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/img/i.test(each_tag.name)) {
                        this.image = ParagraphContent_1.ParagraphContent.initImage(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1705")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1706")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
}
exports.ContentTeaser_amv = ContentTeaser_amv;
