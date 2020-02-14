const colors = require('colors');
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';

export class ContentArticleDataTitle extends ContentArticleDataAbstract
{
	text: string
	className: string

	constructor(text: string, className: string)
	{
		super(ArticleContentType.title)
		this.text = text.trim()
		this.className = className
	}

	static init($: any, tag: any): ContentArticleDataTitle
	{
		const o = $(tag)
		return new ContentArticleDataTitle(o.text(), o.prop('class'))
	}
}
