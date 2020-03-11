const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentImage } from './ContentImage';
import { ContentArticleDataParagraph } from './ContentArticleDataParagraph';
import { ParagraphContent } from './ParagraphContent';

export class ContentStageItem extends ContentAbstract
{
	className: string|undefined|null
	image: ContentImage
	title: string
	text: ContentArticleDataParagraph
	button: ParagraphContent

	constructor(className: string)
	{
		super(ContentType.teaser_central)
		this.className = className
		this.title = null
		this.text = null
		this.button = null
	}

	static init(url: string, $: any, tag: any): ContentStageItem
	{
		const tagObj = $(tag);
		let result = new ContentStageItem(tagObj.prop('class'))
			result._parse(url, $, tag)
		return result
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		if ( typeof(this.image)!='undefined' && this.image!=null )
		{
			result = result.concat( this.image.getImages() )
		}
		if ( typeof(this.text)!='undefined' && this.text!=null )
		{
			result = result.concat( this.text.getImages() )
		}
		if ( typeof(this.button)!='undefined' && this.button!=null )
		{
			result = result.concat( this.button.getImages() )
		}
		return result
	}

	private _parse(url: string, $: any, tag: any)
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
					if ( /stage-item-image/i.test(cls) )
					{
						this._parse_stageItem_image(url, $, each_tag)
					}
					else if ( /container/i.test(cls) )
					{
						this._parse_stageItem_container(url, $, each_tag)
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1901")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1902")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_stageItem_image(url: string, $: any, tag: any)
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
						this.image = ContentImage.init(url, $, each_tag)
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1903")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1904")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_stageItem_container(url: string, $: any, tag: any)
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
					if ( /stage-item-wrapper/i.test(cls) )
					{
						this._parse_stageItem_container(url, $, each_tag)
					}
					else if ( /stage-item-caption/i.test(cls) )
					{
						this._parse_stageItem_container_caption(url, $, each_tag)
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1905")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1906")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_stageItem_container_caption(url: string, $: any, tag: any)
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
					if ( /h2/i.test(each_tag.name) )
					{
						this.title = tagObj.text().trim()
					}
					else if ( /stage-slide-description/i.test(cls) )
					{
						this.text = ContentArticleDataParagraph.init(url, $, each_tag, false);
					}
					else if ( /stage-slide-more/i.test(cls) )
					{
						this._parse_stageItem_container_button(url, $, each_tag)
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1907")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1908")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_stageItem_container_button(url: string, $: any, tag: any)
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
					if ( each_tag.name.toLowerCase() == 'a' )		// class=[btn btn-primary icon-more icon-after]
					{
						this.button = ParagraphContent.initLink(url, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1909")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1910")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

}
