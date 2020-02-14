"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors");
const path = require("path");
const JSON2Array_1 = require("../JSON2Array/JSON2Array");
const fse = require("fs-extra");
const URL = require("url");
require("../String-extensions");
class CreateFolders {
    constructor() { }
    static exec(target_path, json) {
        let json2arr = new JSON2Array_1.JSON2Array(json, false);
        let cf = new CreateFolders();
        cf._createFolders(target_path, json2arr, true, true);
        if (json2arr.error.length > 0) {
            console.log(colors.red.bold("---------------------------------------------- Fehlerhafte Einträge"));
            for (let each of json2arr.error) {
                console.log(` • ${colors.red(each.url)} => ${colors.red.bold(each.page.name)}${' | ' + (each.page.notes.trim().length > 0 ? each.page.notes : 'no notes')}`);
            }
            console.log();
        }
    }
    static url2path(target_path, json) {
        let json2arr = new JSON2Array_1.JSON2Array(json, false);
        let cf = new CreateFolders();
        return cf._createFolders(target_path, json2arr, true, false);
    }
    _createFolders(target_path, json2arr, log, createFolders) {
        let folder_array = json2arr.array;
        let count = 0;
        let url2path = {};
        for (let each of folder_array) {
            count += 1;
            let dir = '';
            if (each.isVanityUrl) {
                let comps_url = URL.parse(each.url);
                let comps = URL.parse(each.vanity);
                dir = path.join(target_path, comps_url.host, 'vanity-urls', comps.host + comps.pathname);
                if (!dir.endsWith(path.sep))
                    dir += path.sep;
                if (log) {
                    console.log(colors.white.bold(count.toString().padding_left(4, ' ')), colors.yellow.bold(dir));
                }
                url2path[each.vanity] = dir;
            }
            else {
                let comps = URL.parse(each.url);
                dir = path.join(target_path, comps.host, comps.pathname);
                if (!dir.endsWith(path.sep))
                    dir += path.sep;
                if (log) {
                    console.log(colors.white.bold(count.toString().padding_left(4, ' ')), colors.white(dir));
                }
                url2path[each.url] = dir;
            }
            fse.ensureDirSync(dir);
        }
        return url2path;
    }
}
exports.CreateFolders = CreateFolders;
