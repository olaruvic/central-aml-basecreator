"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const URL = require('url');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentIFrame extends ContentAbstract_1.ContentAbstract {
    constructor(url) {
        super(ContentAbstract_1.ContentType.img);
        this.url = url.trim();
    }
    static init(currentUrl, $, tag) {
        let img_src = $(tag).prop('src');
        let rootUrl = "";
        if (/https*:/i.test(img_src) == false) {
            let comps = URL.parse(currentUrl);
            rootUrl = comps.protocol + '//' + comps.host;
        }
        return new ContentIFrame(rootUrl + img_src);
    }
}
exports.ContentIFrame = ContentIFrame;
