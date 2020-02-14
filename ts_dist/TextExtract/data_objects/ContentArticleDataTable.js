"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require('colors');
const ContentArticleDataAbstract_1 = require("./ContentArticleDataAbstract");
class ContentArticleDataTable extends ContentArticleDataAbstract_1.ContentArticleDataAbstract {
    constructor() {
        super(ContentArticleDataAbstract_1.ArticleContentType.table);
        this.rows = [];
    }
    static init($, tag) {
        let table = new ContentArticleDataTable();
        let table_rows = tag.children;
        if (table_rows[0].name == 'tbody')
            table_rows = table_rows[0].children;
        for (let row of table_rows) {
            let cols = [];
            for (let col of row.children) {
                cols.push($(col).text().trim());
            }
            table.rows.push(cols);
        }
        return table;
    }
}
exports.ContentArticleDataTable = ContentArticleDataTable;
