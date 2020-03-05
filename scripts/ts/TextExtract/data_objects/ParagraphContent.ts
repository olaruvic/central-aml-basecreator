const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentImage } from './ContentImage';
import _url = require('url');

export enum ParagraphContentType {
	text = 'text',
	strong = 'strong',
	sup = 'sup',
	img = 'img',
	br = 'br',
	link = 'link',
	tab_header = 'tab.header'
}

export class ParagraphContent
{
	type: ParagraphContentType
	text: string|null = null
	img_src: string|null = null
	href: string|null = null
	href_absolute: string|null = null
	className: string|null = null
	tab_id: string|null = null

	constructor(type: ParagraphContentType)
	{
		this.type = type
	}

	static initText($: any, tag: any): ParagraphContent
	{
		let res = new ParagraphContent(ParagraphContentType.text)
			res.text = $(tag).text().trim()
		return res
	}

	static initStrongText($: any, tag: any): ParagraphContent
	{
		let res = new ParagraphContent(ParagraphContentType.strong)
			res.text = $(tag).text().trim()
		return res
	}

	static initSupText($: any, tag: any): ParagraphContent
	{
		let res = new ParagraphContent(ParagraphContentType.sup)
			res.text = $(tag).text().trim()
		return res
	}

	static initLineBreak($: any, tag: any): ParagraphContent
	{
		let res = new ParagraphContent(ParagraphContentType.br)
			res.text = '\n'
		return res
	}

	static initImage(currentUrl: string, $: any, tag: any): ParagraphContent
	{
		let tmp_img = ContentImage.init(currentUrl, $, tag);
		let res = new ParagraphContent(ParagraphContentType.img)
			let cls = $(tag).prop('class')
			if ( typeof(cls)!='undefined' && cls!=null && cls.trim().length>0 )
			{
				res.className = cls.trim()
			}
			res.img_src = tmp_img.url
		return res
	}

	static initLink(currentUrl: string, $: any, tag: any): ParagraphContent
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);

		let res = new ParagraphContent(ParagraphContentType.link)
			res.href = $(tag).prop('href')
			res.href_absolute = _url.resolve( currentUrl, res.href );
			//
			/*if ( tag.children.length > 1 ) 
			{
				console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Error: Too many children ("+tag.children.length+")!")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${$(tag).text().trim()}]`);
				console.dir(tag, {colors: true});
				process.exit(1)
			}*/
			for( let each of tag.children )
			{
				switch ( each.type )
				{
					case 'text': 
						res.text = $(each).text().trim()
						break;

					case 'tag':
						if ( each.name == 'img' )
						{
							let tmp_img = ContentImage.init(currentUrl, $, each);
							res.img_src = tmp_img.url
						}
						else
						{
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
						}
						break;
					
					default:
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
						break;
				}
			}
		// console.dir(res, {colors: true});
		return res
	}

	static initTabHeaderTitle(currentUrl: string, $: any, tag: any): ParagraphContent
	{	
		let res = new ParagraphContent(ParagraphContentType.tab_header)
			res.tab_id = $(tag).prop('href').replace(/^#/im, '')
			//
			for( let each of tag.children )
			{
				switch ( each.type )
				{
					case 'text': 
						res.text = $(each).text().trim()
						break;
					
					default:
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
						break;
				}
			}
		return res
	}
}
