"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSON2Array {
    constructor(pages) {
        this.array = [];
        this.toArray(pages, 'http:/');
    }
    toArray(page, parentUrl) {
        const nameSearch = page.name;
        const toPush = {
            name: nameSearch,
            nameSearch: nameSearch.toLowerCase().replace(/ /gi, ''),
            url: parentUrl + '/' + page.url,
            menu: page.menu,
            tracking: page.tracking,
            vanity: page.vanity,
            notes: page.notes,
            content: page.content,
            content2search: JSON.stringify(page.content),
            template: page.template,
            redirects: page.redirects,
            subPages: page.subPages,
            subPages2search: JSON.stringify(page.subPages)
        };
        this.array.push(toPush);
        page.subPages.forEach(subPage => {
            this.toArray(subPage, toPush.url);
        });
    }
}
exports.JSON2Array = JSON2Array;
