const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentImage } from './ContentImage';

export enum ParagraphContentType {
	text = 'text',
	strong = 'strong',
	sup = 'sup',
	img = 'img',
	br = 'br',
	link = 'link'
}

export class ParagraphContent
{
	type: ParagraphContentType
	text: string|null = null
	img_src: string|null = null
	href: string|null = null
	className: string|null = null

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
		let tmp_img 
		
		let res = new ParagraphContent(ParagraphContentType.link)
			tmp_img = ContentImage.init(currentUrl, $, tag);
			res.href = tmp_img.url
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
							tmp_img = ContentImage.init(currentUrl, $, each);
							res.img_src = tmp_img.url
						}
						else
						{
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
						}
						break;
					
						default:
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
							break;
				}
			}
		return res
	}
}
