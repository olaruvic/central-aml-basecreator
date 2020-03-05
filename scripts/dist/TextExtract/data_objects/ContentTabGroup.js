"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const Debug_1 = require("../../Debug/Debug");
const ContentAbstract_1 = require("./ContentAbstract");
const ContentArticle_1 = require("./ContentArticle");
const ParagraphContent_1 = require("./ParagraphContent");
const ContentTab_1 = require("./ContentTab");
class ContentTabGroup extends ContentAbstract_1.ContentAbstract {
    constructor() {
        super(ContentAbstract_1.ContentType.tab_group);
        this.title = null;
        this.tabs = [];
    }
    static init(url, $, tag) {
        let result = new ContentTabGroup();
        result._parse(url, $, tag);
        return result;
    }
    _parse(url, $, tag) {
        let tab_headers = [];
        let tab_contents = {};
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text':
                case 'comment':
                    break;
                case 'tag':
                    if (/module-tabs-inner/i.test(cls)) {
                        this._parse_module_tab_headers(url, $, each_tag, tab_headers);
                    }
                    else if (/tab-content/i.test(cls)) {
                        this._parse_module_tab_contents(url, $, each_tag, tab_contents);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
        this.tabs = [];
        for (let each_header of tab_headers) {
            let content = tab_contents[each_header.tab_id];
            if (content != null) {
                let tab = new ContentTab_1.ContentTab(each_header.tab_id, each_header, content);
                this.tabs.push(tab);
            }
            else {
                const txt_maxLen = 30;
                const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red('Error: Content for tab id ' + each_header.tab_id + ' not found!')} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
            }
        }
    }
    _parse_module_tab_headers(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/tab-header/i.test(cls)) {
                        let txt = tagObj.text().trim();
                        this.title = (txt.length > 0 ? txt : null);
                    }
                    else if (/input-group-btn/i.test(cls)) {
                        this._parse_module_tab_header_group(url, $, each_tag, result);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1003")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1004")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_module_tab_header_group(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    switch (each_tag.name) {
                        case 'span':
                            break;
                        case 'ul':
                            this._parse_module_tab_header_group_list(url, $, each_tag, result);
                            break;
                        default:
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1005")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                            break;
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1006")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_module_tab_header_group_list(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    switch (each_tag.name) {
                        case 'li':
                            this._parse_tab_header_title(url, $, each_tag, result);
                            break;
                        default:
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1007")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                            break;
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1008")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_tab_header_title(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    switch (each_tag.name) {
                        case 'a':
                            {
                                result.push(ParagraphContent_1.ParagraphContent.initTabHeaderTitle(url, $, each_tag));
                            }
                            break;
                        default:
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1009")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                            break;
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1010")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_module_tab_contents(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/tab-pane/i.test(cls)) {
                        let tab_id = $(each_tag).prop('id');
                        let blocks = [];
                        this._parse_module_tab_content_block(url, $, each_tag, blocks);
                        result[tab_id] = blocks;
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1011")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1012")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_module_tab_content_block(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/rte-content/i.test(cls)) {
                        result.push(ContentArticle_1.ContentArticle.init(url, $, each_tag));
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1013")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1014")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
}
exports.ContentTabGroup = ContentTabGroup;
