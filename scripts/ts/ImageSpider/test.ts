import colors = require('colors')
import fs = require('fs')
import path = require('path')
import root = require('../../../root')
import '../String-extensions';
import { ImageSpider } from './ImageSpider';
import { CleanUpFolders } from './../CleanUpFolders/CleanUpFolders';
//
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));
// const json_data = require(path.join(root(), "central-amv-data", "test.json"));

// let target_path = path.join(__dirname.replace('compiled', 'ts'), 'images')
let target_path = '/Users/victorolaru/Desktop/test_images' 
let ignore_generali_domains = true
let imgSpider = new ImageSpider(target_path, json_data, ignore_generali_domains)
imgSpider.run()
