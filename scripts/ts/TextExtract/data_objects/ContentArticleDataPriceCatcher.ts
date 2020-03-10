const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ParagraphContent } from './ParagraphContent';
import { ContentArticle } from './ContentArticle';

export class ContentArticleDataPriceCatcher extends ContentArticleDataAbstract
{
	text: string
	price: string
	tooltip: ContentArticle

	constructor()
	{
		super(ArticleContentType.tooltip_central_priceCatcher)
		this.text = null
		this.price = null
		this.tooltip = null
	}

	static init(currentUrl: string, $: any, tag: any): ContentArticleDataPriceCatcher
	{
		let priceCatcher = new ContentArticleDataPriceCatcher();

		for( let each of tag.children )
		{
			const cls = $(each).prop('class');
			const txt_maxLen = 30;
			const txt = $(each).text().trim().replace(/[\n\r]+/, '');
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			switch ( each.type )
			{
				case 'text': 
					// ignore
					// ... textComponents.push( ParagraphContent.initText($, each) )
					break;
				
				case 'tag':
					switch ( each.name )
					{
						case 'span':
							if ( /txt/i.test(cls) )
							{
								priceCatcher.text = $(each).text().trim()
							}
							else if ( /prize/i.test(cls) )
							{
								priceCatcher.price = $(each).text().trim()
							}
							else if ( /icon-info/i.test(cls) )
							{
								// ignore
							}
							else
							{
								console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown SPAN TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							}
							break;
						
						case 'div':
							if ( /tooltip-content/i.test(cls) )
							{
								priceCatcher.tooltip = ContentArticle.init(currentUrl, $, each)
							}
							else
							{
								console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown DIV TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							}
							break;
						
						default:
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							break;
					}
					break;
				
				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}

		return priceCatcher;
	}
}
