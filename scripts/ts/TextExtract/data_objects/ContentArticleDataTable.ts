const colors = require('colors');
import { Debug } from './../../Debug/Debug';
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';
import { ContentArticleDataParagraph } from './ContentArticleDataParagraph';
import { ContentImage } from './ContentImage';

export class ContentArticleDataTable extends ContentArticleDataAbstract
{
	rows: Array<Array<ContentArticleDataParagraph>>

	constructor()
	{
		super(ArticleContentType.table)
		this.rows = []
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		for (let each_row of this.rows)
		{
			for(let each_col of each_row)
			{
				result = result.concat( each_col.getImages() )
			}
		}
		return result
	}

/*	static init($: any, tag: any): ContentArticleDataTable
	{
		let table = new ContentArticleDataTable()
		//
		let table_rows = tag.children
		if ( table_rows[0].name == 'tbody' ) table_rows = table_rows[0].children
		//
		for( let row of table_rows )
		{
			let cols = []
			for( let col of row.children )
			{
				cols.push( $(col).text().trim() )
			}
			table.rows.push( cols )
		}

		return table
	}
	*/

	static init(url: string, $: any, tag: any): ContentArticleDataTable
	{
		let table = new ContentArticleDataTable()
			table._parse(url, $, tag)
		return table
	}

	private _parse(url: string, $: any, tag: any)
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
					if ( /tbody/i.test(each_tag.name) )
					{
						this._parse_tbody(url, $, each_tag);
					}
					else if ( /tr/i.test(each_tag.name) )
					{
						this._parse_trow(url, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1501")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1502")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_tbody(url: string, $: any, tag: any)
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
					if ( /tr/i.test(each_tag.name) )
					{
						this._parse_trow(url, $, each_tag);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1503")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1504")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_trow(url: string, $: any, tag: any)
	{
		let cols = []
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
					if ( /td/i.test(each_tag.name) )
					{
						let td = ContentArticleDataParagraph.init(url, $, each_tag, true)
						cols.push( td );
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1505")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1506")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
		//
		this.rows.push( cols )
	}
	
}
