"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const fs = require('fs');
const path = require('path');
const root = require('../../../root');
const needle = require('needle');
const _url = require('url');
const ContentTitle_1 = require("./data_objects/ContentTitle");
const ContentArticle_1 = require("./data_objects/ContentArticle");
const ContentImage_1 = require("./data_objects/ContentImage");
const ContentAccordeon_1 = require("./data_objects/ContentAccordeon");
const ContentIFrame_1 = require("./data_objects/ContentIFrame");
const Debug_1 = require("../Debug/Debug");
const pdf = require('pdf-parse');
const glob = require("glob");
const cheerio = require('cheerio');
class TextExtract {
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
        this._parse_sections(url, $, $('section'), result);
        console.log("------------------------------------------------");
        console.dir(result, { colors: true, depth: 100 });
        console.log("------------------------------------------------");
        console.log(JSON.stringify(result));
    }
    _parse_sections(url, $, sections, result) {
        let _this = this;
        sections.each(function (i, elem) {
            let cls = $(this).prop('class');
            if (typeof (cls) == 'undefined' || cls == null || cls.trim().length <= 0) {
                for (let each_tag of elem.children) {
                    let tagObj = $(each_tag);
                    switch (each_tag.type) {
                        case 'text':
                        case 'script':
                            break;
                        case 'tag':
                            _this._parse_seaction_tag(url, $, each_tag, result);
                            break;
                        default:
                            console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
                            break;
                    }
                }
            }
        });
    }
    _parse_seaction_tag(url, $, tag, result) {
        switch (tag.name) {
            case 'header':
                result.push(ContentTitle_1.ContentTitle.init($, tag));
                break;
            case 'div':
                if (/am-rt/i.test($(tag).prop('class'))) {
                    result.push(ContentArticle_1.ContentArticle.init(url, $, tag));
                }
                else if (/accordiongrp/i.test($(tag).prop('class'))) {
                    this._parse_accordeon_group(url, $, tag, result);
                }
                else {
                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
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
                break;
            default:
                console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Unknown #3")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
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
        let article = null;
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
                            $('.am-rt', each).each((i, element) => {
                                let tmp_res = [];
                                _this._parse_seaction_tag(url, $, element, tmp_res);
                                if (tmp_res.length != 1) {
                                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Error: No or too many article(s)!")} ${colors.red(` num=${tmp_res.length}`)} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
                                    process.exit(1);
                                }
                                let tmp_article = tmp_res[0];
                                if (tmp_article instanceof ContentArticle_1.ContentArticle) {
                                    article = tmp_article;
                                }
                                else {
                                    console.log(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: ${colors.red("Error: <tmp_res> contains unknwon Objects!")}`);
                                    console.dir(tmp_res, { colors: true });
                                    process.exit(1);
                                }
                            });
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
        if (typeof (article) == 'undefined' || article == null) {
            console.log(colors.red(`${colors.magenta(new Debug_1.Debug().shortInfo())} :: Error: <article> not found or is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`));
            process.exit(1);
        }
        result.push(new ContentAccordeon_1.ContentAccordeon(title, article));
    }
}
exports.TextExtract = TextExtract;
