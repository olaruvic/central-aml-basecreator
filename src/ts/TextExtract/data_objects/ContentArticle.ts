const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticleDataAbstract } from './ContentArticleDataAbstract';
import { ContentArticleDataTitle } from './ContentArticleDataTitle';
import { ContentArticleDataParagraph } from './ContentArticleDataParagraph';
import { ContentArticleDataUnorderedList } from './ContentArticleDataUnorderedList';
import { ContentArticleDataTable } from './ContentArticleDataTable';

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

		for( let each of tag.children )
		{
			if ( each.type != 'tag' ) continue
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
					// console.log(`${colors.magenta('ContentArticle.init')} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
					article.data.push( ContentArticleDataUnorderedList.init($, each) );
					break;

				case 'table':
					article.data.push( ContentArticleDataTable.init($, each) )
					break;
				
				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
					break;
			}
		}

		return article
	}
}
