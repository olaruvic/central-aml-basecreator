"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const root = require("../../../root");
const DrupalJsonApiTest_1 = require("./DrupalJsonApiTest");
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));
let o = new DrupalJsonApiTest_1.DrupalJsonApiTest(json_data);
o.copyFieldToServer('template', 'field_page_template');
