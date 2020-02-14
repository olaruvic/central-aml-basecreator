import { ImageSpider } from './ImageSpider';
import fs = require('fs')
import path = require('path')
import colors = require('colors')
import root = require('../../../root')
import '../String-extensions';
//
import { JSON2Array } from '../JSON2Array/JSON2Array';
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));

let json2arr = new JSON2Array(json_data, false)
let count = 0
for (let each of json2arr.array)
{
	count += 1
	console.log(count.toString().padding_left(4, ' '), '::', each.url)
}
/*
let json_url_list = path.join(root(), 'central-amv-data', 'url_list.txt')
// let target_path = path.join(__dirname.replace('compiled', 'ts'), 'images')
let target_path = '/Users/victorolaru/Desktop/test_images' 
let imgSpider = new ImageSpider(json_url_list, target_path)
console.log(imgSpider.run())
*/