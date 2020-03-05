const colors = require('colors');
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';

export class ContentArticleDataTitleHx extends ContentArticleDataAbstract
{
	text: string
	className: string

	constructor(cType: ArticleContentType, text: string, className: string)
	{
		super(cType)
		this.text = text.trim()
		this.className = className
	}

	static init_h3($: any, tag: any): ContentArticleDataTitleHx
	{
		const o = $(tag)
		return new ContentArticleDataTitleHx(ArticleContentType.title_h3, o.text(), o.prop('class'))
	}

	static init_h4($: any, tag: any): ContentArticleDataTitleHx
	{
		const o = $(tag)
		return new ContentArticleDataTitleHx(ArticleContentType.title_h4, o.text(), o.prop('class'))
	}
}
