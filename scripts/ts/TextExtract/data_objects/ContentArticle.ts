const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticleDataAbstract } from './ContentArticleDataAbstract';
import { ContentArticleDataTitle } from './ContentArticleDataTitle';
import { ContentArticleDataParagraph } from './ContentArticleDataParagraph';
import { ContentArticleDataUnorderedList } from './ContentArticleDataUnorderedList';
import { ContentArticleDataOrderedList } from './ContentArticleDataOrderedList';
import { ContentArticleDataTable } from './ContentArticleDataTable';
import { ContentArticleDataPriceCatcher } from './ContentArticleDataPriceCatcher';
import { ContentArticleDataTitleHx } from './ContentArticleDataTitleHx';
import { ContentArticleDataDownloadLink } from './ContentArticleDataDownloadLink';
import { ContentImage } from './ContentImage';

export class ContentArticle extends ContentAbstract
{
	data: Array<ContentArticleDataAbstract>

	constructor()
	{
		super(ContentType.article)
		this.data = []
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		for (let each of this.data)
		{
			result = result.concat( each.getImages() )
		}
		return result
	}

	static init(currentUrl: string, $: any, tag: any): ContentArticle
	{
		let article = new ContentArticle()
		//
		for( let each of tag.children )
		{
			if ( each.type != 'tag' ) continue
			const tagObj = $(each);
			const cls = tagObj.prop('class');
			{
				const txt_maxLen = 30;
				const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
				// console.log(`++ ${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			}
			switch ( each.name )
			{
				case 'span':
					{
						let t = ContentArticleDataTitle.init($, each);
						if ( t.text.length > 0 )
						{
							article.data.push( t )
						}
					}
					break;

				case 'p':
					let p = ContentArticleDataParagraph.init(currentUrl, $, each, false)
					if ( p.textComponents.length > 0 )
					{
						article.data.push( p )
					}
					break;
				
				case 'ul':
					// console.log(`${colors.magenta('ContentArticle.init')} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
					article.data.push( ContentArticleDataUnorderedList.init(currentUrl, $, each) );
					break;
				
				case 'ol':
					article.data.push( ContentArticleDataOrderedList.init(currentUrl, $, each) );
					break;

				case 'table':
					article.data.push( ContentArticleDataTable.init(currentUrl, $, each) )
					break;

				case 'div':
					if ( /pricetag-inner/i.test(cls) )	// central
					{
						article.data.push( ContentArticleDataPriceCatcher.init(currentUrl, $, each) );
					}
					else if ( /download-link/i.test(cls) )
					{
						article.data.push( ContentArticleDataDownloadLink.init(currentUrl, $, each) );
					}
					else
					{
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown DIV TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
					}
					break;
				
				case 'h2':
					article.data.push( ContentArticleDataTitleHx.init_h2($, each) )
					break;
				
				case 'h3':
					article.data.push( ContentArticleDataTitleHx.init_h3($, each) )
					break;
				
				case 'h4':
					article.data.push( ContentArticleDataTitleHx.init_h4($, each) )
					break;
				
				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
					break;
			}
		}

		return article
	}
}
