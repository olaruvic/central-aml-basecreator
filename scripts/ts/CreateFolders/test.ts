import root = require('../../../root')
import colors = require('colors')
import path = require('path')
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));
import { CreateFolders } from './CreateFolders';

let target_path = '/Users/victorolaru/Desktop';
let stopExecOnError = true
CreateFolders.exec(target_path, json_data, stopExecOnError);
