"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug_1 = require("../../Debug/Debug");
const colors = require('colors');
const ContentAbstract_1 = require("./ContentAbstract");
const ContentTitle_amv_1 = require("./ContentTitle_amv");
class ContentTitle_central extends ContentTitle_amv_1.ContentTitle_amv {
    constructor(text, subtitle) {
        super("");
        this.type = ContentAbstract_1.ContentType.title_central;
        this.text = text.trim();
        this.subtitle = subtitle.trim();
    }
    getImages() {
        return [];
    }
    static init_central(url, $, tag) {
        const page_header = $(tag).find('.page-header');
        if (page_header.length <= 0) {
            const txt_maxLen = 30;
            const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: 'page-header' not found! type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
            return;
        }
        let title = new ContentTitle_central("", "");
        for (let each_tag of page_header[0].children) {
            let tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text':
                    break;
                case 'tag':
                    switch (each_tag.name) {
                        case 'h1':
                            title.text = tagObj.text().trim();
                            break;
                        case 'p':
                            title.subtitle = tagObj.text().trim();
                            break;
                        default:
                            const txt_maxLen = 30;
                            const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
        return title;
    }
}
exports.ContentTitle_central = ContentTitle_central;
