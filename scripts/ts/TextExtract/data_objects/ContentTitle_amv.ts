import { DebugTag } from '../DebugTag';
import { Debug } from '../../Debug/Debug';
const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentImage } from './ContentImage';

export class ContentTitle_amv extends ContentAbstract
{
	text: string

	constructor(text: string)
	{
		super(ContentType.title_amv)
		this.text = text.trim()
	}

	getImages(): Array<ContentImage>
	{
		return [];
	}

	static init($: any, tag: any): ContentTitle_amv
	{
		return new ContentTitle_amv($(tag).text())
	}
}
