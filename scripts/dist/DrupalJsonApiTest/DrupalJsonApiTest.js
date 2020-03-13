"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSON2Array_1 = require("../JSON2Array/JSON2Array");
let needle = require('needle');
class DrupalJsonApiTest {
    constructor(json) {
        this.api_url = "http://page-manager-test.hogarthww.de/jsonapi/node/generali_page";
        this.json_data = new JSON2Array_1.JSON2Array(json, false);
    }
    find_field(field, value, callback = null) {
        let params = encodeURI(`filter[${field}]=${value}`);
        needle.get(this.api_url + '?' + params, function (err, res, body) {
            let json = null;
            if (!err && res.statusCode == 200) {
                json = JSON.parse(body.toString('utf8'));
            }
            if (callback) {
                callback(err, json);
            }
        });
    }
    copyFieldToServer(json_field_name, drupal_field_name) {
        for (let each_page of this.json_data.array) {
            let field_value = each_page[json_field_name];
            if (typeof (field_value) != 'undefined' && field_value != null && field_value.trim().length > 0) {
                field_value = field_value.trim();
                this.find_field(drupal_field_name, field_value, (err, json) => {
                    if ()
                        ;
                });
            }
        }
    }
}
exports.DrupalJsonApiTest = DrupalJsonApiTest;
