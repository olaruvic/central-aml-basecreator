"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("./../../Debug/Debug");
const ContentImage_1 = require("./ContentImage");
const _url = require("url");
var ParagraphContentPrimitiveType;
(function (ParagraphContentPrimitiveType) {
    ParagraphContentPrimitiveType["text"] = "text";
    ParagraphContentPrimitiveType["strong"] = "strong";
    ParagraphContentPrimitiveType["sup"] = "sup";
    ParagraphContentPrimitiveType["em"] = "em";
    ParagraphContentPrimitiveType["img"] = "img";
    ParagraphContentPrimitiveType["br"] = "br";
    ParagraphContentPrimitiveType["link"] = "link";
    ParagraphContentPrimitiveType["tab_header"] = "tab.header";
})(ParagraphContentPrimitiveType = exports.ParagraphContentPrimitiveType || (exports.ParagraphContentPrimitiveType = {}));
class ParagraphContent {
    constructor(type) {
        this.text = null;
        this.images = null;
        this.href = null;
        this.href_absolute = null;
        this.className = null;
        this.tab_id = null;
        this.type_primitive = type;
        this.isPrimitive = true;
    }
    getImages() {
        let result = [];
        if (typeof (this.images) != 'undefined' && this.images != null && this.images.length > 0) {
            result = result.concat(this.images);
        }
        return result;
    }
    static initText($, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.text);
        res.text = $(tag).text().trim();
        return res;
    }
    static initStrongText($, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.strong);
        res.text = $(tag).text().trim();
        return res;
    }
    static initSupText($, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.sup);
        res.text = $(tag).text().trim();
        return res;
    }
    static initEmText($, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.em);
        res.text = $(tag).text().trim();
        return res;
    }
    static initLineBreak($, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.br);
        res.text = '\n';
        return res;
    }
    static initImage(currentUrl, $, tag) {
        let tmp_img = ContentImage_1.ContentImage.init(currentUrl, $, tag);
        let res = new ParagraphContent(ParagraphContentPrimitiveType.img);
        let cls = $(tag).prop('class');
        if (typeof (cls) != 'undefined' && cls != null && cls.trim().length > 0) {
            res.className = cls.trim();
        }
        if (res.images == null)
            res.images = [];
        res.images.push(tmp_img);
        return res;
    }
    static initLink(currentUrl, $, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.link);
        res.href = $(tag).prop('href');
        res.href_absolute = _url.resolve(currentUrl, res.href);
        for (let each of tag.children) {
            switch (each.type) {
                case 'text':
                    {
                        let txt = $(each).text().trim();
                        if (txt.length > 0) {
                            res.text = txt;
                        }
                    }
                    break;
                case 'tag':
                    if (each.name == 'img') {
                        let tmp_img = ContentImage_1.ContentImage.init(currentUrl, $, each);
                        if (res.images == null)
                            res.images = [];
                        res.images.push(tmp_img);
                    }
                    else if (each.name == 'span') {
                        let txt = $(each).text().trim();
                        if (txt.length > 0) {
                            res.text = txt;
                        }
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')} text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')} text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]]`);
                    }
                    break;
            }
        }
        return res;
    }
    static initTabHeaderTitle(currentUrl, $, tag) {
        let res = new ParagraphContent(ParagraphContentPrimitiveType.tab_header);
        res.tab_id = $(tag).prop('href').replace(/^#/im, '');
        for (let each of tag.children) {
            switch (each.type) {
                case 'text':
                    res.text = $(each).text().trim();
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    break;
            }
        }
        return res;
    }
}
exports.ParagraphContent = ParagraphContent;
