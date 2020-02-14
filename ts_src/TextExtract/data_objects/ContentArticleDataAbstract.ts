const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';

export enum ArticleContentType {
	title = "title",
	paragraph = "paragraph",
	ul = "ul",
	table = "table"
}

export class ContentArticleDataAbstract
{
	type: ArticleContentType

	constructor(type: ArticleContentType) 
	{
		this.type = type
	}
}
