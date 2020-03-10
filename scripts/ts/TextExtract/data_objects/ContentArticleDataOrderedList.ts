const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ContentArticleDataParagraph } from './ContentArticleDataParagraph';

export enum ParagraphContentType {
	text = 'text',
	footnote = 'footnote'
}

export class ContentArticleDataOrderedList extends ContentArticleDataAbstract
{
	// listItems: Array<string>
	listItems: Array<ContentArticleDataParagraph>

	constructor()
	{
		super(ArticleContentType.ol)
		this.listItems = []
	}

/*	static init(currentUrl: string, $: any, tag: any): ContentArticleDataOrderedList
	{
		let ol = new ContentArticleDataOrderedList()

		for ( let li of tag.children )
		{
			let text = $(li).text().trim()
			if ( text.length > 0 )
			{
				ol.listItems.push( text )
			}
		}

		return ol
	}*/

	static init(url: string, $: any, tag: any): ContentArticleDataOrderedList
	{
		let result = new ContentArticleDataOrderedList();

		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /li/i.test(each_tag.name) )
					{
						result.listItems.push( ContentArticleDataParagraph.init(url, $, each_tag, false) );
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1401")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1402")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}

		return result;
	}
}
