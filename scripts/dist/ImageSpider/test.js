"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const root = require("../../../root");
require("../String-extensions");
const JSON2Array_1 = require("../JSON2Array/JSON2Array");
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));
let json2arr = new JSON2Array_1.JSON2Array(json_data, false);
let count = 0;
for (let each of json2arr.array) {
    count += 1;
    console.log(count.toString().padding_left(4, ' '), '::', each.url);
}
