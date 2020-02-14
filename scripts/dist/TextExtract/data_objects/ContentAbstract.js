"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
var ContentType;
(function (ContentType) {
    ContentType["title"] = "title";
    ContentType["article"] = "article";
    ContentType["img"] = "img";
    ContentType["accordeon"] = "accordeon";
    ContentType["iframe"] = "iframe";
})(ContentType = exports.ContentType || (exports.ContentType = {}));
class ContentAbstract {
    constructor(type) {
        this.type = type;
    }
}
exports.ContentAbstract = ContentAbstract;
