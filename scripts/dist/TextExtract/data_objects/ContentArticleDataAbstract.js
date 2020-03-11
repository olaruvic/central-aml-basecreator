"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
var ArticleContentType;
(function (ArticleContentType) {
    ArticleContentType["title"] = "title";
    ArticleContentType["title_h1"] = "title.h1";
    ArticleContentType["title_h2"] = "title.h2";
    ArticleContentType["title_h3"] = "title.h3";
    ArticleContentType["title_h4"] = "title.h4";
    ArticleContentType["title_h5"] = "title.h5";
    ArticleContentType["paragraph"] = "paragraph";
    ArticleContentType["ul"] = "ul";
    ArticleContentType["ol"] = "ol";
    ArticleContentType["table"] = "table";
    ArticleContentType["tooltip_central_priceCatcher"] = "tooltip.central.priceCatcher";
    ArticleContentType["tooltip_amv"] = "tooltip.amv";
    ArticleContentType["download_link"] = "download_link";
})(ArticleContentType = exports.ArticleContentType || (exports.ArticleContentType = {}));
class ContentArticleDataAbstract {
    constructor(type) {
        this.type = type;
        this.isPrimitive = false;
    }
    getImages() {
        console.log(`Error (${new Debug_1.Debug().shortInfo()}): Superclass responsibility!`.red.white.bold);
        process.exit(1);
        return [];
    }
}
exports.ContentArticleDataAbstract = ContentArticleDataAbstract;
