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
    static exec(target_path, json, stopExecOnError) {
        let json2arr = new JSON2Array_1.JSON2Array(json, false);
        if (json2arr.error.length > 0) {
            console.log(colors.red.bold("Fehler: Mehrfacheinträge gefunden!"));
            for (let each of json2arr.error) {
                console.log(` • ${colors.red(each.url)} => ${colors.red.bold(each.page.name)}`);
            }
            if (stopExecOnError) {
                process.exit(1);
            }
        }
        let cf = new CreateFolders();
        cf._createFolders(target_path, json2arr, true);
    }
    _createFolders(target_path, json2arr, log) {
        let folder_array = json2arr.array;
        let count = 0;
        for (let each of folder_array) {
            count += 1;
            let comps = URL.parse(each.url);
            let dir = path.join(target_path, comps.host, comps.pathname);
            if (!dir.endsWith(path.sep))
                dir += path.sep;
            if (log) {
                let root = (!target_path.endsWith(path.sep) ? (target_path + path.sep) : target_path);
                let host = comps.host;
                console.log(colors.white.bold(count.toString().padding_left(4, ' ')), colors.gray(root) + colors.gray.underline(host) + colors.white(comps.pathname));
            }
            fse.ensureDirSync(dir);
        }
    }
}
exports.CreateFolders = CreateFolders;
