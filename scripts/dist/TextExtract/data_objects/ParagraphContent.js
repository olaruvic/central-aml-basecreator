"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("./../../Debug/Debug");
const ContentImage_1 = require("./ContentImage");
const _url = require("url");
var ParagraphContentType;
(function (ParagraphContentType) {
    ParagraphContentType["text"] = "text";
    ParagraphContentType["strong"] = "strong";
    ParagraphContentType["sup"] = "sup";
    ParagraphContentType["img"] = "img";
    ParagraphContentType["br"] = "br";
    ParagraphContentType["link"] = "link";
    ParagraphContentType["tab_header"] = "tab.header";
})(ParagraphContentType = exports.ParagraphContentType || (exports.ParagraphContentType = {}));
class ParagraphContent {
    constructor(type) {
        this.text = null;
        this.img_src = null;
        this.href = null;
        this.href_absolute = null;
        this.className = null;
        this.tab_id = null;
        this.type = type;
    }
    static initText($, tag) {
        let res = new ParagraphContent(ParagraphContentType.text);
        res.text = $(tag).text().trim();
        return res;
    }
    static initStrongText($, tag) {
        let res = new ParagraphContent(ParagraphContentType.strong);
        res.text = $(tag).text().trim();
        return res;
    }
    static initSupText($, tag) {
        let res = new ParagraphContent(ParagraphContentType.sup);
        res.text = $(tag).text().trim();
        return res;
    }
    static initLineBreak($, tag) {
        let res = new ParagraphContent(ParagraphContentType.br);
        res.text = '\n';
        return res;
    }
    static initImage(currentUrl, $, tag) {
        let tmp_img = ContentImage_1.ContentImage.init(currentUrl, $, tag);
        let res = new ParagraphContent(ParagraphContentType.img);
        let cls = $(tag).prop('class');
        if (typeof (cls) != 'undefined' && cls != null && cls.trim().length > 0) {
            res.className = cls.trim();
        }
        res.img_src = tmp_img.url;
        return res;
    }
    static initLink(currentUrl, $, tag) {
        let res = new ParagraphContent(ParagraphContentType.link);
        res.href = $(tag).prop('href');
        res.href_absolute = _url.resolve(currentUrl, res.href);
        for (let each of tag.children) {
            switch (each.type) {
                case 'text':
                    res.text = $(each).text().trim();
                    break;
                case 'tag':
                    if (each.name == 'img') {
                        let tmp_img = ContentImage_1.ContentImage.init(currentUrl, $, each);
                        res.img_src = tmp_img.url;
                    }
                    else {
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    }
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    break;
            }
        }
        return res;
    }
    static initTabHeaderTitle(currentUrl, $, tag) {
        let res = new ParagraphContent(ParagraphContentType.tab_header);
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
