"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root = require("../../../root");
const path = require("path");
const JSON2Array_1 = require("./JSON2Array");
const data = require(path.join(root(), "central-amv-data", "juli2020.json"));
let arr = new JSON2Array_1.JSON2Array(data).array;
for (let each of arr) {
    console.log(each.url);
}
