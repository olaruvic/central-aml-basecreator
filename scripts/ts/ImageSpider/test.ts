import { ImageSpider } from './ImageSpider';
import fs = require('fs')
import path = require('path')
import colors = require('colors')
import root = require('../../../root')
import '../String-extensions';
//
import { JSON2Array } from '../JSON2Array/JSON2Array';
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));

console.log(colors.red.bold("######################################################### empty sorces"))
let json2arr = new JSON2Array(json_data, false)
let count = 0
for (let each of json2arr.array)
{
	count += 1
	if ( each.content.sourceUrl.length<=0 || each.content.sourceUrl[0].trim().length<=0 )
	console.log(colors.white.bold(count.toString().padding_left(4, ' ')), '::', colors.cyan(each.name), "|", colors.yellow(each.url), '|', each.content.sourceUrl)
}

let json_url_list = path.join(root(), 'central-amv-data', 'url_list.txt')
// let target_path = path.join(__dirname.replace('compiled', 'ts'), 'images')
let target_path = '/Users/victorolaru/Desktop/test_images' 
let imgSpider = new ImageSpider(json_url_list, target_path)
console.log(imgSpider.run())
