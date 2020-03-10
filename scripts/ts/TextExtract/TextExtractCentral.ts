import colors = require('colors')
const fs = require('fs')
const path = require('path')
const root = require('../../../root')
const needle = require('needle')
const _url = require('url')
// import cheerio = require('cheerio')
import { FileSystem } from '../FileSystem/FileSystem'
import { stringToFile } from '../StringToFile/stringToFile'
import { fileToString } from '../FileToString/fileToString'
import { ContentTitle_central } from './data_objects/ContentTitle_central';
import { ContentArticle } from './data_objects/ContentArticle';
import { ContentImage } from './data_objects/ContentImage';
import { ContentAccordeon } from './data_objects/ContentAccordeon';
import { ContentIFrame } from './data_objects/ContentIFrame';
import { ContentTabGroup } from './data_objects/ContentTabGroup';
import { ContentTeaser } from './data_objects/ContentTeaser';
import { ParagraphContent } from './data_objects/ParagraphContent';
import { ContentArticleDataTitleHx } from './data_objects/ContentArticleDataTitleHx';
import { Debug } from '../Debug/Debug'
import { ENGINE_METHOD_DIGESTS } from 'constants'
// const pdf = require('pdf-parse')
// const glob = require("glob")
const cheerio = require('cheerio')

export class TextExtractCentral
{
	fpath_output_csv: string|null|undefined
	private _sitemap_links: Array<string>
	private _sitemap_links_pool: {[url: string]: number}
	private _sitemap_links_enum_idx: number
	private _404_notFound: number
	private _log_ifFound: boolean
	private _log_ifNotFound: boolean
	private _log_error: boolean

	//##########################################################################################
	constructor(fpath_output_csv?: string) 
	{
		this.fpath_output_csv = fpath_output_csv;
		this._sitemap_links = []
		this._sitemap_links_pool = {}
		this._sitemap_links_enum_idx = 0
		this._404_notFound = 0
		this._log_ifFound = true
		this._log_ifNotFound = false
		this._log_error = false

		if ( typeof(this.fpath_output_csv)=='undefined' || this.fpath_output_csv==null )
		{
			console.log(colors.bgRed.white(`Error: csv file path required!`))
			process.exit(1)
		}
	}

	//##########################################################################################
/*	extractFromUrl(
		starting_url: string, 
		// searchText_regexStr: string, 
		// ignoreUrlsRegEx: string, 
		// followURLs: boolean, 
		// followDomainsRegEx: string|null, 
		log_ifFound: boolean,
		log_ifNotFound: boolean,
		log_error: boolean,
		callback?: ()=>void
		)
	{
		let links: {[url: string]: number} = {}
		links[starting_url.trim().toLowerCase()] = 1
		//
		this._sitemap_links = Object.keys(links)
		this._sitemap_links_pool = links
		//
		this._exec_webExtract(log_ifFound, log_ifNotFound, log_error, callback)
	}
	*/
	extractFromUrl(
		url: string, 
		log_ifFound: boolean,
		log_ifNotFound: boolean,
		log_error: boolean,
		callback?: (json)=>void
		)
	{
		this._log_ifFound = log_ifFound
		this._log_ifNotFound = log_ifNotFound
		this._log_error = log_error
		//
		let _this = this;
		needle.get(url, function(err: any, res: any, body: any) {
			if ( !err ) 
			{  
				const current_url = _this._normalizeUrl(url as string)
				_this._extractText(current_url, body as string, callback)
			}
			else
			{
				if ( _this._log_error == true )
				{
					console.log(colors.bgRed.white('############ error'))
					console.dir(err, {colors: true, depth: 10})
				}
			}
		})
	}

	extractFromHtmlBody(
		url: string,
		html_body: string, 
		log_ifFound: boolean,
		log_ifNotFound: boolean,
		log_error: boolean
		): any
	{
		this._log_ifFound = log_ifFound
		this._log_ifNotFound = log_ifNotFound
		this._log_error = log_error
		//
		const current_url = this._normalizeUrl(url as string)
		return this._extractText(current_url, html_body)
	}

	private _exec_webExtract(
		log_ifFound: boolean,
		log_ifNotFound: boolean,
		log_error: boolean,
		callback?: ()=>void
		)
	{
		this._404_notFound = 0
		this._log_ifFound = log_ifFound
		this._log_ifNotFound = log_ifNotFound
		this._log_error = log_error

		let _this = this
		console.log(colors.cyan(`Extracting text ...`))
		this._sitemap_links_enum_idx = 0
		this._read_next_url(function() {
			// console.dir(_this.searchResults, {colors: true})
			console.log(colors.red(`${new Debug().shortInfo()} :: export_csv() implementation needed`));
			// _this._export_csv();
			if ( typeof(callback)!='undefined' && callback!=null )
			{
				callback()
			}
		})
	}

	private _read_next_url(callback?: ()=>void): void
	{
		let _this = this
		// let timeout = ( this.site_enum_idx <= 0 ? 1 : (this.site_enum_idx % 5 == 0 ? 5000 : 1) )
		// let timeout = ( this.site_enum_idx <= 0 ? 1 : 4000 )
		let timeout = 1
		//console.log(colors.cyan.bold((this._sitemap_links_enum_idx <= 0 ? 1 : this._sitemap_links_enum_idx+1) + " of " + this._sitemap_links.length))
		setTimeout(() => {
			_this._delayed__read_next_url(callback)
		}, timeout);
	}
	private _delayed__read_next_url(callback?: ()=>void): void
	{
		const _this = this

		// get next URL
		let url: string|null = null
		while ( url==null && this._sitemap_links_enum_idx<this._sitemap_links.length ) 
		{
			url = this._sitemap_links[this._sitemap_links_enum_idx]
			this._sitemap_links_enum_idx += 1
		}
		if ( url != null )
		{
			console.log(colors.yellow(`searching url (${colors.yellow.bold(this._sitemap_links_enum_idx.toString())} of ${colors.yellow.bold(this._sitemap_links.length.toString())}):`), colors.grey(url))
			needle.get(url, function(err: any, res: any, body: any) {
				if ( !err ) 
				{  
					const current_url = _this._normalizeUrl(url as string)
					_this._extractText(current_url, body as string, function() {
						_this._read_next_url(callback)
					})
				}
				else
				{
console.log(colors.bgRed.white(`############ needs implementation :: ${new Debug().shortInfo()}`)); 
process.exit(1);
/*					console.log("test #2.2");
					if ( _this._log_error == true )
					{
						console.log(colors.bgRed.white('############ error'))
						console.dir(err, {colors: true, depth: 10})
					}
					_this._404_notFound += 1
					_this._read_next_url(callback)
					*/
				}
			})
		}
		else
		{
			console.log(colors.yellow("no more urls in list"));
/*			console.log(colors.cyan(`${colors.cyan.bold((this._sitemap_links.length - this._404_notFound - this._num_ignored_urls).toString())} of ${colors.cyan.bold(this._sitemap_links.length.toString())} pages/URLs searched`))
			console.log(colors.cyan(`Search term in ${colors.cyan.bold(this.pages_searchTerm_found.length.toString())} pages found`))
			if ( typeof(callback)!='undefined' && callback!=null )
			{
				callback()
			}*/
		}
	}

	private _normalizeUrl(url: string): string
	{
/*		let res = url
			res = res.replace(/(https?:\/\/)/i, '')
			res = res.replace(/(\/\s*)$/i, '')			// '/' am Ende der URL löschen, wenn da
		return 'https://'+res*/
		let res = url
			res = res.replace(/(\/\s*)$/i, '')			// '/' am Ende der URL löschen, wenn da
		return res
	}

	private _extractText(url: string, html_body: string, callback?: (json)=>void): Array<any>
	{
		const $ = cheerio.load(html_body)
		//
		let result = [];
		this._parse_defaultContent_sections( url, $, $('article'), result );		// normaler Inhalt enthalten in <div class="content default">...<article class="...">...</article>...</div>
		this._parse_homeContent_sections( url, $, $('.content.home'), result);		// Verteiler enthalten in <div class="content home">...</div>

		if ( callback )
		{
			callback(result);
		}

/*		let articles = $('section .am-rt');
		articles.each(function(i, elem) {
			console.log(`++ [${$(this)}]\n`)
		});*/

		return result;
	}

	private _parse_defaultContent_sections(url: string, $: any, sections: any, result: Array<any>)
	{
		for (let idx = 0; idx < sections.length; idx++)
		{
			let each_tag_found = sections.get(idx)
			for( let each_tag of each_tag_found.children )
			{
				let tagObj = $(each_tag);
				let cls = tagObj.prop('class');
				switch ( each_tag.type )
				{
					case 'text': 
					case 'script':
						// ignore whitespaces
						break;

					case 'tag': 
						this._parse_section_tag(url, $, each_tag, result);
						break;

					default:
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;
				}
			}
		}
	}

	private _parse_homeContent_sections(url: string, $: any, sections: any, result: Array<any>)
	{
		for (let idx = 0; idx < sections.length; idx++)
		{
			let each_tag_found = sections.get(idx)
			for( let each_tag of each_tag_found.children )
			{
				let tagObj = $(each_tag);
				let cls = tagObj.prop('class');
				switch ( each_tag.type )
				{
					case 'text': 
					case 'script':
						// ignore whitespaces
						break;

					case 'tag': 
						if ( /cookies/i.test(cls) )
						{
							// ignore
						}
						else if ( /main/i.test(cls))
						{
							this._parse_homeContent_childs(url, $, each_tag, result);
						}
						else 
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #2.a")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;

					default:
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #2.b")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;
				}
			}
		}
	}

	private _parse_section_tag(url: string, $: any, tag: any, result: Array<any>)
	{
		const cls = $(tag).prop('class');
		const dataArticle_value = $(tag).prop('data-article');
		const isDataArticle = ( typeof(dataArticle_value)!='undefined' && dataArticle_value!=null );
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${cls}] isDataArticle=[${isDataArticle}${isDataArticle?", val=["+dataArticle_value+"]":""}]`);
		switch ( tag.name )
		{
			case 'div': 
				if ( /header/i.test(cls) )
				{
					result.push( ContentTitle_central.init_central(url, $, tag) );
				}
				else if ( isDataArticle == true )
				{
					this._parse_data_article(url, $, tag, result);
				}
				else
				{
					// result.push( ContentArticle.init(url, $, tag) );
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #3")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
				}
				break;
			
			default: 
				console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #4")} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
				break;
		}
	}

	private _parse_data_article(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{
				case 'text': 
					/* ignore whitespaces */ 
					break;

				case 'tag':
					if ( /placement/i.test(cls) )	// ARTICLE >> div.prop(data-article) >> .placement >> .row
					{
						this._parse_data_article(url, $, each_tag, result);
					}
					else if ( /row/i.test(cls) )
					{
						this._parse_data_article(url, $, each_tag, result);
					}
					else if ( /col-(sm|md)/.test(cls) )
					{
						this._parse_data_article_column(url, $, each_tag, result);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
				
				default: 
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #6")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}

	private _parse_data_article_column(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each_tag of tag.children )
		{
			const cls = $(each_tag).prop('class');
			const tagObj = $(each_tag);
			switch ( each_tag.type )
			{	
				case 'text': 
					/* ignore whitespaces */ 
					break;
				
				case 'tag':
					if ( /rte-content/i.test(cls) )
					{
						// this._parse_content_block(url, $, each_tag, result);
						result.push( ContentArticle.init(url, $, each_tag) );
					}
					else if ( /price-catcher-container/i.test(cls) )
					{
						this._parse_price_catcher_container(url, $, each_tag, result);
					}
					else if ( /module-tabs/i.test(cls) )
					{
						result.push( ContentTabGroup.init(url, $, each_tag) );
					}
					else if ( /teaser/i.test(cls) )
					{
						result.push( ContentTeaser.init(url, $, each_tag) );
					}
					else if ( /module-image/i.test(cls) )
					{
						result.push( ContentImage.init_moduleImage(url, $, each_tag) );
					}
					else if ( /section-subtitle/i.test(cls) )
					{
						result.push( ContentArticle.init(url, $, each_tag.parent) );
					}
					else if ( /module-collapsible/i.test(cls) )
					{
						this._parse_module_collapsible(url, $, each_tag, result);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #7")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
				
				default: 
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #8")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}

	// private _parse_content_block(url: string, $: any, tag: any, result: Array<any>)
	// {
	// 	// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
	// 	for( let each_tag of tag.children )
	// 	{
	// 		const cls = $(each_tag).prop('class');
	// 		const tagObj = $(each_tag);
	// 		//
	// 		// const txt_maxLen = 30;
	// 		// const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
	// 		// console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("---")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);			
	// 		switch ( each_tag.type )
	// 		{
	// 			case 'text': /* ignore */ break;

	// 			case 'tag':
	// 				result.push( ContentArticle.init(url, $, tag) );
	// 				break;

	// 			default:
	// 				{
	// 					const txt_maxLen = 30;
	// 					const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
	// 					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #9")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
	// 				}
	// 				break;
	// 		}
	// 	}
	// }

	private _parse_price_catcher_container(url: string, $: any, tag: any, result: Array<any>)
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
					if ( /inner/i.test(cls) )
					{
						result.push( ContentArticle.init(url, $, tag) );
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #10")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #11")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}

	private _parse_module_collapsible(url: string, $: any, tag: any, result: Array<any>)
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
					if ( /panel-group/i.test(cls) )
					{
						this._parse_module_collapsible_panel_group(url, $, each_tag, result);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #12")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #13")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
					}
					break;
			}
		}
	}

	private _parse_module_collapsible_panel_group(url: string, $: any, tag: any, result: Array<any>)
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
					if ( /panel/i.test(cls) )
					{
						this._parse_module_collapsible_panel(url, $, each_tag, result);
					}
					else if ( /a/i.test(each_tag.name) )
					{
						// a-Tag ignorieren
					}
					else if ( /btn/i.test(cls) )		// <=> /button/i.test(each_tag.name)
					{
						// Buttton zum schließen der Accordeons ignorieren
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #14")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #15")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
					}
					break;
			}
		}
	}

	private _parse_module_collapsible_panel(url: string, $: any, tag: any, result: Array<any>)
	{
		let title: string = null
		let articles: Array<ContentArticle> = []
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
					if ( /panel-heading/i.test(cls) )
					{
						let heading = ContentArticle.init(url, $, each_tag);
						for(let each_block of heading.data)
						{
							if ( /title/i.test(each_block.type) )
							{
								title = (each_block as ContentArticleDataTitleHx).text;
							}
						}
					}
					else if ( /panel-collapse/i.test(cls) )
					{
						let panel_content = tagObj.find('.rte-content')
						if ( panel_content.length > 0 )
						{
							articles.push( ContentArticle.init(url, $, panel_content[0]) );
						}
						else
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Error: Panel does not contains .rte-content")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
					}
					else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #16")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #17")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
					}
					break;
			}
		}

		if ( typeof(title)=='undefined' || title==null || title.length<=0 )
		{
			console.log(colors.red(`${colors.magenta(new Debug().shortInfo())} :: Error: <title> is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`))
			process.exit(1);
		}
		if ( articles.length <= 0 )
		{
			console.log(colors.red(`${colors.magenta(new Debug().shortInfo())} :: Error: <article> not found or is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`))
			process.exit(1);
		}
		result.push( new ContentAccordeon(title, articles) )
	}

	private _parse_homeContent_childs(url: string, $: any, tag: any, result: Array<any>)
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
					// if ( /module-stage/i.test(cls) )
					// {
					// }
					// else if ( /page-grid/i.test(cls) )
					// {
					// }
					// else
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #18")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #19")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}]`);
					}
					break;
			}
		}
	}
}
