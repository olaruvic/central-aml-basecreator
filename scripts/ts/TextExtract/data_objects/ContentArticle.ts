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

export class ContentArticle extends ContentAbstract
{
	data: Array<ContentArticleDataAbstract>

	constructor()
	{
		super(ContentType.article)
		this.data = []
	}

	static init(currentUrl: string, $: any, tag: any): ContentArticle
	{
		let article = new ContentArticle()
		//
		for( let each of tag.children )
		{
			if ( each.type != 'tag' ) continue
			const cls = $(each).prop('class');
			// console.log(`++ ${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${cls}]`);
			switch ( each.name )
			{
				case 'span':
					article.data.push( ContentArticleDataTitle.init($, each) )
					break;

				case 'p':
					let p = ContentArticleDataParagraph.init(currentUrl, $, each)
					if ( p.text.length > 0 )
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
					article.data.push( ContentArticleDataTable.init($, each) )
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
