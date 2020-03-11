"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentAbstract_1 = require("./ContentAbstract");
class ContentTab extends ContentAbstract_1.ContentAbstract {
    constructor(tab_id, title, content) {
        super(ContentAbstract_1.ContentType.tab);
        this.tab_id = tab_id;
        this.title = title;
        this.content = content;
    }
    getImages() {
        let result = [];
        if (typeof (this.title) != 'undefined' && this.title != null) {
            result = result.concat(this.title.getImages());
        }
        for (let each of this.content) {
            result = result.concat(each.getImages());
        }
        return result;
    }
}
exports.ContentTab = ContentTab;
