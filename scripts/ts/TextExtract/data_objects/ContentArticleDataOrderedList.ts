const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';

export enum ParagraphContentType {
	text = 'text',
	footnote = 'footnote'
}

export class ContentArticleDataOrderedList extends ContentArticleDataAbstract
{
	listItems: Array<string>

	constructor()
	{
		super(ArticleContentType.ol)
		this.listItems = []
	}

	static init($: any, tag: any): ContentArticleDataOrderedList
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
	}
}
