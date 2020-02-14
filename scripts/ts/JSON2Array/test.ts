import root = require('../../../root')
import colors = require('colors')
import path = require('path')
import '../String-extensions';
//
import { JSON2Array } from '../JSON2Array/JSON2Array';
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));

let json2arr = new JSON2Array(json_data, false)
let count = 0
for (let each of json2arr.array)
{
	count += 1
	console.log(count.toString().padding_left(4, ' '), '::', each.url )
}
console.log('----------------------------')
for (let each of json2arr.error)
{
	console.dir(each, {colors: true, depth: 1})
}
