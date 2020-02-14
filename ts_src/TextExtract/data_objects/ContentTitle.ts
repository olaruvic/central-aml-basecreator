const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';

export class ContentTitle extends ContentAbstract
{
	text: string

	constructor(text: string)
	{
		super(ContentType.title)
		this.text = text.trim()
	}

	static init($: any, tag: any): ContentTitle
	{
		return new ContentTitle($(tag).text())
	}
}
