"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root = require("../../../root");
const path = require("path");
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));
const CreateFolders_1 = require("./CreateFolders");
let target_path = '/Users/victorolaru/Desktop';
CreateFolders_1.CreateFolders.exec(target_path, json_data);
