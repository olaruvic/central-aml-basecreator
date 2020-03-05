"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
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
    ContentType["teaser"] = "teaser";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class ContentAbstract {
    constructor(type) {
        this.type = type;
    }
}
exports.ContentAbstract = ContentAbstract;
