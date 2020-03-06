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
	img_src: Array<string>|null = null
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
		// console.log("ContentImage=".cyan.bold); console.dir(tmp_img, {colors: true, depth: 100});
		let res = new ParagraphContent(ParagraphContentType.img)
			let cls = $(tag).prop('class')
			if ( typeof(cls)!='undefined' && cls!=null && cls.trim().length>0 )
			{
				res.className = cls.trim()
			}
			if ( res.img_src == null ) res.img_src = [];
			res.img_src = res.img_src.concat( tmp_img.url );
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
						{
							let txt = $(each).text().trim()
							if ( txt.length > 0 )					// Nur dann ÜBERSCHREIBEN, wenn length > 0 - VORSICHT! kann den Text in <span> überschrieben
							{
								res.text = txt;
							}
						}
						break;

					case 'tag':
						if ( each.name == 'img' )
						{
							let tmp_img = ContentImage.init(currentUrl, $, each);
							if ( res.img_src == null ) res.img_src = [];
							res.img_src = res.img_src.concat( tmp_img.url );
						}
						else if ( each.name == 'span' )
						{
							let txt = $(each).text().trim()
							if ( txt.length > 0 )					// Nur dann ÜBERSCHREIBEN, wenn length > 0 - VORSICHT! kann den Text in <text> überschrieben
							{
								res.text = txt;
							}
							// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
							// console.log("text:", res.text);
						}
						else
						{
							const txt_maxLen = 30;
							const txt = $(each).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')} text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]]`);
						}
						break;
					
					default:
						{
							const txt_maxLen = 30;
							const txt = $(each).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')} text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]]`);
						}
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
