"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const colors = require("colors");
const glob = require("glob");
class FileData {
    constructor(full_fpath, fsize) {
        this.mv_full_fpaths = [full_fpath];
        this.fsize = fsize;
        this.count = 0;
    }
    addFileToMove(full_fpath) {
        this.mv_full_fpaths.push(full_fpath);
        this.count += 1;
    }
}
class CleanUpFolders {
    constructor(target_path) {
        this.target_path = target_path;
    }
    _getFileSize(filename) {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        return fileSizeInBytes;
    }
    run(subDir_name, targetDir_name, cleanUpIfGTNumDoubles) {
        console.log(colors.yellow.bold(`--------------------- cleaning up ${subDir_name} folders`));
        let css_files = glob.sync(path.join(this.target_path, '**', subDir_name, '*'), {
            'mark': true,
            'dot': false,
            'ignore': [path.join('**', '.*')]
        });
        let global_path = path.join(this.target_path, targetDir_name);
        if (fs.existsSync(global_path) == false) {
            fse.ensureDirSync(global_path);
        }
        let filesToMove = {};
        for (let each_fpath of css_files) {
            let fname = path.basename(each_fpath);
            let fsize = this._getFileSize(each_fpath);
            let check = filesToMove[fname];
            let addFile = true;
            if (check != null && check.fsize == fsize) {
                addFile = false;
                check.addFileToMove(each_fpath);
            }
            if (addFile == true) {
                filesToMove[fname] = new FileData(each_fpath, fsize);
            }
        }
        for (let each_fname of Object.keys(filesToMove)) {
            let each_file = filesToMove[each_fname];
            if (cleanUpIfGTNumDoubles == -1 || each_file.count >= cleanUpIfGTNumDoubles) {
                for (let idx = 0; idx < each_file.mv_full_fpaths.length; idx++) {
                    let src = each_file.mv_full_fpaths[idx];
                    let dst = path.join(global_path, each_fname);
                    if (idx == 0) {
                        console.log(colors.grey(`moved to global : `), dst.green.bold);
                        fs.renameSync(src, dst);
                    }
                    else {
                        fs.unlinkSync(src);
                    }
                }
            }
        }
    }
    cleanUp_emptyFolders(subDir_name) {
        let css_folders = glob.sync(path.join(this.target_path, '**', subDir_name), {
            'mark': true,
            'dot': false,
            'ignore': [path.join('**', '.*')]
        });
        for (let each of css_folders) {
            let num_files = fs.readdirSync(each).length;
            if (num_files <= 0) {
                console.log(colors.grey(`remove folder : `), each);
                fs.rmdirSync(each);
            }
        }
    }
}
exports.CleanUpFolders = CleanUpFolders;
