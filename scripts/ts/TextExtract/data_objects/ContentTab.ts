const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ParagraphContent } from './ParagraphContent';
import { ContentArticle } from './ContentArticle';
import { ContentImage } from './ContentImage';

export class ContentTab extends ContentAbstract
{
	tab_id: string
	title: ParagraphContent
	content: Array<ContentArticle>

	constructor(tab_id: string, title: ParagraphContent, content: Array<ContentArticle>)
	{
		super(ContentType.tab)
		this.tab_id = tab_id
		this.title = title
		this.content = content
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		if ( typeof(this.title)!='undefined' && this.title!=null )
		{
			result = result.concat( this.title.getImages() )
		}
		for (let each of this.content)
		{
			result = result.concat( each.getImages() )
		}
		return result
	}
}
