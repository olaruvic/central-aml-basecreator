const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';

export enum ArticleContentType {
	title = "title",
	title_h3 = "title.h3",		// central
	title_h4 = "title.h4",		// central
	paragraph = "paragraph",
	ul = "ul",
	table = "table",
	tooltip = "tooltip"
}

export class ContentArticleDataAbstract
{
	type: ArticleContentType

	constructor(type: ArticleContentType) 
	{
		this.type = type
	}
}
