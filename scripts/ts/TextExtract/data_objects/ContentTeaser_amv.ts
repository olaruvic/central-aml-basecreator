const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticle } from './ContentArticle';
import { ParagraphContent } from './ParagraphContent';
import { ContentImage } from './ContentImage';
import { ContentArticleDataParagraph } from './ContentArticleDataParagraph';

export class ContentTeaser_amv extends ContentAbstract
{
	className: string|undefined|null
	header: string
	text: ContentArticle
	image: ParagraphContent
	button: string

	constructor(className: string)
	{
		super(ContentType.teaser_amv)
		this.type = ContentType.teaser_amv		// type wird in super() überschrieben!!!, deshlab hier noch ein Mal setzen
		//
		this.className = className
		this.header = null
		this.text = null
		this.image = null
		this.button = null
	}

	static init_amv(url: string, $: any, tag: any): ContentTeaser_amv
	{
		const tagObj = $(tag);
		let result = new ContentTeaser_amv(tagObj.prop('class'))
			result._parse_amv(url, $, tag)
		return result
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		if ( typeof(this.text)!='undefined' && this.text!=null )
		{
			result = result.concat( this.text.getImages() )
		}
		if ( typeof(this.image)!='undefined' && this.image!=null )
		{
			result = result.concat( this.image.getImages() )
		}
		return result
	}

	private _parse_amv(url: string, $: any, tag: any)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /header/i.test(each_tag.name) )
					{
						this._parse_amv_teaser_header(url, $, each_tag)
					}
					else if ( each_tag.name.toLowerCase() == 'p' )
					{
						let p = ContentArticleDataParagraph.init(url, $, each_tag, false)
						if ( p.textComponents.length > 0 )
						{
							let obj = new ContentArticle()
								obj.data.push( p )
							this.text = obj
						}

					}
					else if ( /footer/i.test(each_tag.name) )
					{
						this.button = tagObj.text().trim()
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1701")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1702")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
		// console.dir(this, {colors: true, depth: 100})
	}

	private _parse_amv_teaser_header(url: string, $: any, tag: any)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /am-content-teaser-img/i.test(cls) )
					{
						this._parse_amv_teaser_header_image(url, $, each_tag)
					}
					else if ( /am-h1/i.test(cls) )
					{
						this.header = tagObj.text().trim()
					}
					else
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1703")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1704")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_amv_teaser_header_image(url: string, $: any, tag: any)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /img/i.test(each_tag.name) )
					{
						this.image = ParagraphContent.initImage(url, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1705")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1706")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

}
