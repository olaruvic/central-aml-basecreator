"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("./../../Debug/Debug");
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
const ParagraphContent_1 = require("./ParagraphContent");
var ParagraphContentType;
(function (ParagraphContentType) {
    ParagraphContentType["text"] = "text";
    ParagraphContentType["footnote"] = "footnote";
})(ParagraphContentType = exports.ParagraphContentType || (exports.ParagraphContentType = {}));
class _OLD_ContentArticleDataParagraph extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(text, className, textComponents) {
        super(ContentArticleDataAbstract_1.ArticleContentType.paragraph);
        this.text = text.trim();
        this.className = className;
        this.textComponents = textComponents;
        this._initParagraphType();
    }
    _initParagraphType() {
        if (typeof (this.className) == 'undefined' || this.className == null) {
            this.paragraphType = ParagraphContentType.text;
        }
        else if (/footnote/.test(this.className)) {
            this.paragraphType = ParagraphContentType.footnote;
        }
        else {
            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red('Unknown')} :: className=[${this.className}]`);
        }
    }
    static init(currentUrl, $, tag) {
        let textComponents = [];
        for (let each of tag.children) {
            switch (each.type) {
                case 'text':
                    textComponents.push(ParagraphContent_1.ParagraphContent.initText($, each));
                    break;
                case 'tag':
                    switch (each.name) {
                        case 'strong':
                            textComponents.push(ParagraphContent_1.ParagraphContent.initStrongText($, each));
                            break;
                        case 'sup':
                            textComponents.push(ParagraphContent_1.ParagraphContent.initSupText($, each));
                            break;
                        case 'br':
                            textComponents.push(ParagraphContent_1.ParagraphContent.initLineBreak($, each));
                            break;
                        case 'img':
                            textComponents.push(ParagraphContent_1.ParagraphContent.initImage(currentUrl, $, each));
                            break;
                        case 'a':
                            textComponents.push(ParagraphContent_1.ParagraphContent.initLink(currentUrl, $, each));
                            break;
                        default:
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                            break;
                    }
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    break;
            }
        }
        const o = $(tag);
        return new _OLD_ContentArticleDataParagraph(o.text(), o.prop('class'), textComponents);
    }
}
exports._OLD_ContentArticleDataParagraph = _OLD_ContentArticleDataParagraph;
