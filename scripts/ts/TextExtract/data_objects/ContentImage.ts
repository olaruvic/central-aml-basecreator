const colors = require('colors');
const URL = require('url')
import { Debug } from './../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';

export class ContentImage extends ContentAbstract
{
	url: Array<string>
	title: string|null = null
	alt: string|null = null

	constructor(url: Array<string>)
	{
		super(ContentType.img)
		//
		this.url = null;
		if ( typeof(url)!='undefined' && url!=null )
		{
			this.url = [];
			for(let each_src of url)
			{
				this.url.push( each_src.trim() )
			}
		}
	}

	getImages(): Array<ContentImage>
	{
		return [this];
	}

	static init(currentUrl: string, $: any, tag: any): ContentImage
	{
		let tagObj = $(tag)
		let img_src = tagObj.prop('src').trim()
		let urls = [];
		if ( img_src.length > 0 )
		{
			urls.push( URL.resolve(currentUrl, img_src) );
		}
		ContentImage._extractResponsiveImg(currentUrl, $, tag, urls);
		let res = new ContentImage(urls);
			res.title = ContentImage._extractAttrValue(tagObj, 'title');
			res.alt = ContentImage._extractAttrValue(tagObj, 'alt');
		return res;
	}

	static init_moduleImage(currentUrl: string, $: any, tag: any): ContentImage
	{
		let result
		//
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /figure/i.test(cls) )
					{
						result = ContentImage._parse_module_image_figure(currentUrl, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1301")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1302")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}

		return result
	}

	static _parse_module_image_figure(currentUrl: string, $: any, tag: any): ContentImage
	{
		let result
		//
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /figure-img/i.test(cls) )
					{
						result = ContentImage.init(currentUrl, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1303")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1304")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
		
		return result
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

	static _extractResponsiveImg(currentUrl: string, $: any, tag: any, result: Array<string>)
	{
		let tagObj = $(tag);
		let resImg = tagObj.prop('data-responsive-image');
		if ( typeof(resImg)!='undefined' && resImg!=null )
		{
			resImg = JSON.parse( resImg );
			for( let each_responsive_key in resImg )
			{
				if ( /\d+x\d/i.test(each_responsive_key) || /landscape_stage/i.test(each_responsive_key) )		// mögliche Werte: 'portrait_ratio1x1', 'landscape_ratio29x10', ...
				{
					let images = resImg[each_responsive_key];
					for(let each_key in images)
					{
						let each_src = images[each_key].trim();
						if ( each_src.length > 0 )
						{
							result.push( URL.resolve(currentUrl, each_src) );
						}
					}
				}
				else
				{
					const txt_maxLen = 30;
					const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown data-responsive-image TAG")} :: type=[${tag.type}] name=[${tag.name}] class=[${tagObj.prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
				}
			}
		}		
	}
}
