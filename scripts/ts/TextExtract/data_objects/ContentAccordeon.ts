const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticle } from './ContentArticle';

export class ContentAccordeon extends ContentAbstract
{
	title: string
	articles: Array<ContentArticle>

	constructor(title, articles: Array<ContentArticle>)
	{
		super(ContentType.accordeon)
		this.title = title
		this.articles = articles
	}
}
