"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
var ContentType;
(function (ContentType) {
    ContentType["title_amv"] = "title.amv";
    ContentType["title_central"] = "title.central";
    ContentType["article"] = "article";
    ContentType["img"] = "img";
    ContentType["accordeon"] = "accordeon";
    ContentType["iframe"] = "iframe";
    ContentType["tab_group"] = "tab.group";
    ContentType["tab"] = "tab";
    ContentType["teaser_central"] = "teaser.central";
    ContentType["teaser_amv"] = "teaser.amv";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class ContentAbstract {
    constructor(type) {
        this.type = type;
    }
    getImages() {
        console.log(`Error (${new Debug_1.Debug().shortInfo()}): Superclass responsibility!`);
        process.exit(1);
        return [];
    }
}
exports.ContentAbstract = ContentAbstract;
