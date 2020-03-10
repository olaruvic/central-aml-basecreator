const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticle } from './ContentArticle';
import { ContentImage } from './ContentImage';

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

	getImages(): Array<ContentImage>
	{
		let result = []
		for (let each of this.articles)
		{
			result = result.concat( each.getImages() )
		}
		return result
	}
}
