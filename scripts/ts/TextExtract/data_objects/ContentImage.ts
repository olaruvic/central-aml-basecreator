const colors = require('colors');
const URL = require('url')
import { ContentAbstract, ContentType } from './ContentAbstract';

export class ContentImage extends ContentAbstract
{
	url: string

	constructor(url: string)
	{
		super(ContentType.img)
		this.url = url.trim()
	}

	static init(currentUrl: string, $: any, tag: any): ContentImage
	{
		let img_src = $(tag).prop('src')
		let rootUrl = ""
		if ( /https*:/i.test(img_src) == false )
		{
			let comps = URL.parse(currentUrl)
			rootUrl = comps.protocol + '//' + comps.host
		}
		//
		return new ContentImage(rootUrl + img_src)
	}
}
