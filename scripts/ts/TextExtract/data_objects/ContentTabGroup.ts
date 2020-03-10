const colors = require('colors');
import { Debug } from '../../Debug/Debug';
import { ContentAbstract, ContentType } from './ContentAbstract';
import { ContentArticle } from './ContentArticle';
import { ParagraphContent } from './ParagraphContent';
import { ContentTab } from './ContentTab';
import { ContentImage } from './ContentImage';

export class ContentTabGroup extends ContentAbstract
{
	title = null
	tabs: Array<ContentTab> = []

	constructor()
	{
		super(ContentType.tab_group)
	}

	static init(url: string, $: any, tag: any): ContentTabGroup
	{
		let result = new ContentTabGroup()
			result._parse(url, $, tag)
		return result
	}

	getImages(): Array<ContentImage>
	{
		let result = []
		for (let each of this.tabs)
		{
			result = result.concat( each.getImages() )
		}
		return result
	}

	private _parse(url: string, $: any, tag: any)
	{
		let tab_headers: Array<ParagraphContent> = [];
		let tab_contents: {[tab_id: string]: Array<ContentArticle>} = {};
		//
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': 
				case 'comment':
					/* ignore */ 
					break;

				case 'tag':
					if ( /module-tabs-inner/i.test(cls) )
					{
						this._parse_module_tab_headers(url, $, each_tag, tab_headers);
					}
					else if ( /tab-content/i.test(cls) )
					{
						this._parse_module_tab_contents(url, $, each_tag, tab_contents);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}

		this.tabs = []
		for(let each_header of tab_headers)
		{
			let content = tab_contents[each_header.tab_id]
			if ( content != null )
			{
				let tab = new ContentTab(each_header.tab_id, each_header, content);
				this.tabs.push( tab );
			}
			else
			{
				const txt_maxLen = 30;
				const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
				console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red('Error: Content for tab id '+each_header.tab_id+' not found!')} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
			}
		}
		// console.dir(this, {colors: true, depth: 5});
	}

	private _parse_module_tab_headers(url: string, $: any, tag: any, result: Array<any>)
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
					if ( /tab-header/i.test(cls) )
					{
						let txt = tagObj.text().trim()
						this.title = (txt.length > 0 ? txt : null );
					}
					else if ( /input-group-btn/i.test(cls) )
					{
						this._parse_module_tab_header_group(url, $, each_tag, result)
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1003")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1004")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_module_tab_header_group(url: string, $: any, tag: any, result: Array<any>)
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
					switch ( each_tag.name )
					{
						case 'span':
							// ignore
							break;

						case 'ul':
							this._parse_module_tab_header_group_list(url, $, each_tag, result)
							break;

						default:
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1005")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							break
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1006")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_module_tab_header_group_list(url: string, $: any, tag: any, result: Array<any>)
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
					switch ( each_tag.name )
					{
						case 'li':
							this._parse_tab_header_title(url, $, each_tag, result)
							break;

						default:
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1007")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							break
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1008")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_tab_header_title(url: string, $: any, tag: any, result: Array<any>)
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
					switch ( each_tag.name )
					{
						case 'a':
							{
								result.push( ParagraphContent.initTabHeaderTitle(url, $, each_tag) );
							}
							break;

						default:
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1009")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
							break
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1010")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_module_tab_contents(url: string, $: any, tag: any, result: {[tab_id: string]: any})
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] `);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /tab-pane/i.test(cls) )
					{
						let tab_id = $(each_tag).prop('id')
						let blocks = []
						this._parse_module_tab_content_block(url, $, each_tag, blocks);
						result[tab_id] = blocks;
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1011")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1012")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

	private _parse_module_tab_content_block(url: string, $: any, tag: any, result: Array<any>)
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
					if ( /rte-content/i.test(cls) )
					{
						result.push( ContentArticle.init(url, $, each_tag) );
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1013")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					const txt_maxLen = 30;
					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1014")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					break;
			}
		}
	}

}
