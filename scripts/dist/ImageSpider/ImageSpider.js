"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CleanUpFolders_1 = require("../CleanUpFolders/CleanUpFolders");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const colors = require("colors");
const Debug_1 = require("../Debug/Debug");
const s2f = require("../StringToFile/stringToFile");
let needle = require('needle');
let cheerio = require('cheerio');
let _url = require('url');
require("../String-extensions");
const CreateFolders_1 = require("../CreateFolders/CreateFolders");
const TextExtractAMV_1 = require("../TextExtract/TextExtractAMV");
const EMPTY = '--empty--';
var ImageDownloadDataSourceType;
(function (ImageDownloadDataSourceType) {
    ImageDownloadDataSourceType[ImageDownloadDataSourceType["img"] = 1] = "img";
    ImageDownloadDataSourceType[ImageDownloadDataSourceType["css"] = 2] = "css";
})(ImageDownloadDataSourceType || (ImageDownloadDataSourceType = {}));
class ImageDownloadData {
    constructor(sourceType, css_file_url, source_url, source_type_str, raw_image_url, image_name_ext, origin, target_path, target_path_subdir, tmp_dirName) {
        this.source_type = sourceType;
        this.css_file_url = css_file_url;
        this.source_url = source_url;
        this.source_type_str = source_type_str;
        this.raw_image_url = raw_image_url;
        this.image_name_ext = image_name_ext;
        this.origin = origin;
        this.target_path = target_path;
        this.target_path_subdir = target_path_subdir;
        this.tmp_dirName = tmp_dirName;
    }
}
class ImageSpider {
    constructor(image_target_path, json_data, cleanup_images) {
        this.url_list = [];
        this.image_dictionary = {};
        this.downloadImages_callback = null;
        this.downloadCssImage_callback = null;
        this.target_path = image_target_path;
        this.json_data = json_data;
        this.cleanup_images = cleanup_images;
        this.url_list = this._create_url_list(image_target_path, json_data, true);
        if (typeof (image_target_path) == 'undefined' || image_target_path == null || image_target_path == '') {
            console.log(colors.bgRed.white.bold(`Error: Parameter ${colors.underline('image_target_path')} required!\n`));
            process.exit(1);
        }
        if (fs.existsSync(this.target_path) == false) {
            fse.ensureDirSync(this.target_path);
        }
    }
    run() {
        console.log(colors.red.bold("######################################################### INFO | processing URLs"));
        this.site_enum_idx = 0;
        this._read_next_url();
    }
    _create_url_list(target_path, json, ignore_generali_domains) {
        let url2path = CreateFolders_1.CreateFolders.url2path(target_path, json, false);
        let result = [];
        let domain = {};
        for (let each_path in url2path) {
            let page = url2path[each_path];
            for (let each_url of page.content.sourceUrl) {
                let url = each_url.trim();
                if (url.length <= 0) {
                    if (domain[EMPTY] == null)
                        domain[EMPTY] = [];
                    domain[EMPTY].push({ path: page.url, page_name: page.name });
                    continue;
                }
                if (!url.endsWith('/'))
                    url += '/';
                let comps = new _url.URL(url);
                if (ignore_generali_domains && /generali/i.test(comps.host)) {
                    continue;
                }
                result.push({ target_path: each_path, url: url, page: page });
                domain[comps.host] = (domain[comps.host] == null ? 1 : (domain[comps.host] + 1));
            }
        }
        console.log(colors.red.bold("######################################################### INFO | number of urls"));
        let max_len = 0;
        for (let host in domain) {
            if (host.length > max_len)
                max_len = host.length;
        }
        for (let host in domain) {
            if (typeof (domain[host]) == 'number') {
                console.log(colors.white.bold(host.padding_right(max_len)), ':', colors.yellow.bold(domain[host].toString().padding_left(3)), 'links');
            }
            else {
                console.log(colors.white.bold(host.padding_right(max_len)), ':', colors.yellow.bold(domain[host].length.toString().padding_left(3)), 'links');
            }
        }
        if (domain[EMPTY].length > 0) {
            console.log(colors.red.bold('\nempty URLs:'));
            max_len = 0;
            for (let each of domain[EMPTY]) {
                if (each.page_name.length > max_len)
                    max_len = each.page_name.length;
            }
            let count = 0;
            for (let each of domain[EMPTY]) {
                count += 1;
                console.log(count.toString().padding_left(4), ':', colors.white.bold(each.page_name.padding_right(max_len)), '=>', colors.gray(each.path));
            }
        }
        return result;
    }
    _read_next_url() {
        let _this = this;
        let timeout = 1;
        setTimeout(() => {
            _this._delayed__read_next_url();
        }, timeout);
    }
    _delayed__read_next_url() {
        const _this = this;
        let url_data = null;
        while (url_data == null && this.site_enum_idx < this.url_list.length) {
            url_data = this.url_list[this.site_enum_idx];
            this.site_enum_idx += 1;
        }
        if (url_data != null) {
            console.log(colors.cyan.bold((this.site_enum_idx <= 0 ? 1 : this.site_enum_idx) + " of " + this.url_list.length), ':', url_data.url);
            needle.get(url_data.url, function (err, res, body) {
                if (!err) {
                    _this._html_processSite(url_data, body, function () { _this._read_next_url(); });
                }
                else {
                    _this._read_next_url();
                }
            });
        }
        else {
            if (this.cleanup_images == true) {
                let cleanUpFolders = new CleanUpFolders_1.CleanUpFolders(this.target_path);
                cleanUpFolders.run('css', path.join(this.json_data.url, '_global_css_images'), 5);
                cleanUpFolders.cleanUp_emptyFolders('css');
                cleanUpFolders.run('images', path.join(this.json_data.url, '_global_images'), 5);
                cleanUpFolders.cleanUp_emptyFolders('images');
            }
        }
    }
    _html_processSite(url_data, html_body, callback = null) {
        const $ = cheerio.load(html_body, {});
        let _this = this;
        let url_obj = new _url.URL(url_data.url);
        let origin = url_obj.origin;
        let __tmp_host = url_obj.host.replace(/\./ig, '_');
        let __tmp_dirName = url_obj.pathname.replace(/^(\/|\\)/ig, '').replace(/(\/|\\)$/ig, '').replace(/(\/|\\)/ig, '---').replace(/\./ig, '_');
        let __tmp_target_dirName = __tmp_host + '---' + __tmp_dirName;
        let target_path = path.join(url_data.target_path, '_content', __tmp_target_dirName);
        this._createSourceURLFile(target_path, url_data.url);
        this.downloadImages_list = [];
        if (/amv.de/i.test(origin)) {
            let es = new TextExtractAMV_1.TextExtractAMV("");
            let json = es.extractFromHtmlBody(url_data.url, html_body, true, true, true);
            this._extractImages(json, this.downloadImages_list);
            console.log(`${new Debug_1.Debug().shortInfo()} :: ${"DEBUG HALT".bold}`.bgRed.white);
            process.exit(1);
        }
        else {
            console.log(`${new Debug_1.Debug().shortInfo()} :: Error: UNKNOWN host ${origin.bold}!`.red);
            process.exit(1);
        }
    }
    _createSourceURLFile(target_path, url) {
        let contents = `[InternetShortcut]\nURL=${url}\nIconIndex=0`;
        let fpath = path.join(target_path, 'source.url');
        if (fs.existsSync(target_path) == false) {
            fse.ensureDirSync(target_path);
        }
        s2f.stringToFile(fpath, contents, true);
    }
    _extractImages(json_array, result) {
        for (let each of json_array) {
            let img_array = each.getImages();
            console.log(each.constructor.name, img_array.length);
            result = result.concat(img_array);
        }
        console.dir(result, { colors: true });
    }
}
exports.ImageSpider = ImageSpider;
