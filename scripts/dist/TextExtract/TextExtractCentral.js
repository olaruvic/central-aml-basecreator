"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const fs = require('fs');
const path = require('path');
const root = require('../../../root');
const needle = require('needle');
const _url = require('url');
const ContentTitle_central_1 = require("./data_objects/ContentTitle_central");
const ContentArticle_1 = require("./data_objects/ContentArticle");
const ContentImage_1 = require("./data_objects/ContentImage");
const ContentAccordeon_1 = require("./data_objects/ContentAccordeon");
const ContentTabGroup_1 = require("./data_objects/ContentTabGroup");
const ContentTeaser_1 = require("./data_objects/ContentTeaser");
const Debug_1 = require("../Debug/Debug");
const cheerio = require('cheerio');
class TextExtractCentral {
    constructor(fpath_output_csv) {
        this.fpath_output_csv = fpath_output_csv;
        this._sitemap_links = [];
        this._sitemap_links_pool = {};
        this._sitemap_links_enum_idx = 0;
        this._404_notFound = 0;
        this._log_ifFound = true;
        this._log_ifNotFound = false;
        this._log_error = false;
        if (typeof (this.fpath_output_csv) == 'undefined' || this.fpath_output_csv == null) {
            console.log(colors.bgRed.white(`Error: csv file path required!`));
            process.exit(1);
        }
    }
    extractFromUrl(starting_url, log_ifFound, log_ifNotFound, log_error, callback) {
        let links = {};
        links[starting_url.trim().toLowerCase()] = 1;
        this._sitemap_links = Object.keys(links);
        this._sitemap_links_pool = links;
        this._exec_webExtract(log_ifFound, log_ifNotFound, log_error, callback);
    }
    _exec_webExtract(log_ifFound, log_ifNotFound, log_error, callback) {
        this._404_notFound = 0;
        this._log_ifFound = log_ifFound;
        this._log_ifNotFound = log_ifNotFound;
        this._log_error = log_error;
        let _this = this;
        console.log(colors.cyan(`Extracting text ...`));
        this._sitemap_links_enum_idx = 0;
        this._read_next_url(function () {
            console.log(colors.red(`${new Debug_1.Debug().shortInfo()} :: export_csv() implementation needed`));
            if (typeof (callback) != 'undefined' && callback != null) {
                callback();
            }
        });
    }
    _read_next_url(callback) {
        let _this = this;
        let timeout = 1;
        setTimeout(() => {
            _this._delayed__read_next_url(callback);
        }, timeout);
    }
    _delayed__read_next_url(callback) {
        const _this = this;
        let url = null;
        while (url == null && this._sitemap_links_enum_idx < this._sitemap_links.length) {
            url = this._sitemap_links[this._sitemap_links_enum_idx];
            this._sitemap_links_enum_idx += 1;
        }
        if (url != null) {
            console.log(colors.yellow(`searching url (${colors.yellow.bold(this._sitemap_links_enum_idx.toString())} of ${colors.yellow.bold(this._sitemap_links.length.toString())}):`), colors.grey(url));
            needle.get(url, function (err, res, body) {
                if (!err) {
                    const current_url = _this._normalizeUrl(url);
                    _this._extractText(current_url, body, function () {
                        _this._read_next_url(callback);
                    });
                }
                else {
                    console.log(colors.bgRed.white(`############ needs implementation :: ${new Debug_1.Debug().shortInfo()}`));
                    process.exit(1);
                }
            });
        }
        else {
            console.log(colors.yellow("no more urls in list"));
        }
    }
    _normalizeUrl(url) {
        let res = url;
        res = res.replace(/(\/\s*)$/i, '');
        return res;
    }
    _extractText(url, html_body, callback) {
        const $ = cheerio.load(html_body);
        let result = [];
        this._parse_defaultContent_sections(url, $, $('article'), result);
        this._parse_homeContent_sections(url, $, $('.content.home'), result);
        console.log("------------------------------------------------");
        console.dir(result, { colors: true, depth: 100 });
        console.log("------------------------------------------------");
        console.log(JSON.stringify(result));
    }
    _parse_defaultContent_sections(url, $, sections, result) {
        for (let idx = 0; idx < sections.length; idx++) {
            let each_tag_found = sections.get(idx);
            for (let each_tag of each_tag_found.children) {
                let tagObj = $(each_tag);
                let cls = tagObj.prop('class');
                switch (each_tag.type) {
                    case 'text':
                    case 'script':
                        break;
                    case 'tag':
                        this._parse_section_tag(url, $, each_tag, result);
                        break;
                    default:
                        {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                }
            }
        }
    }
    _parse_homeContent_sections(url, $, sections, result) {
        for (let idx = 0; idx < sections.length; idx++) {
            let each_tag_found = sections.get(idx);
            for (let each_tag of each_tag_found.children) {
                let tagObj = $(each_tag);
                let cls = tagObj.prop('class');
                switch (each_tag.type) {
                    case 'text':
                    case 'script':
                        break;
                    case 'tag':
                        if (/cookies/i.test(cls)) {
                        }
                        else if (/main/i.test(cls)) {
                            this._parse_homeContent_childs(url, $, each_tag, result);
                        }
                        else {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #2.a")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                    default:
                        {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #2.b")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                }
            }
        }
    }
    _parse_section_tag(url, $, tag, result) {
        const cls = $(tag).prop('class');
        const dataArticle_value = $(tag).prop('data-article');
        const isDataArticle = (typeof (dataArticle_value) != 'undefined' && dataArticle_value != null);
        switch (tag.name) {
            case 'div':
                if (/header/i.test(cls)) {
                    result.push(ContentTitle_central_1.ContentTitle_central.init_central(url, $, tag));
                }
                else if (isDataArticle == true) {
                    this._parse_data_article(url, $, tag, result);
                }
                else {
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #3")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
                }
                break;
            default:
                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #4")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
                break;
        }
    }
    _parse_data_article(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text':
                    break;
                case 'tag':
                    if (/placement/i.test(cls)) {
                        this._parse_data_article(url, $, each_tag, result);
                    }
                    else if (/row/i.test(cls)) {
                        this._parse_data_article(url, $, each_tag, result);
                    }
                    else if (/col-(sm|md)/.test(cls)) {
                        this._parse_data_article_column(url, $, each_tag, result);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #6")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_data_article_column(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text':
                    break;
                case 'tag':
                    if (/rte-content/i.test(cls)) {
                        result.push(ContentArticle_1.ContentArticle.init(url, $, each_tag));
                    }
                    else if (/price-catcher-container/i.test(cls)) {
                        this._parse_price_catcher_container(url, $, each_tag, result);
                    }
                    else if (/module-tabs/i.test(cls)) {
                        result.push(ContentTabGroup_1.ContentTabGroup.init(url, $, each_tag));
                    }
                    else if (/teaser/i.test(cls)) {
                        result.push(ContentTeaser_1.ContentTeaser.init(url, $, each_tag));
                    }
                    else if (/module-image/i.test(cls)) {
                        result.push(ContentImage_1.ContentImage.init_moduleImage(url, $, each_tag));
                    }
                    else if (/section-subtitle/i.test(cls)) {
                        result.push(ContentArticle_1.ContentArticle.init(url, $, each_tag.parent));
                    }
                    else if (/module-collapsible/i.test(cls)) {
                        this._parse_module_collapsible(url, $, each_tag, result);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #7")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #8")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_price_catcher_container(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/inner/i.test(cls)) {
                        result.push(ContentArticle_1.ContentArticle.init(url, $, tag));
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #10")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #11")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_module_collapsible(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/panel-group/i.test(cls)) {
                        this._parse_module_collapsible_panel_group(url, $, each_tag, result);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #12")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #13")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
                    }
                    break;
            }
        }
    }
    _parse_module_collapsible_panel_group(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/panel/i.test(cls)) {
                        this._parse_module_collapsible_panel(url, $, each_tag, result);
                    }
                    else if (/a/i.test(each_tag.name)) {
                    }
                    else if (/btn/i.test(cls)) {
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #14")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #15")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
                    }
                    break;
            }
        }
    }
    _parse_module_collapsible_panel(url, $, tag, result) {
        let title = null;
        let articles = [];
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    if (/panel-heading/i.test(cls)) {
                        let heading = ContentArticle_1.ContentArticle.init(url, $, each_tag);
                        for (let each_block of heading.data) {
                            if (/title/i.test(each_block.type)) {
                                title = each_block.text;
                            }
                        }
                    }
                    else if (/panel-collapse/i.test(cls)) {
                        let panel_content = tagObj.find('.rte-content');
                        if (panel_content.length > 0) {
                            articles.push(ContentArticle_1.ContentArticle.init(url, $, panel_content[0]));
                        }
                        else {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Error: Panel does not contains .rte-content")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #16")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #17")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
                    }
                    break;
            }
        }
        if (typeof (title) == 'undefined' || title == null || title.length <= 0) {
            console.log(colors.red(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: Error: <title> is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`));
            process.exit(1);
        }
        if (articles.length <= 0) {
            console.log(colors.red(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: Error: <article> not found or is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`));
            process.exit(1);
        }
        result.push(new ContentAccordeon_1.ContentAccordeon(title, articles));
    }
    _parse_homeContent_childs(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #18")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #19")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
                    }
                    break;
            }
        }
    }
}
exports.TextExtractCentral = TextExtractCentral;
