const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ParagraphContent } from './ParagraphContent';
import { ContentImage } from './ContentImage';


export class ContentArticleDataDownloadLink extends ContentArticleDataAbstract
{
	text: ParagraphContent = null
	file_size: string = null

	constructor()
	{
		super(ArticleContentType.download_link)
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		if ( typeof(this.text)!='undefined' && this.text!=null )
		{
			result.push( this.text.getImages() )
		}
		return result
	}

	static init(url: string, $: any, tag: any): ContentArticleDataDownloadLink
	{
		let result = new ContentArticleDataDownloadLink();
		//
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( each_tag.name == "a" && /icon-download/i.test(cls) )
					{
						// let txt = tagObj.text().trim()
						// result.text = (txt.length > 0 ? txt : null );
						result.text = ParagraphContent.initLink(url, $, each_tag);
					}
					else if ( each_tag.name == "span" && /file-size/i.test(cls) )
					{
						let txt = tagObj.text().trim()
						result.file_size = (txt.length > 0 ? txt : null );
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1201")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1202")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
		//
		return result
	}
}
