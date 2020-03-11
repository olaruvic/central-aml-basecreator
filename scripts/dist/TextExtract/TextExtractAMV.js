"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const fs = require('fs');
const path = require('path');
const root = require('../../../root');
const needle = require('needle');
const _url = require('url');
const Debug_1 = require("../Debug/Debug");
const ContentTitle_amv_1 = require("./data_objects/ContentTitle_amv");
const ContentArticle_1 = require("./data_objects/ContentArticle");
const ContentImage_1 = require("./data_objects/ContentImage");
const ContentAccordeon_1 = require("./data_objects/ContentAccordeon");
const ContentIFrame_1 = require("./data_objects/ContentIFrame");
const ContentArticleDataParagraph_1 = require("./data_objects/ContentArticleDataParagraph");
const ContentTeaser_amv_1 = require("./data_objects/ContentTeaser_amv");
const cheerio = require('cheerio');
class TextExtractAMV {
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
    extractFromUrl(url, log_ifFound, log_ifNotFound, log_error, callback) {
        this._log_ifFound = log_ifFound;
        this._log_ifNotFound = log_ifNotFound;
        this._log_error = log_error;
        let _this = this;
        needle.get(url, function (err, res, body) {
            if (!err) {
                const current_url = _this._normalizeUrl(url);
                _this._extractText(current_url, body, callback);
            }
            else {
                if (_this._log_error == true) {
                    console.log(colors.bgRed.white('############ error'));
                    console.dir(err, { colors: true, depth: 10 });
                }
            }
        });
    }
    extractFromHtmlBody(url, html_body, log_ifFound, log_ifNotFound, log_error) {
        this._log_ifFound = log_ifFound;
        this._log_ifNotFound = log_ifNotFound;
        this._log_error = log_error;
        const current_url = this._normalizeUrl(url);
        return this._extractText(current_url, html_body);
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
                    if (_this._log_error == true) {
                        console.log(colors.bgRed.white('############ error'));
                        console.dir(err, { colors: true, depth: 10 });
                    }
                    _this._404_notFound += 1;
                    _this._read_next_url(callback);
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
        this._parse_head_image(url, $, $('#am-pagevisual'), result);
        this._parse_sections(url, $, $('.ym-col1 .ym-cbox'), result);
        if (callback) {
            callback(result);
        }
        return result;
    }
    _parse_head_image(url, $, head_image_section, result) {
        for (let idx = 0; idx < head_image_section.length; idx++) {
            let each_tag_found = head_image_section.get(idx);
            for (let each_tag of each_tag_found.children) {
                let tagObj = $(each_tag);
                let cls = tagObj.prop('class');
                switch (each_tag.type) {
                    case 'text':
                        break;
                    case 'tag':
                        if (/img/i.test(tagObj)) {
                            result.push(ContentImage_1.ContentImage.init(url, $, each_tag));
                        }
                        else {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1000")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                    default:
                        {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1001")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                }
            }
        }
    }
    _parse_sections(url, $, sections, result) {
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
                        if (/section/i.test(each_tag.name)) {
                            this._parse_section(url, $, each_tag, result);
                        }
                        else if (/footer/i.test(each_tag.name)) {
                        }
                        else {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG #1.a")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                    default:
                        {
                            const txt_maxLen = 30;
                            const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1.b")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                        }
                        break;
                }
            }
        }
    }
    _parse_section(url, $, tag, result) {
        for (let each of tag.children) {
            switch (each.type) {
                case 'text':
                case 'script':
                    break;
                case 'tag':
                    this._parse_section_tag(url, $, each, result);
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1.c")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    break;
            }
        }
    }
    _parse_section_tag(url, $, tag, result) {
        let tagObj = $(tag);
        let tag_id = tagObj.prop('id');
        let cls = tagObj.prop('class');
        switch (tag.name) {
            case 'header':
                result.push(ContentTitle_amv_1.ContentTitle_amv.init($, tag));
                break;
            case 'div':
                if (/am-rt/i.test(cls)) {
                    result.push(ContentArticle_1.ContentArticle.init(url, $, tag));
                }
                else if (/accordiongrp/i.test(cls)) {
                    this._parse_accordeon_group(url, $, tag, result);
                }
                else if (/am-content-/i.test(cls)) {
                    this._parse_teaser_group(url, $, tag, result);
                }
                else if ((typeof (tag_id) != 'undefined' && tag_id != null && tag_id.trim().length > 0)
                    || ((typeof (tag_id) == 'undefined' || tag_id == null) && (typeof (cls) == 'undefined' || cls == null))) {
                }
                else {
                    const txt_maxLen = 30;
                    const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${tag.type}] id=[${tag_id}] name=[${tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                }
                break;
            case 'img':
                result.push(ContentImage_1.ContentImage.init(url, $, tag));
                break;
            case 'iframe':
                result.push(ContentIFrame_1.ContentIFrame.init(url, $, tag));
                break;
            case 'a':
            case 'nav':
            case 'link':
                break;
            case 'section':
                break;
            default:
                {
                    const txt_maxLen = 30;
                    const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #3")} :: type=[${tag.type}] name=[${tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                }
                break;
        }
    }
    _parse_accordeon_group(url, $, tag, result) {
        for (let each of tag.children) {
            switch (each.type) {
                case 'text': break;
                case 'tag':
                    switch (each.name) {
                        case 'article':
                            this._parse_accordeon(url, $, each, result);
                            break;
                        case 'div':
                            if (/accordion-close/i.test($(each).prop('class'))) {
                            }
                            else {
                                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                            }
                            break;
                        default:
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                            break;
                    }
                    break;
                default:
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                    break;
            }
        }
    }
    _parse_accordeon(url, $, tag, result) {
        let _this = this;
        let title = null;
        let articles = [];
        for (let each of tag.children) {
            if (each.type == 'tag') {
                switch (each.name) {
                    case 'a':
                        let headers = $('header', each);
                        if (headers.length > 0) {
                            title = $(headers[0]).text().trim();
                        }
                        break;
                    case 'div':
                        if (/am-accordion-cnt-wrp/i.test($(each).prop('class'))) {
                            this._parse_accordeon_cntWrp(url, $, each, articles);
                        }
                        else {
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown DIV")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                        }
                        break;
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
        result.push(new ContentAccordeon_1.ContentAccordeon(title, articles));
    }
    _parse_accordeon_cntWrp(url, $, tag, result) {
        for (let each of tag.children) {
            let tagObj = $(each);
            let cls = tagObj.prop('class');
            switch (each.type) {
                case 'text': break;
                case 'tag':
                    if (/am-accordion-cnt/i.test(cls)) {
                        this._parse_accordeon_cnt(url, $, each, result);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #6 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #7")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_accordeon_cnt(url, $, tag, result) {
        let hasInteractiveModuleHeader = false;
        {
            const txt_maxLen = 30;
            const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
        }
        for (let each of tag.children) {
            let tagObj = $(each);
            let cls = tagObj.prop('class');
            switch (each.type) {
                case 'text':
                    break;
                case 'script':
                    hasInteractiveModuleHeader = true;
                    break;
                case 'tag':
                    let tag_id = tagObj.prop('id');
                    if (/link/i.test(each.name)) {
                        hasInteractiveModuleHeader = true;
                    }
                    else if (/div/i.test(each.name) && (hasInteractiveModuleHeader == true)) {
                        hasInteractiveModuleHeader = false;
                    }
                    else if (/am-rt/i.test(cls)) {
                        hasInteractiveModuleHeader = false;
                        result.push(ContentArticle_1.ContentArticle.init(url, $, each));
                    }
                    else if (/p/i.test(each.name)) {
                        hasInteractiveModuleHeader = false;
                        let p = ContentArticleDataParagraph_1.ContentArticleDataParagraph.init(url, $, each, false);
                        if (p.textComponents.length > 0) {
                            let article = new ContentArticle_1.ContentArticle();
                            article.data.push(p);
                            result.push(article);
                        }
                    }
                    else {
                        hasInteractiveModuleHeader = false;
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #8 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        hasInteractiveModuleHeader = false;
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #9")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_teaser_group(url, $, tag, result) {
        for (let each of tag.children) {
            let tagObj = $(each);
            let cls = tagObj.prop('class');
            switch (each.type) {
                case 'text': break;
                case 'tag':
                    if (/am-content-teaser-link/i.test(cls)) {
                        this._parse_teaser(url, $, each, result);
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #10 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #11")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
    _parse_teaser(url, $, tag, result) {
        for (let each of tag.children) {
            let tagObj = $(each);
            let cls = tagObj.prop('class');
            switch (each.type) {
                case 'text': break;
                case 'tag':
                    if (/am-content-teaser/i.test(cls)) {
                        result.push(ContentTeaser_amv_1.ContentTeaser_amv.init_amv(url, $, each));
                    }
                    else {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #12 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
                default:
                    {
                        const txt_maxLen = 30;
                        const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
                        console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #13")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length > txt_maxLen ? "..." : ""}]`);
                    }
                    break;
            }
        }
    }
}
exports.TextExtractAMV = TextExtractAMV;
