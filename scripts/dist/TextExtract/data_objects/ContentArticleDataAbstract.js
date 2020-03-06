"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
var ArticleContentType;
(function (ArticleContentType) {
    ArticleContentType["title"] = "title";
    ArticleContentType["title_h2"] = "title.h2";
    ArticleContentType["title_h3"] = "title.h3";
    ArticleContentType["title_h4"] = "title.h4";
    ArticleContentType["paragraph"] = "paragraph";
    ArticleContentType["ul"] = "ul";
    ArticleContentType["ol"] = "ol";
    ArticleContentType["table"] = "table";
    ArticleContentType["tooltip"] = "tooltip";
    ArticleContentType["download_link"] = "download_link";
})(ArticleContentType = exports.ArticleContentType || (exports.ArticleContentType = {}));
class ContentArticleDataAbstract {
    constructor(type) {
        this.type = type;
    }
}
exports.ContentArticleDataAbstract = ContentArticleDataAbstract;
