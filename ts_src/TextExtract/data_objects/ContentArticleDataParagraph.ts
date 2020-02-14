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
		this.className = className
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
		let textComponents = []
		for( let each of tag.children )
		{
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}] text=[${$(each).text().trim().substr(0, 30)}...]`);
			switch ( each.type )
			{
				case 'text': 
					textComponents.push( ParagraphContent.initText($, each) )
					break;
				
				case 'tag':
					switch ( each.name )
					{
						case 'strong':
							textComponents.push( ParagraphContent.initStrongText($, each) )
							break;
						
						case 'sup':
							textComponents.push( ParagraphContent.initSupText($, each) )
							break;
						
						case 'br':
							textComponents.push( ParagraphContent.initLineBreak($, each) )
							break;
						
						case 'img':
							textComponents.push( ParagraphContent.initImage(currentUrl, $, each) )
							break;
						
						case 'a':
							textComponents.push( ParagraphContent.initLink(currentUrl, $, each) )
							break;
						
						default:
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
							break;
					}
					break;
				
				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
					break;
			}
		}

		const o = $(tag)
		return new ContentArticleDataParagraph(o.text(), o.prop('class'), textComponents)
	}
}
