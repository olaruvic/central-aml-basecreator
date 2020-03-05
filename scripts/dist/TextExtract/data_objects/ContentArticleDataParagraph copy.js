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
class ContentArticleDataParagraph extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor(text, className, textComponents) {
        super(ContentArticleDataAbstract_1.ArticleContentType.paragraph);
        this.text = text.trim();
        this.className = (typeof (className) != 'undefined' && className != null ? className : null);
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
        const o = $(tag);
        let result = new ContentArticleDataParagraph(o.text(), o.prop('class'), []);
        result._parse(currentUrl, $, tag);
        return result;
    }
    _parse(currentUrl, $, tag) {
        for (let each of tag.children) {
            const cls = $(each).prop('class');
            switch (each.type) {
                case 'text':
                    this.textComponents.push(ParagraphContent_1.ParagraphContent.initText($, each));
                    break;
                case 'tag':
                    switch (each.name) {
                        case 'strong':
                            this.textComponents.push(ParagraphContent_1.ParagraphContent.initStrongText($, each));
                            break;
                        case 'sup':
                            this.textComponents.push(ParagraphContent_1.ParagraphContent.initSupText($, each));
                            break;
                        case 'br':
                            this.textComponents.push(ParagraphContent_1.ParagraphContent.initLineBreak($, each));
                            break;
                        case 'img':
                            this.textComponents.push(ParagraphContent_1.ParagraphContent.initImage(currentUrl, $, each));
                            break;
                        case 'a':
                            this.textComponents.push(ParagraphContent_1.ParagraphContent.initLink(currentUrl, $, each));
                            break;
                        case 'span':
                            if (/cm-image/.test(cls)) {
                                this._parse(currentUrl, $, each);
                            }
                            else {
                                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown SPAN")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
                            }
                            break;
                        default:
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
                            break;
                    }
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
                    break;
            }
        }
    }
}
exports.ContentArticleDataParagraph = ContentArticleDataParagraph;
