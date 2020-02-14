const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';

export enum ParagraphContentType {
	text = 'text',
	footnote = 'footnote'
}

export class ContentArticleDataUnorderedList extends ContentArticleDataAbstract
{
	listItems: Array<string>

	constructor()
	{
		super(ArticleContentType.ul)
		this.listItems = []
	}

	static init($: any, tag: any): ContentArticleDataUnorderedList
	{
		let ul = new ContentArticleDataUnorderedList()

		for ( let li of tag.children )
		{
			let text = $(li).text().trim()
			if ( text.length > 0 )
			{
				ul.listItems.push( text )
			}
		}

		return ul
	}
}
