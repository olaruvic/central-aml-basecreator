"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
class FileSystem {
    constructor() { }
    static updateFileExtension(current_fpath, new_fextension) {
        let comps = path.parse(current_fpath);
        if (!new_fextension.startsWith('.')) {
            new_fextension = '.' + new_fextension;
        }
        return path.join(comps.dir, comps.name + new_fextension);
    }
    static appendFileName(current_fpath, nameToAdd) {
        if (typeof (nameToAdd) == 'undefined' || nameToAdd == null)
            return current_fpath;
        if (nameToAdd.length <= 0)
            return current_fpath;
        let comps = path.parse(current_fpath);
        return path.join(comps.dir, comps.name + nameToAdd + comps.ext);
    }
    static createFolder(fpath) {
        let comps = path.parse(fpath);
        let target_path = (comps.ext.trim().length > 0
            ? comps.dir
            : fpath);
        if (fs.existsSync(target_path) == false) {
            fse.ensureDirSync(target_path);
        }
    }
}
exports.FileSystem = FileSystem;
