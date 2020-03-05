import { DebugTag } from '../DebugTag';
import { Debug } from '../../Debug/Debug';
const colors = require('colors');
import { ContentAbstract, ContentType } from './ContentAbstract';

export class ContentTitle_amv extends ContentAbstract
{
	text: string

	constructor(text: string)
	{
		super(ContentType.title_amv)
		this.text = text.trim()
	}

	static init($: any, tag: any): ContentTitle_amv
	{
		return new ContentTitle_amv($(tag).text())
	}

	static init_central(url: string, $: any, tag: any, result: Array<any>)
	{
		const page_header = $(tag).find('.page-header');
		if ( page_header.length <= 0 )
		{
			const txt_maxLen = 30;
			const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
			console.log(`${colors.magenta(new Debug().shortInfo())} :: 'page-header' not found! type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			return
		}

		for (let each_tag of page_header[0].children)
		{
			let tagObj = $(each_tag);
			DebugTag.print($, each_tag);
			// switch ( each_tag.type )
			// {
			// 	case 'text': 
			// 	case 'script':
			// 		/* ignore whitespaces */ 
			// 		break;

			// 	case 'tag': 
			// 		_parse_seaction_tag(url, $, each_tag, result);
			// 		break;

			// 	default:
			// 		{
			// 			const txt_maxLen = 30;
			// 			const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
			// 			console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			// 		}
			// 		break;
			// }
		}
		process.exit(1);
	}
}
