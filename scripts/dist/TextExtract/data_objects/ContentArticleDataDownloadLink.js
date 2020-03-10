"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
const ParagraphContent_1 = require("./ParagraphContent");
class ContentArticleDataDownloadLink extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor() {
        super(ContentArticleDataAbstract_1.ArticleContentType.download_link);
        this.text = null;
        this.file_size = null;
    }
    getImages() {
        let result = [];
        if (typeof (this.text) != 'undefined' && this.text != null) {
            result.push(this.text.getImages());
        }
        return result;
    }
    static init(url, $, tag) {
        let result = new ContentArticleDataDownloadLink();
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (each_tag.name == "a" && /icon-download/i.test(cls)) {
                        result.text = ParagraphContent_1.ParagraphContent.initLink(url, $, each_tag);
                    }
                    else if (each_tag.name == "span" && /file-size/i.test(cls)) {
                        let txt = tagObj.text().trim();
                        result.file_size = (txt.length > 0 ? txt : null);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1201")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1202")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        return result;
    }
}
exports.ContentArticleDataDownloadLink = ContentArticleDataDownloadLink;
