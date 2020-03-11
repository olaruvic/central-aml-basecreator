const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentImage } from './ContentImage';

export enum ArticleContentType {
	title = "title",
	title_h1 = "title.h1",					// central
	title_h2 = "title.h2",					// central
	title_h3 = "title.h3",					// central
	title_h4 = "title.h4",					// central
	title_h5 = "title.h5",					// central
	paragraph = "paragraph",
	ul = "ul",
	ol  = "ol",
	table = "table",
	tooltip_central_priceCatcher = "tooltip.central.priceCatcher",	// central only
	tooltip_amv = "tooltip.amv",			// amv only
	download_link = "download_link",		// central only
}

export class ContentArticleDataAbstract
{
	type: ArticleContentType
	isPrimitive: boolean

	constructor(type: ArticleContentType) 
	{
		this.type = type
		this.isPrimitive = false		// true := ParagraphContent, false := ContentArticleDataAbstract
	}

	getImages(): Array<ContentImage>
	{
		console.log(`Error (${new Debug().shortInfo()}): Superclass responsibility!`.red.white.bold)
		process.exit(1)
		return []
	}
}
