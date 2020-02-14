"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root = require("../../../root");
const path = require("path");
const json_data = require(path.join(root(), "json-data", "juli2020.json"));
const CreateFolders_1 = require("./CreateFolders");
let target_path = '/Users/victorolaru/Desktop';
let stopExecOnError = true;
CreateFolders_1.CreateFolders.exec(target_path, json_data, stopExecOnError);
