const colors = require('colors');

export enum ContentType {
	title_amv = "title.amv",
	title_central = "title.central",
	article = "article",
	img = "img",
	accordeon = "accordeon",
	iframe = "iframe",
	tab_group = "tab.group",		// central only
	tab = "tab",					// central only
	teaser = "teaser"				// central only
}

export class ContentAbstract
{
	type: ContentType

	constructor(type: ContentType) 
	{
		this.type = type
	}
}