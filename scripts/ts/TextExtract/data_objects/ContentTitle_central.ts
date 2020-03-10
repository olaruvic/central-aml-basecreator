import { DebugTag } from '../DebugTag';
import { Debug } from '../../Debug/Debug';
const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentTitle_amv } from './ContentTitle_amv';
import { ContentImage } from './ContentImage';

export class ContentTitle_central extends ContentTitle_amv
{
	subtitle: string

	constructor(text: string, subtitle: string)
	{
		super("");
		this.type = ContentType.title_central;
		this.text = text.trim()
		this.subtitle = subtitle.trim()
	}

	getImages(): Array<ContentImage>
	{
		return [];
	}

	static init_central(url: string, $: any, tag: any): ContentTitle_central
	{
		const page_header = $(tag).find('.page-header');
		if ( page_header.length <= 0 )
		{
			const txt_maxLen = 30;
			const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
			console.log(`${colors.magenta(new Debug().shortInfo())} :: 'page-header' not found! type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			return
		}

		let title = new ContentTitle_central("", "");

		for (let each_tag of page_header[0].children)
		{
			let tagObj = $(each_tag);
			// DebugTag.print($, each_tag);
			switch ( each_tag.type )
			{
				case 'text': 
					/* ignore whitespaces */ 
					break;

				case 'tag': 
					// DebugTag.print($, each_tag);
					switch ( each_tag.name )
					{
						case 'h1': 
							title.text = tagObj.text().trim(); 
							break;
						
						case 'p': 
							title.subtitle = tagObj.text().trim(); 
							break;
						
						default:
							const txt_maxLen = 30;
							const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
		
		return title;
	}
}
