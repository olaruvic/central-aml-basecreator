"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const root = require("../../../root");
const colors = require("colors");
const Debug_1 = require("../Debug/Debug");
const f2s = require("../FileToString/fileToString");
const s2f = require("../StringToFile/stringToFile");
let needle = require('needle');
let cheerio = require('cheerio');
let _url = require('url');
require("../String-extensions");
const CreateFolders_1 = require("../CreateFolders/CreateFolders");
const TextExtractAMV_1 = require("../TextExtract/TextExtractAMV");
const TextExtractCentral_1 = require("./../TextExtract/TextExtractCentral");
const EMPTY = '--empty--';
var ImageDownloadDataSourceType;
(function (ImageDownloadDataSourceType) {
    ImageDownloadDataSourceType[ImageDownloadDataSourceType["img"] = 1] = "img";
    ImageDownloadDataSourceType[ImageDownloadDataSourceType["css"] = 2] = "css";
})(ImageDownloadDataSourceType || (ImageDownloadDataSourceType = {}));
class ImageDownloadData {
    constructor(sourceType, css_file_url, source_url, source_type_str, raw_image_url, image_name_ext, origin, global_target_path, target_path, target_path_subdir, tmp_dirName) {
        this.isGlobal = false;
        this.source_type = sourceType;
        this.css_file_url = css_file_url;
        this.source_url = source_url;
        this.source_type_str = source_type_str;
        this.raw_image_url = raw_image_url;
        this.image_name_ext = image_name_ext;
        this.origin = origin;
        this.global_target_path = global_target_path;
        this.target_path = target_path;
        this.target_path_subdir = target_path_subdir;
        this.tmp_dirName = tmp_dirName;
    }
}
class SitePoolData {
    constructor(url_data, images) {
        this.url_data = url_data;
        this.images = images;
    }
}
class ImagePoolData {
    constructor(url_data, site_url, image, download) {
        this.url_data = url_data;
        this.sites = [site_url];
        this.image = image;
        this.download = download;
    }
    addSite(site_url) {
        this.sites.push(site_url);
    }
}
class ImageSpider {
    constructor(image_target_path, json_data, cleanup_images) {
        this.url_list = [];
        this.downloadImages_callback = null;
        this.target_root_path = image_target_path;
        this.json_data = json_data;
        this.site_pool = {};
        this.image_pool = {};
        this.url_list = this._create_url_list(image_target_path, json_data, true);
        if (typeof (image_target_path) == 'undefined' || image_target_path == null || image_target_path == '') {
            console.log(colors.bgRed.white.bold(`Error: Parameter ${colors.underline('image_target_path')} required!\n`));
            process.exit(1);
        }
        if (fs.existsSync(this.target_root_path) == false) {
            fse.ensureDirSync(this.target_root_path);
        }
    }
    run() {
        console.log(colors.red.bold("######################################################### INFO | processing URLs"));
        this.image_pool = {};
        this.site_enum_idx = 0;
        this._read_next_url();
    }
    _getTargetRootPath(url) {
        let comps = new _url.URL(url);
        let root_path = path.join(this.target_root_path, comps.host);
        return root_path;
    }
    _getGlobalImageTargetPath(url) {
        let global_path = path.join(this._getTargetRootPath(url), '_global_images');
        return global_path;
    }
    _create_url_list(target_path, json, ignore_generali_domains) {
        let url2path = CreateFolders_1.CreateFolders.url2path(target_path, json, false);
        let result = [];
        let domain = {};
        for (let each_path in url2path) {
            let page = url2path[each_path];
            let target_root_path = this._getTargetRootPath(page.url);
            let global_images_targetPath = this._getGlobalImageTargetPath(page.url);
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
                result.push({ target_root: target_root_path, target_path: each_path, global_images: global_images_targetPath, url: url, page: page });
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
            this.downloadImages_list = this._create_downloadImages_list();
            let url_data = this.url_list[0];
            this._create_imageDescriptionOverview_htmlFile(url_data);
            this._create_imageOverview_htmlFile(url_data);
            this.downloadImages_enum_idx = 0;
            this.downloadImages_callback = function () {
            };
            console.log(colors.red.bold("######################################################### INFO | downloading images"));
            this._download_next_image();
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
        let json;
        if (/amv.de/i.test(origin)) {
            let es = new TextExtractAMV_1.TextExtractAMV("");
            json = es.extractFromHtmlBody(url_data.url, html_body, true, true, true);
        }
        else if (/central.de/i.test(origin)) {
            let es = new TextExtractCentral_1.TextExtractCentral("");
            json = es.extractFromHtmlBody(url_data.url, html_body, true, true, true);
        }
        else {
            console.log(`${new Debug_1.Debug().shortInfo()} :: Error: UNKNOWN host ${origin.bold}!`.red);
            process.exit(1);
        }
        let site_images = this._extractImages(json);
        this._insertInto_image_pool(site_images, url_data, origin, target_path, __tmp_dirName, url_data.global_images);
        this._insertInto_site_pool(url_data, site_images);
        if (callback != null) {
            callback();
        }
    }
    _createSourceURLFile(target_path, url) {
        let contents = `[InternetShortcut]\nURL=${url}\nIconIndex=0`;
        let fpath = path.join(target_path, 'source.url');
        if (fs.existsSync(target_path) == false) {
            fse.ensureDirSync(target_path);
        }
        s2f.stringToFile(fpath, contents, false);
    }
    _extractImages(json_array) {
        let images = [];
        for (let each of json_array) {
            let img_array = each.getImages();
            images = images.concat(img_array);
        }
        return images;
    }
    _insertInto_image_pool(site_images, url_data, origin, target_path, tmp_dirName, global_target_path) {
        for (let each_imgObj of site_images) {
            let img_array = each_imgObj.url;
            for (let each_imgUrl of img_array) {
                let poolObj = this.image_pool[each_imgUrl];
                if (poolObj == null) {
                    let downloadData = new ImageDownloadData(ImageDownloadDataSourceType.img, null, url_data.url, '.img ', each_imgUrl, null, origin, global_target_path, target_path, 'images', tmp_dirName);
                    poolObj = new ImagePoolData(url_data, url_data.url, each_imgObj, downloadData);
                    this.image_pool[each_imgUrl] = poolObj;
                }
                else {
                    console.log(`INFO: Add new site to image pool: ${each_imgUrl.bgBlack.yellow}`.bgYellow.black);
                    poolObj.addSite(url_data.url);
                }
            }
        }
    }
    _insertInto_site_pool(url_data, site_images) {
        let poolObj = this.site_pool[url_data.url];
        if (poolObj == null) {
            this.site_pool[url_data.url] = new SitePoolData(url_data, site_images);
        }
        else {
            console.log(`WARNING: Duplicate site '${url_data.url}' found!`.bgRed.white);
        }
    }
    _create_downloadImages_list() {
        console.log(`######################################################### INFO | _create_downloadImages_list`.red.bold);
        let result = [];
        for (let key in this.image_pool) {
            let data = this.image_pool[key];
            let download_data = data.download;
            if (data.sites.length > 1) {
                download_data.isGlobal = true;
                console.log("global: ", download_data.raw_image_url.magenta.bold);
            }
            result.push(download_data);
        }
        return result;
    }
    _getPageData(source_url) {
        return this.site_pool[source_url].url_data.page;
    }
    _create_imageDescriptionOverview_htmlFile(url_data) {
        let tmpl_path = path.join(root(), 'scripts', 'ts', 'ImageSpider', 'templates', 'img_description_overview');
        let listEntry_htmlBody = f2s.fileToString(path.join(tmpl_path, 'list_row.tmpl.html'));
        let indexTmpl_htmlBody = f2s.fileToString(path.join(tmpl_path, 'index.tmpl.html'));
        let ordered_list = [];
        for (let eachImgKey in this.image_pool) {
            let eachImgData = this.image_pool[eachImgKey];
            ordered_list.push(eachImgData);
        }
        ordered_list.sort((a, b) => {
            let a_fpath = this._get_imgTargetFilePath(a.download);
            let b_fpath = this._get_imgTargetFilePath(b.download);
            return (a_fpath > b_fpath
                ? 1
                : (a_fpath == b_fpath
                    ? (a_fpath.length > b_fpath.length ? 1 : -1)
                    : -1));
        });
        let html_content = "";
        let num_images = Object.keys(this.image_pool).length;
        let img_idx = 0;
        for (let eachImgData of ordered_list) {
            img_idx++;
            let html_entry = listEntry_htmlBody + "";
            let downloadData = eachImgData.download;
            let tmp_root_path = url_data.target_root;
            let img_fpath = this._get_imgTargetFilePath(downloadData);
            img_fpath = img_fpath.replace(tmp_root_path, '');
            if (/^[\/\\]/im.test(img_fpath)) {
                img_fpath = img_fpath.substring(1);
            }
            html_entry = html_entry.replace(/{%\s*idx\s*%}/ig, img_idx.toString());
            html_entry = html_entry.replace(/{%\s*url\s*%}/ig, `<a href="${img_fpath}" target="_blank">${img_fpath}</a>`);
            let alt_tag = eachImgData.image.alt;
            let title_tag = eachImgData.image.title;
            let alt_value = (typeof (alt_tag) != 'undefined' && alt_tag != null && alt_tag.trim().length > 0
                ? alt_tag
                : "");
            let title_value = (typeof (title_tag) != 'undefined' && title_tag != null && title_tag.trim().length > 0
                ? title_tag
                : "");
            html_entry = html_entry.replace(/{%\s*alt\s*%}/ig, alt_value);
            html_entry = html_entry.replace(/{%\s*title\s*%}/ig, title_value);
            html_content += html_entry;
        }
        indexTmpl_htmlBody = indexTmpl_htmlBody.replace(/{%\s*num_entries\s*%}/i, num_images.toString());
        indexTmpl_htmlBody = indexTmpl_htmlBody.replace(/{%\s*img_list\s*%}/i, html_content);
        s2f.stringToFile(path.join(url_data.target_root, 'image_description_overview.html'), indexTmpl_htmlBody, true);
    }
    _create_imageOverview_htmlFile(url_data) {
        let tmpl_path = path.join(root(), 'scripts', 'ts', 'ImageSpider', 'templates', 'img_overview');
        let overviewTmpl_imgBlock = f2s.fileToString(path.join(tmpl_path, 'img_block.tmpl.html'));
        let overviewTmpl_imgDescription = f2s.fileToString(path.join(tmpl_path, 'img_description.tmpl.html'));
        let overviewTmpl_htmlBody = f2s.fileToString(path.join(tmpl_path, 'index.tmpl.html'));
        let html_content = "";
        let num_images = Object.keys(this.image_pool).length;
        let img_idx = 0;
        for (let eachImgKey in this.image_pool) {
            img_idx++;
            let eachImgData = this.image_pool[eachImgKey];
            let downloadData = eachImgData.download;
            let img_urlData = eachImgData.url_data;
            let tmp_root_path = url_data.target_root;
            let img_fpath = this._get_imgTargetFilePath(downloadData);
            img_fpath = img_fpath.replace(tmp_root_path, '');
            if (/^[\/\\]/im.test(img_fpath)) {
                img_fpath = img_fpath.substring(1);
            }
            let img_fpath_comps = path.parse(img_fpath);
            let img_html_block = overviewTmpl_imgBlock.replace(/{%\s*img_path\s*%}/ig, img_fpath);
            img_html_block = img_html_block.replace(/{%\s*img_title\s*%}/ig, `${img_idx} / ${num_images} - ${img_fpath_comps.base} - {%width%}x{%height%}${downloadData.isGlobal ? " (global)" : ""}`);
            img_html_block = img_html_block.replace(/{%\s*img_title_bg\s*%}/ig, (downloadData.isGlobal
                ? 'is-global'
                : ''));
            let img_alt = "";
            let alt_tag = eachImgData.image.alt;
            let title_tag = eachImgData.image.title;
            img_alt += (typeof (alt_tag) != 'undefined' && alt_tag != null && alt_tag.trim().length > 0
                ? overviewTmpl_imgDescription.replace(/{%\s*tag\s*%}/im, 'alt').replace(/{%\s*img_description\s*%}/im, alt_tag)
                : "");
            img_alt += (typeof (title_tag) != 'undefined' && title_tag != null && title_tag.trim().length > 0
                ? overviewTmpl_imgDescription.replace(/{%\s*tag\s*%}/im, 'title').replace(/{%\s*img_description\s*%}/im, title_tag)
                : "");
            if (img_alt.length <= 0) {
                img_alt += overviewTmpl_imgDescription.replace(/{%\s*tag\s*%}/im, 'alt / title').replace(/{%\s*img_description\s*%}/im, "&lt;empty&gt;");
            }
            img_html_block = img_html_block.replace(/{%\s*img_description\s*%}/ig, img_alt);
            let source_pool = {};
            let target_pool = {};
            for (let eachSource of eachImgData.sites) {
                let pageData = this._getPageData(eachSource);
                source_pool[eachSource] = 1;
                target_pool[pageData.url] = pageData.name;
            }
            let sources = "";
            for (let eachSourceKey in source_pool) {
                sources += `<a href="${eachSourceKey}" target="_blank">${eachSourceKey}</a><br/>`;
            }
            img_html_block = img_html_block.replace(/{%\s*img_source\s*%}/ig, sources);
            let targets = "";
            for (let eachTargetUrl in target_pool) {
                let eachTargetName = target_pool[eachTargetUrl];
                targets += `<a href="${eachTargetUrl}" target="_blank">${eachTargetName}</a><br/>`;
            }
            img_html_block = img_html_block.replace(/{%\s*img_target\s*%}/ig, targets);
            html_content += img_html_block;
        }
        overviewTmpl_htmlBody = overviewTmpl_htmlBody.replace(/{%\s*img_blocks\s*%}/ig, html_content);
        s2f.stringToFile(path.join(url_data.target_root, 'image_overview.html'), overviewTmpl_htmlBody, true);
    }
    _download_next_image() {
        if (this.downloadImages_enum_idx < this.downloadImages_list.length) {
            let _this = this;
            let nextImg = this.downloadImages_list[this.downloadImages_enum_idx];
            this.downloadImages_enum_idx += 1;
            switch (nextImg.source_type) {
                case ImageDownloadDataSourceType.img:
                    this._copyImage(nextImg, function () {
                        _this._download_next_image();
                    });
                    break;
                default:
                    {
                        console.log(colors.bgRed.white.bold(`Error: Unknown source type (${nextImg.source_type})!\n`));
                        console.log('nextImage=');
                        console.dir(nextImg, { colors: true });
                        process.exit(1);
                    }
                    break;
            }
        }
        else {
            if (typeof (this.downloadImages_callback) != 'undefined' && this.downloadImages_callback != null) {
                this.downloadImages_callback();
            }
        }
    }
    _checkAndFormatLocalURL(href, origin) {
        let url_obj = new _url.URL(origin);
        let host_name = url_obj.hostname;
        if (href.match(/^https?:\/\//i) != null) {
            if (host_name.match(/www\./i) != null) {
                host_name = host_name.substr(4);
            }
            let regex = new RegExp('^https?:\/\/(www\.)?' + host_name, 'i');
            if (href.match(regex) != null) {
                return href;
            }
            return null;
        }
        let imageURL = origin.replace(/[\/\\]$/i, '') + '/' + href.replace(/^[\/\\]/i, '');
        return imageURL;
    }
    _get_imgTargetPath(downloadData) {
        let full_targetPath = (downloadData.isGlobal == true
            ? downloadData.global_target_path
            : (typeof (downloadData.target_path_subdir) != 'undefined' && downloadData.target_path_subdir != null && downloadData.target_path_subdir.trim().length > 0
                ? path.join(downloadData.target_path, downloadData.target_path_subdir)
                : downloadData.target_path));
        return full_targetPath;
    }
    _get_imgTargetFilePath(downloadData) {
        let img_fpath = this._get_imgTargetPath(downloadData);
        let imageURL = this._checkAndFormatLocalURL(downloadData.raw_image_url, downloadData.origin);
        let comps = path.parse(imageURL);
        let image_fname = decodeURIComponent(comps.base);
        if (typeof (downloadData.image_name_ext) != 'undefined' && downloadData.image_name_ext != null) {
            let comps_fname = path.parse(image_fname);
            image_fname = comps_fname.name + '---' + downloadData.image_name_ext + comps_fname.ext;
        }
        return path.join(img_fpath, image_fname);
    }
    _copyImage(downloadData, callback) {
        let imageURL = this._checkAndFormatLocalURL(downloadData.raw_image_url, downloadData.origin);
        let full_targetPath = this._get_imgTargetPath(downloadData);
        let image_targetPath = this._get_imgTargetFilePath(downloadData);
        if (fs.existsSync(full_targetPath) == false) {
            fse.ensureDirSync(full_targetPath);
        }
        needle.get(imageURL, { output: image_targetPath }, function (err, resp, body) {
            console.log(`-------- source${colors.yellow(downloadData.source_type_str)} =`, colors.grey(imageURL));
            if (!err) {
                console.log(`         target${colors.yellow(downloadData.source_type_str)} = ${colors.green(image_targetPath)}`);
            }
            else {
                console.log(colors.bgRed.white('############################## Error'));
                console.log(err);
            }
            if (typeof (callback) != 'undefined' && callback != null) {
                callback();
            }
        });
    }
}
exports.ImageSpider = ImageSpider;
