const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ParagraphContent } from './ParagraphContent';

export enum ParagraphContentType {
	text = 'text',
	footnote = 'footnote'
}

export class ContentArticleDataParagraph extends ContentArticleDataAbstract
{
	paragraphType: ParagraphContentType
	text: string
	className: string|undefined|null
	textComponents: Array<ParagraphContent>

	constructor(text: string, className: string, textComponents: Array<ParagraphContent>)
	{
		super(ArticleContentType.paragraph)
		this.text = text.trim()
		this.className = ( typeof(className)!='undefined' && className!=null ? className : null );
		this.textComponents = textComponents
		//
		this._initParagraphType()
	}

	private _initParagraphType()
	{
		if ( typeof(this.className)=='undefined' || this.className==null ) 
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

	static init(currentUrl: string, $: any, tag: any): ContentArticleDataParagraph
	{
		const o = $(tag)
		let result = new ContentArticleDataParagraph(o.text(), o.prop('class'), []);
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
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			switch ( each.type )
			{
				case 'text': 
					this.textComponents.push( ParagraphContent.initText($, each) )
					break;
				
				case 'tag':
					switch ( each.name )
					{
						case 'strong':
							this.textComponents.push( ParagraphContent.initStrongText($, each) )
							break;
						
						case 'sup':
							this.textComponents.push( ParagraphContent.initSupText($, each) )
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
						
						case 'span':
							if ( /cm-image/.test(cls) )
							{
								this._parse(currentUrl, $, each);
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
