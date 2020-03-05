"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const URL = require('url');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentImage extends ContentAbstract_1.ContentAbstract {
    constructor(url) {
        super(ContentAbstract_1.ContentType.img);
        this.title = null;
        this.alt = null;
        this.url = url.trim();
    }
    static init(currentUrl, $, tag) {
        let tagObj = $(tag);
        let img_src = tagObj.prop('src');
        let rootUrl = "";
        if (/https*:/i.test(img_src) == false) {
            let comps = URL.parse(currentUrl);
            rootUrl = comps.protocol + '//' + comps.host;
        }
        let res = new ContentImage(URL.resolve(rootUrl, img_src));
        res.title = ContentImage._extractAttrValue(tagObj, 'title');
        res.alt = ContentImage._extractAttrValue(tagObj, 'alt');
        return res;
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
}
exports.ContentImage = ContentImage;
