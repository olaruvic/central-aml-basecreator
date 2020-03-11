"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
const ContentAbstract_1 = require("./ContentAbstract");
const ContentImage_1 = require("./ContentImage");
const ContentArticleDataParagraph_1 = require("./ContentArticleDataParagraph");
const ParagraphContent_1 = require("./ParagraphContent");
class ContentStageItem extends ContentAbstract_1.ContentAbstract {
    constructor(className) {
        super(ContentAbstract_1.ContentType.teaser_central);
        this.className = className;
        this.title = null;
        this.text = null;
        this.button = null;
    }
    static init(url, $, tag) {
        const tagObj = $(tag);
        let result = new ContentStageItem(tagObj.prop('class'));
        result._parse(url, $, tag);
        return result;
    }
    getImages() {
        let result = [];
        if (typeof (this.image) != 'undefined' && this.image != null) {
            result = result.concat(this.image.getImages());
        }
        if (typeof (this.text) != 'undefined' && this.text != null) {
            result = result.concat(this.text.getImages());
        }
        if (typeof (this.button) != 'undefined' && this.button != null) {
            result = result.concat(this.button.getImages());
        }
        return result;
    }
    _parse(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/stage-item-image/i.test(cls)) {
                        this._parse_stageItem_image(url, $, each_tag);
                    }
                    else if (/container/i.test(cls)) {
                        this._parse_stageItem_container(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1901")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1902")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_stageItem_image(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/img/i.test(each_tag.name)) {
                        this.image = ContentImage_1.ContentImage.init(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1903")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1904")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_stageItem_container(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/stage-item-wrapper/i.test(cls)) {
                        this._parse_stageItem_container(url, $, each_tag);
                    }
                    else if (/stage-item-caption/i.test(cls)) {
                        this._parse_stageItem_container_caption(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1905")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1906")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_stageItem_container_caption(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/h2/i.test(each_tag.name)) {
                        this.title = tagObj.text().trim();
                    }
                    else if (/stage-slide-description/i.test(cls)) {
                        this.text = ContentArticleDataParagraph_1.ContentArticleDataParagraph.init(url, $, each_tag, false);
                    }
                    else if (/stage-slide-more/i.test(cls)) {
                        this._parse_stageItem_container_button(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1907")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1908")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_stageItem_container_button(url, $, tag) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (each_tag.name.toLowerCase() == 'a') {
                        this.button = ParagraphContent_1.ParagraphContent.initLink(url, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1909")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1910")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
}
exports.ContentStageItem = ContentStageItem;
