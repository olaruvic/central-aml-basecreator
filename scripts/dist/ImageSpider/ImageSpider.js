"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CleanUpFolders_1 = require("../CleanUpFolders/CleanUpFolders");
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const colors = require("colors");
const s2f = require("../StringToFile/stringToFile");
let needle = require('needle');
let cheerio = require('cheerio');
let _url = require('url');
const CreateFolders_1 = require("../CreateFolders/CreateFolders");
require("../String-extensions");
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
    constructor(image_target_path, json_data, ignore_generali_domains) {
        this.url_list = [];
        this.image_dictionary = {};
        this.downloadImages_callback = null;
        this.downloadCssImage_callback = null;
        this.json_data = json_data;
        this.target_path = image_target_path;
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
                    _this._html_getImageSources(url_data, body, function () { _this._read_next_url(); });
                }
                else {
                    _this._read_next_url();
                }
            });
        }
        else {
            let cleanUpFolders = new CleanUpFolders_1.CleanUpFolders(this.target_path);
            cleanUpFolders.run('css', path.join(this.json_data.url, '_global_css_images'), 5);
            cleanUpFolders.cleanUp_emptyFolders('css');
            cleanUpFolders.run('images', path.join(this.json_data.url, '_global_images'), 5);
            cleanUpFolders.cleanUp_emptyFolders('images');
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
    _html_getImageSources(url_data, html_body, callback = null) {
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
        $('img').each(function (i, e) {
            if (($(this).attr())['data-responsive-image']) {
                let img_src = JSON.parse(($(this).attr())['data-responsive-image']);
                for (let each_ratio in img_src) {
                    let ratio_data = img_src[each_ratio];
                    for (let each_size in ratio_data) {
                        let orig_src = ratio_data[each_size];
                        let src_name_ext = `---${each_ratio}---${each_size}`;
                        _this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.img, null, url_data.url, '.img ', orig_src, src_name_ext, origin, target_path, 'images', __tmp_dirName));
                    }
                }
            }
            else if ($(this).attr().src.trim().length > 0) {
                _this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.img, null, url_data.url, '.img ', $(this).attr().src, null, origin, target_path, 'images', __tmp_dirName));
            }
            else {
                console.log(colors.bgRed("--------" + i + " :: UNKNOWN.img: "), $(this).attr());
            }
        });
        $('link').each(function (i, e) {
            let attrs = $(this).attr();
            if (attrs.rel.trim().toLowerCase() == 'stylesheet' && attrs.href.length > 0) {
                let href = _this._checkAndFormatLocalURL(attrs.href, origin);
                if (href != null) {
                    _this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.css, href, url_data.url, '.link', null, null, origin, target_path, null, __tmp_dirName));
                }
                else {
                    console.log(colors.bgRed("--------" + i + " :: external URL: "), attrs);
                }
            }
            else if (attrs.rel.trim().toLowerCase() == 'canonical' && attrs.href.length > 0) {
            }
            else {
                console.log(colors.bgRed("--------" + i + " :: UNKNOWN.css: "), attrs);
            }
        });
        this.downloadImages_enum_idx = 0;
        this.downloadImages_callback = callback;
        this._download_next_image();
    }
    _download_next_image() {
        if (this.downloadImages_enum_idx < this.downloadImages_list.length) {
            let _this = this;
            let nextImg = this.downloadImages_list[this.downloadImages_enum_idx];
            this.downloadImages_enum_idx += 1;
            switch (nextImg.source_type) {
                case ImageDownloadDataSourceType.img:
                    this._copyImage(nextImg.source_url, nextImg.source_type_str, nextImg.raw_image_url, nextImg.image_name_ext, nextImg.origin, nextImg.target_path, nextImg.target_path_subdir, nextImg.tmp_dirName, function () {
                        _this._download_next_image();
                    });
                    break;
                case ImageDownloadDataSourceType.css:
                    needle.get(nextImg.css_file_url, function (err, resp, body) {
                        if (!err) {
                            _this._css_getImageSources(nextImg.source_url, nextImg.source_type_str, body, nextImg.origin, nextImg.target_path, nextImg.tmp_dirName, function () {
                                _this._download_next_image();
                            });
                        }
                        else {
                            console.log(colors.bgRed.white('############################## Error downloading css file'));
                            console.log(err);
                            if (typeof (_this._download_next_image) != 'undefined' && _this._download_next_image != null) {
                                _this._download_next_image();
                            }
                        }
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
    _css_getImageSources(source_url, source_type, body, origin, target_path, __tmp_dirName, callback) {
        const regex = /((https?:\/\/|\/)[^\s\'\"\)]+\.(png|jpg|gif))/gm;
        let m;
        let _this = this;
        this.downloadCssImage_list = [];
        while ((m = regex.exec(body)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            if (m[0].match(/(\/\*|\/\/)/i) == null) {
                this.downloadCssImage_list.push(new ImageDownloadData(ImageDownloadDataSourceType.css, null, source_url, source_type, m[1], null, origin, target_path, 'css', __tmp_dirName));
            }
        }
        if (this.downloadCssImage_list.length > 0) {
            this.downloadCssImage_enum_idx = 0;
            this.downloadCssImage_callback = callback;
            this._download_next_css_image();
        }
        else {
            if (typeof (callback) != 'undefined' && callback != null) {
                callback();
            }
        }
    }
    _download_next_css_image() {
        if (this.downloadCssImage_enum_idx < this.downloadCssImage_list.length) {
            let _this = this;
            let nextImg = this.downloadCssImage_list[this.downloadCssImage_enum_idx];
            this.downloadCssImage_enum_idx += 1;
            this._copyImage(nextImg.source_url, nextImg.source_type_str, nextImg.raw_image_url, nextImg.image_name_ext, nextImg.origin, nextImg.target_path, nextImg.target_path_subdir, nextImg.tmp_dirName, function () {
                _this._download_next_css_image();
            });
        }
        else {
            if (typeof (this.downloadCssImage_callback) != 'undefined' && this.downloadCssImage_callback != null) {
                this.downloadCssImage_callback();
            }
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
    _copyImage(source_url, source_type, raw_image_url, image_name_ext, origin, target_path, target_path_subdir, __tmp_dirName, callback) {
        let _this = this;
        let imageURL = this._checkAndFormatLocalURL(raw_image_url, origin);
        let comps = path.parse(imageURL);
        let image_fname = decodeURIComponent(comps.base);
        if (typeof (image_name_ext) != 'undefined' && image_name_ext != null) {
            let comps_fname = path.parse(image_fname);
            image_fname = comps_fname.name + '---' + image_name_ext + comps_fname.ext;
        }
        let full_targetPath = (typeof (target_path_subdir) != 'undefined' && target_path_subdir != null && target_path_subdir.trim().length > 0
            ? path.join(target_path, target_path_subdir)
            : target_path);
        if (fs.existsSync(full_targetPath) == false) {
            fse.ensureDirSync(full_targetPath);
        }
        let image_targetPath = path.join(full_targetPath, image_fname);
        if (this.image_dictionary[image_targetPath] != null) {
            if (typeof (callback) != 'undefined' && callback != null) {
                callback();
            }
            return;
        }
        this.image_dictionary[image_targetPath] = 1;
        needle.get(imageURL, { output: image_targetPath }, function (err, resp, body) {
            console.log(`-------- source${colors.yellow(source_type)} =`, colors.grey(imageURL));
            if (!err) {
                let addSubDir = (typeof (target_path_subdir) != 'undefined' && target_path_subdir != null && target_path_subdir.trim().length > 0
                    ? path.sep + target_path_subdir
                    : '');
                console.log(`         target${colors.yellow(source_type)} = ${colors.green(_this.target_path + path.sep)}${colors.green.bold(__tmp_dirName)}${colors.cyan(addSubDir)}${colors.green(path.sep + image_fname)}`);
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
