const colors = require('colors');
const URL = require('url')
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentImage } from './ContentImage';

export class ContentIFrame extends ContentAbstract
{
	url: string

	constructor(url: string)
	{
		super(ContentType.img)
		this.url = url.trim()
	}

	getImages(): Array<ContentImage>
	{
		return []
	}

	static init(currentUrl: string, $: any, tag: any): ContentIFrame
	{
		let img_src = $(tag).prop('src')
		let rootUrl = ""
		if ( /https*:/i.test(img_src) == false )
		{
			let comps = URL.parse(currentUrl)
			rootUrl = comps.protocol + '//' + comps.host
		}
		//
		return new ContentIFrame(rootUrl + img_src)
	}
}
