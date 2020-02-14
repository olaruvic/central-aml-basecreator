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
        let cf = new CreateFolders();
        let error = cf._createFolders(target_path, json, false, false);
        if (error.length > 0) {
            console.log(colors.red.bold("Fehler: Mehrfacheinträge gefunden!"));
            for (let each of error) {
                console.log(` • ${colors.red(each.path)} => ${colors.red.bold(each.obj.name)}`);
            }
            if (stopExecOnError) {
                process.exit(1);
            }
        }
        cf._createFolders(target_path, json, true, true);
    }
    _createFolders(target_path, json, createFolders, log) {
        let check = {};
        let error = [];
        let folder_array = new JSON2Array_1.JSON2Array(json).array;
        let count = 0;
        for (let each of folder_array) {
            let comps = URL.parse(each.url);
            let dir = path.join(target_path, comps.host, comps.pathname);
            if (!dir.endsWith(path.sep))
                dir += path.sep;
            if (check[dir] == null) {
                check[dir] = 1;
                count += 1;
                if (log) {
                    let root = path.join(target_path, comps.host);
                    console.log(colors.white.bold(count.toString().padding_left(4, ' ')), colors.gray(root) + colors.white(comps.pathname));
                }
                if (createFolders)
                    fse.ensureDirSync(dir);
            }
            else {
                error.push({ path: dir, obj: each });
            }
        }
        return error;
    }
}
exports.CreateFolders = CreateFolders;
