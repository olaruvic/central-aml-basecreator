import colors = require('colors')

export class JSON2Array 
{
	array: Array<any>;
	error: Array<any>;

	private _check: {[url: string]: number};
	private _resultWithErrorPages : boolean;

	constructor(pages: any, resultWithErrorPages: boolean) 
	{
		this.array = [];
		this.error = [];
		this._check = {};
		this._resultWithErrorPages = resultWithErrorPages;
		this._toArray(pages, 'http:/');
		this._normalize_array();
	}

	private _toArray(page: any, parentUrl: string) 
	{
		const nameSearch = page.name;
		const url = parentUrl + '/' + page.url.trim();
		const toPush = {
			isVanityUrl: false,
			name: nameSearch,
			nameSearch: nameSearch.toLowerCase().replace(/ /gi, ''),
			url: url, //parentUrl + '/' + page.url,
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
		// page.url darf leer sein, wenn es eine Vanity-URL hat
		let isErr = ( page.url.trim().length<=0 || this._check[url]!=null )
		if ( isErr && page.vanity.trim().length > 0 )
		{
			isErr = false;
			toPush.isVanityUrl = true;
		}
		if ( !isErr )
		{
			this._check[url] = 1
			this.array.push(toPush);
		}
		else
		{
			this.error.push( {url: url, page: page} );
			if ( this._resultWithErrorPages ) this.array.push(toPush);
		}
		for (let subPage of page.subPages)
		{
			this._toArray(subPage, toPush.url);
		}
	}

	private _normalize_array()
	{
		for(let each of this.array)
		{
			let dir = each.url;
			if ( !dir.endsWith('/') ) dir += '/';
			each.url = dir;
		}
	}
}
