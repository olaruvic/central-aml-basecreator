const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';

export enum ArticleContentType {
	title = "title",
	title_h2 = "title.h2",				// central
	title_h3 = "title.h3",				// central
	title_h4 = "title.h4",				// central
	paragraph = "paragraph",
	ul = "ul",
	ol  = "ol",
	table = "table",
	tooltip = "tooltip",				// central only
	download_link = "download_link",	// central only
}

export class ContentArticleDataAbstract
{
	type: ArticleContentType

	constructor(type: ArticleContentType) 
	{
		this.type = type
	}
}
