import root = require('../../../root')
import colors = require('colors')
import path = require('path')
import { JSON2Array } from './JSON2Array';
const data = require(path.join(root(), "json-data", "juli2020.json"));

// console.dir(data, {colors: true, depth: 1000})
let arr = new JSON2Array(data).array
for(let each of arr)
{
	console.log(each.url)
}
