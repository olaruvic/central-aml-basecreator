import { DebugTag } from '../DebugTag';
import { Debug } from '../../Debug/Debug';
const colors = require('colors');
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ContentArticle } from './ContentArticle';
import { ContentImage } from './ContentImage';

export class ContentArticleDataTooltip extends ContentArticleDataAbstract
{
	tooltip_id: string|null
	tooltip: ContentArticle|null

	constructor()
	{
		super(ArticleContentType.tooltip_amv);
		//
		this.tooltip_id = null;
		this.tooltip = null;
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		if ( typeof(this.tooltip)!='undefined' && this.tooltip!=null )
		{
			result.push( this.tooltip.getImages() )
		}
		return result
	}

	static init_amv(currentUrl: string, $: any, tag: any): ContentArticleDataAbstract
	{
		let result = new ContentArticleDataTooltip();
			result._parse_amv(currentUrl, $, tag);
		return result;
	}

	private _parse_amv(url: string, $: any, tag: any)
	{
		let tooltip_id = $(tag).prop('data-inline-target');
		if ( typeof(tooltip_id)!='undefined' && tooltip_id!=null && tooltip_id.trim().length>0 )
		{
			let tooltip_data = $('#'+tooltip_id);
			if ( tooltip_data.length > 0 )
			{
				this.tooltip_id = tooltip_id;
				//
				let tooltip_content = tooltip_data.get(0);
				this._parse_tooltip_amv_content( url, $, tooltip_content )
			}
		}
	}

	private _parse_tooltip_amv_content(url: string, $: any, tag: any)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /am-rt/i.test(tagObj.prop('class')) )
					{
						this.tooltip = ContentArticle.init(url, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1601")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1602")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}
}
