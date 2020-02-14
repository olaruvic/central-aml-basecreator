"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
var ArticleContentType;
(function (ArticleContentType) {
    ArticleContentType["title"] = "title";
    ArticleContentType["paragraph"] = "paragraph";
    ArticleContentType["ul"] = "ul";
    ArticleContentType["table"] = "table";
})(ArticleContentType = exports.ArticleContentType || (exports.ArticleContentType = {}));
class ContentArticleDataAbstract {
    constructor(type) {
        this.type = type;
    }
}
exports.ContentArticleDataAbstract = ContentArticleDataAbstract;
