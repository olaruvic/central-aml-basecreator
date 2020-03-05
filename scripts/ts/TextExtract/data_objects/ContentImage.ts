const colors = require('colors');
const URL = require('url')
import { ContentAbstract, ContentType } from './ContentAbstract';

export class ContentImage extends ContentAbstract
{
	url: string
	title: string|null = null
	alt: string|null = null

	constructor(url: string)
	{
		super(ContentType.img)
		this.url = url.trim()
	}

	static init(currentUrl: string, $: any, tag: any): ContentImage
	{
		let tagObj = $(tag)
		let img_src = tagObj.prop('src')
		let rootUrl = ""
		if ( /https*:/i.test(img_src) == false )
		{
			let comps = URL.parse(currentUrl)
			rootUrl = comps.protocol + '//' + comps.host
		}
		//
		let res = new ContentImage(URL.resolve(rootUrl, img_src));
			res.title = ContentImage._extractAttrValue(tagObj, 'title');
			res.alt = ContentImage._extractAttrValue(tagObj, 'alt');
		return res;
	}

	static _extractAttrValue(tagObj: any, prop_name: string): string|null
	{
		let val = tagObj.prop(prop_name)
		if ( typeof(val)!='undefined' && val!=null )
		{
			val = val.trim()
			return ( val.length > 0 
				? val
				: null
				)
		}
		return null
	}
}
