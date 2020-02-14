const colors = require('colors');

export enum ContentType {
	title = "title",
	article = "article",
	img = "img",
	accordeon = "accordeon",
	iframe = "iframe"
}

export class ContentAbstract
{
	type: ContentType

	constructor(type: ContentType) 
	{
		this.type = type
	}
}