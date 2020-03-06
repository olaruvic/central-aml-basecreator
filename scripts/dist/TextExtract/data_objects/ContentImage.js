"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const URL = require('url');
const Debug_1 = require("./../../Debug/Debug");
const ContentAbstract_1 = require("./ContentAbstract");
class ContentImage extends ContentAbstract_1.ContentAbstract {
    constructor(url) {
        super(ContentAbstract_1.ContentType.img);
        this.title = null;
        this.alt = null;
        this.url = null;
        if (typeof (url) != 'undefined' && url != null) {
            this.url = [];
            for (let each_src of url) {
                this.url.push(each_src.trim());
            }
        }
    }
    static init(currentUrl, $, tag) {
        let tagObj = $(tag);
        let img_src = tagObj.prop('src').trim();
        let urls = [];
        if (img_src.length > 0) {
            urls.push(URL.resolve(currentUrl, img_src));
        }
        ContentImage._extractResponsiveImg(currentUrl, $, tag, urls);
        let res = new ContentImage(urls);
        res.title = ContentImage._extractAttrValue(tagObj, 'title');
        res.alt = ContentImage._extractAttrValue(tagObj, 'alt');
        return res;
    }
    static init_moduleImage(currentUrl, $, tag) {
        let result;
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/figure/i.test(cls)) {
                        result = ContentImage._parse_module_image_figure(currentUrl, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1301")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1302")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        return result;
    }
    static _parse_module_image_figure(currentUrl, $, tag) {
        let result;
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/figure-img/i.test(cls)) {
                        result = ContentImage.init(currentUrl, $, each_tag);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1303")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1304")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        return result;
    }
    static _extractAttrValue(tagObj, prop_name) {
        let val = tagObj.prop(prop_name);
        if (typeof (val) != 'undefined' && val != null) {
            val = val.trim();
            return (val.length > 0
                ? val
                : null);
        }
        return null;
    }
    static _extractResponsiveImg(currentUrl, $, tag, result) {
        let tagObj = $(tag);
        let resImg = tagObj.prop('data-responsive-image');
        if (typeof (resImg) != 'undefined' && resImg != null) {
            resImg = JSON.parse(resImg);
            for (let each_responsive_key in resImg) {
                if (/\d+x\d/i.test(each_responsive_key)) {
                    let images = resImg[each_responsive_key];
                    for (let each_key in images) {
                        let each_src = images[each_key].trim();
                        if (each_src.length > 0) {
                            result.push(URL.resolve(currentUrl, each_src));
                        }
                    }
                }
                else {
                    const txt_maxLen = 30;
                    const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown data-responsive-image TAG")} :: type=[${tag.type}] name=[${tag.name}] class=[${tagObj.prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                }
            }
        }
    }
}
exports.ContentImage = ContentImage;
