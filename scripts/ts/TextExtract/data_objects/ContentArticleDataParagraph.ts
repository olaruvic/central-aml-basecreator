const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ParagraphContent } from './ParagraphContent';
import { ContentArticleDataUnorderedList } from './ContentArticleDataUnorderedList';
import { ContentArticleDataOrderedList } from './ContentArticleDataOrderedList';
import { ContentArticleDataTooltip } from './ContentArticleDataTooltip';
import { ContentImage } from './ContentImage';

export enum ParagraphContentType {
	section_subtitle = "section_subtitle",
	text = 'text',
	footnote = 'footnote',
	table_data = 'table_data'
}

export class ContentArticleDataParagraph extends ContentArticleDataAbstract
{
	paragraphType: ParagraphContentType
	text: string
	className: string|undefined|null
	textComponents: Array<ParagraphContent|ContentArticleDataAbstract>

	constructor(paragraphContentType: ParagraphContentType, text: string, className: string, textComponents: Array<ParagraphContent>)
	{
		super(ArticleContentType.paragraph)
		this.text = text.trim()
		this.className = ( typeof(className)!='undefined' && className!=null ? className : null );
		this.textComponents = textComponents
		//
		this.paragraphType = paragraphContentType;
		this._initParagraphType()
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		for (let each of this.textComponents)
		{
			result = result.concat( each.getImages() )
		}
		return result
	}

	private _initParagraphType()
	{
		if ( typeof(this.paragraphType)!='undefined' && this.paragraphType!=null )
		{
			return;		// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< return!
		}
		if ( typeof(this.className)=='undefined' || this.className==null ) 
		{
			this.paragraphType = ParagraphContentType.text;
		}
		else if ( /section-subtitle/i.test(this.className) )
		{
			this.paragraphType = ParagraphContentType.section_subtitle;
		}
		else if ( /(stage-slide-description|MsoNoSpacing|MsoNormal)/.test(this.className) )
		{
			this.paragraphType = ParagraphContentType.text;
		}
		else if ( /footnote/.test(this.className) )
		{
			this.paragraphType = ParagraphContentType.footnote;
		}
		else
		{
			console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red('Unknown')} :: className=[${this.className}]`);
		}
	}

	static init(currentUrl: string, $: any, tag: any, isTableData: boolean): ContentArticleDataParagraph
	{
		const o = $(tag)
		let result = new ContentArticleDataParagraph((isTableData ? ParagraphContentType.table_data : null), o.text(), o.prop('class'), []);
			result._parse(currentUrl, $, tag);
		return result;
	}

	private _parse(currentUrl: string, $: any, tag: any)
	{
		for( let each of tag.children )
		{
			const cls = $(each).prop('class');
			const txt_maxLen = 30;
			const txt = $(each).text().trim().replace(/[\n\r]+/, '');
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			switch ( each.type )
			{
				case 'text': 
					this.textComponents.push( ParagraphContent.initText($, each) )
					break;
				
				case 'tag':
					switch ( each.name )
					{
						case 'p':
							{
								let p = ContentArticleDataParagraph.init(currentUrl, $, each, false);
								this.textComponents = this.textComponents.concat( p );
							}
							break;

						case 'strong':
							this.textComponents.push( ParagraphContent.initStrongText($, each) )
							break;
						
						case 'sup':
							this.textComponents.push( ParagraphContent.initSupText($, each) )
							break;
						
						case 'em':
							this.textComponents.push( ParagraphContent.initEmText($, each) )
							break;
						
						case 'br':
							this.textComponents.push( ParagraphContent.initLineBreak($, each) )
							break;
						
						case 'img':
							this.textComponents.push( ParagraphContent.initImage(currentUrl, $, each) )
							break;
						
						case 'a':
							this.textComponents.push( ParagraphContent.initLink(currentUrl, $, each) )
							break;
						
						case 'ul':
							this.textComponents.push( ContentArticleDataUnorderedList.init(currentUrl, $, each) )
							break;
						
						case 'ol':
							this.textComponents.push( ContentArticleDataOrderedList.init(currentUrl, $, each) )
							break;
						
						case 'span':
							if ( /cm-image/.test(cls) )
							{
								this._parse(currentUrl, $, each);
							}
							else if ( /tooltip/.test(cls) )
							{
								this.textComponents.push( ContentArticleDataTooltip.init_amv(currentUrl, $, each) );
							}
							else
							{
								console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown SPAN")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							}
							break;
						
						default:
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							break;
					}
					break;
				
				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
					break;
			}
		}
	}
}
