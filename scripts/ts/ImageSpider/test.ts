import { ImageSpider } from './ImageSpider';
import fs = require('fs')
import path = require('path')
import colors = require('colors')
import root = require('../../../root')
const cheerio = require('cheerio')


let json_url_list = path.join(root(), 'central-amv-data', 'url_list.txt')
// let target_path = path.join(__dirname.replace('compiled', 'ts'), 'images')
let target_path = '/Users/victorolaru/Desktop/test_images' 
let imgSpider = new ImageSpider(json_url_list, target_path)
console.log(imgSpider.run())


/*
const body = '<ul id="fruits"> 		\
	<li class="apple">Apple</li>	\
	<li class="orange">Orange</li>	\
	<li class="pear">Pear</li>		\
</ul>'
const $ = cheerio.load(body)
console.log($('li'))
*/