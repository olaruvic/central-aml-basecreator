const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticle } from './ContentArticle';

export class ContentAccordeon extends ContentAbstract
{
	title: string
	article: ContentArticle

	constructor(title, article: ContentArticle)
	{
		super(ContentType.accordeon)
		this.title = title
		this.article = article
	}
}
