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
        this._parse_sections(url, $, $('article'), result);
        console.log(`${new Debug_1.Debug().shortInfo()} :: ${"DEBUG HALT".bold}`.bgRed.white);
        process.exit(1);
        console.log("------------------------------------------------");
        console.dir(result, { colors: true, depth: 100 });
        console.log("------------------------------------------------");
        console.log(JSON.stringify(result));
    }
    _parse_sections(url, $, sections, result) {
        let _this = this;
        sections.each(function (i, elem) {
            console.log("################################################################ _parse_sections".yellow);
            for (let each_tag of elem.children) {
                let tagObj = $(each_tag);
                switch (each_tag.type) {
                    case 'text':
                    case 'script':
                        break;
                    case 'tag':
                        _this._parse_section_tag(url, $, each_tag, result);
                        break;
                    default:
                        {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                }
            }
        });
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
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
                }
                break;
            default:
                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #3")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
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
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #4")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
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
                        this._parse_content_block(url, $, each_tag, result);
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
                    else {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #6")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #7")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_content_block(url, $, tag, result) {
        for (let each_tag of tag.children) {
            const cls = $(each_tag).prop('class');
            const tagObj = $(each_tag);
            switch (each_tag.type) {
                case 'text': break;
                case 'tag':
                    result.push(ContentArticle_1.ContentArticle.init(url, $, tag));
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #8")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
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
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #9")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    const txt_maxLen = 30;
                    const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #10")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    break;
            }
        }
    }
    _parse_accordeon_group(url, $, tag, result) {
        for (let each of tag.children) {
            switch (each.type) {
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    break;
            }
        }
    }
    _parse_accordeon(url, $, tag, result) {
        let _this = this;
        let title = null;
        let article = null;
        for (let each of tag.children) {
            if (each.type == 'tag') {
                switch (each.name) {
                    default:
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                        break;
                }
            }
        }
        if (typeof (title) == 'undefined' || title == null || title.length <= 0) {
            console.log(colors.red(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: Error: <title> is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`));
            process.exit(1);
        }
        if (typeof (article) == 'undefined' || article == null) {
            console.log(colors.red(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: Error: <article> not found or is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`));
            process.exit(1);
        }
        result.push(new ContentAccordeon_1.ContentAccordeon(title, article));
    }
}
exports.TextExtractCentral = TextExtractCentral;
