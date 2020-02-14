export class JSON2Array {
  array: Array<any>;
  constructor(pages: any) {
    this.array = [];
    this.toArray(pages, 'http:/');
  }
  private toArray(page: any, parentUrl: string) {
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
    // if (typeof(page.subPages) === 'undefined') {
    //   return;
    // }
    page.subPages.forEach( subPage => {
      this.toArray(subPage, toPush.url);
    });

  }
}
