import colors = require('colors')
const fs = require('fs')
const path = require('path')
const root = require('../../../root')
const needle = require('needle')
const _url = require('url')
// import cheerio = require('cheerio')
import { Debug } from '../Debug/Debug'
import { FileSystem } from '../FileSystem/FileSystem'
import { stringToFile } from '../StringToFile/stringToFile'
import { fileToString } from '../FileToString/fileToString'
import { ContentTitle_amv } from './data_objects/ContentTitle_amv';
import { ContentArticle } from './data_objects/ContentArticle';
import { ContentImage } from './data_objects/ContentImage';
import { ContentAccordeon } from './data_objects/ContentAccordeon';
import { ContentIFrame } from './data_objects/ContentIFrame';
import { ContentArticleDataParagraph } from './data_objects/ContentArticleDataParagraph'
import { ContentTeaser_amv } from './data_objects/ContentTeaser_amv'
// const pdf = require('pdf-parse')
// const glob = require("glob")
const cheerio = require('cheerio')

export class TextExtractAMV
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
					if ( _this._log_error == true )
					{
						console.log(colors.bgRed.white('############ error'))
						console.dir(err, {colors: true, depth: 10})
					}
					_this._404_notFound += 1
					_this._read_next_url(callback)
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
		this._parse_head_image( url, $, $('#am-pagevisual'), result );
		this._parse_sections( url, $, $('.ym-col1 .ym-cbox'), result );

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

	private _parse_head_image(url: string, $: any, head_image_section: any, result: Array<any>)
	{
		for (let idx = 0; idx < head_image_section.length; idx++)
		{
			let each_tag_found = head_image_section.get(idx)
			for( let each_tag of each_tag_found.children )
			{
				let tagObj = $(each_tag);
				let cls = tagObj.prop('class')
				switch ( each_tag.type )
				{
					case 'text': 
						// ignore whitespaces
						break;

					case 'tag': 
						if ( /img/i.test(tagObj) )
						{
							result.push( ContentImage.init(url, $, each_tag) );
						}
						else
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1000")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;

					default:
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1001")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;
				}
			}
		}
	}

	private _parse_sections(url: string, $: any, sections: any, result: Array<any>)
	{
		for (let idx = 0; idx < sections.length; idx++)
		{
			let each_tag_found = sections.get(idx)
			for( let each_tag of each_tag_found.children )
			{
				let tagObj = $(each_tag);
				let cls = tagObj.prop('class')
				switch ( each_tag.type )
				{
					case 'text': 
					case 'script':
						// ignore whitespaces
						break;

					case 'tag': 
						if ( /section/i.test(each_tag.name) )
						{
							this._parse_section(url, $, each_tag, result);
						}
						else if ( /footer/i.test(each_tag.name) )
						{
							// ignore
						}
						else
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG #1.a")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;

					default:
						{
							const txt_maxLen = 30;
							const txt = $(each_tag).text().trim().replace(/[\n\r]+/, '');
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1.b")} :: type=[${each_tag.type}] name=[${each_tag.name}] class=[${$(each_tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
						}
						break;
				}
			}
		}
	}

	private _parse_section(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each of tag.children )
		{
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}] text=[${$(each).text().trim()}]`);
			switch ( each.type )
			{
				case 'text': 
				case 'script':
					// ignore whitespaces
					break;

				case 'tag':
					this._parse_section_tag(url, $, each, result);
					break;

				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #1.c")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
					break;
			}
		}
	}

	private _parse_section_tag(url: string, $: any, tag: any, result: Array<any>)
	{
		let tagObj = $(tag)
		let tag_id = tagObj.prop('id')
		let cls = tagObj.prop('class')
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${cls}]`);
		switch ( tag.name )
		{
			case 'header': 
				result.push( ContentTitle_amv.init($, tag) );
				break;

			case 'div': 
				if ( /am-rt/i.test(cls) )
				{
					result.push( ContentArticle.init(url, $, tag) );
				}
				else if ( /accordiongrp/i.test(cls) )
				{
					this._parse_accordeon_group(url, $, tag, result);
				}
				else if ( /am-content-/i.test(cls) )
				{
					this._parse_teaser_group(url, $, tag, result)
				}
				// ACHTUNG!!! diese if-Anweisung, sollte am Besten die Letze vor der else-Anweisung sein
				else if (  (typeof(tag_id)!='undefined' && tag_id!=null && tag_id.trim().length>0) 
						|| ((typeof(tag_id)=='undefined' || tag_id==null) && (typeof(cls)=='undefined' || cls==null)) 
						)
				{
					// interaktiver Modul ignorieren
				}
				else
				{
					const txt_maxLen = 30;
					const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #2")} :: type=[${tag.type}] id=[${tag_id}] name=[${tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
				}
				break;

			case 'img': 
				result.push( ContentImage.init(url, $, tag) );
				break;
			
			case 'iframe':
				result.push( ContentIFrame.init(url, $, tag) );
				break;
			
			case 'a':
			case 'nav':
			case 'link':
				// ignore
				break;

			case 'section':
				// igonrieren
				//
				// Habe nur ein Beispiel gefunden: https://www.amv.de/sonstiges/
				// Enthält zurzeit nichts wichtiges, nur zwei Buttons (Links)
				break;
			
			default: 
				{
					const txt_maxLen = 30;
					const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #3")} :: type=[${tag.type}] name=[${tag.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
				}
				break;
		}
	}

	private _parse_accordeon_group(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each of tag.children )
		{
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}] text=[${$(each).text().trim()}]`);
			switch ( each.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					// console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #4")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
					switch ( each.name )
					{
						case 'article':
							this._parse_accordeon(url, $, each, result)
							break;
						
						case 'div':
							if ( /accordion-close/i.test($(each).prop('class')) )
							{
								// ignore
							}
							else
							{
								console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
							}
							break;
						
						default:
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
							break;
					}
					break;

				default:
					console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #5")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
					break;
			}
		}
	}

	private _parse_accordeon(url: string, $: any, tag: any, result: Array<any>)
	{
		let _this = this
		let title: string = null
		let articles: Array<ContentArticle> = []

		for( let each of tag.children )
		{
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}] text=[${$(each).text().trim()}]`);
			if ( each.type == 'tag' )
			{
				switch ( each.name )
				{
					case 'a':
						let headers = $('header', each)
						if ( headers.length > 0 ) 
						{
							title = $(headers[0]).text().trim()
						}
						break;
					
					case 'div':
						if ( /am-accordion-cnt-wrp/i.test($(each).prop('class')) )
						{
							this._parse_accordeon_cntWrp(url, $, each, articles);
							/*$('.am-rt', each).each((i, element) => {
								let tmp_res = [];
								//
								_this._parse_section_tag(url, $, element, tmp_res);
								//
								if ( tmp_res.length != 1 )
								{
									console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Error: No or too many article(s)!")} ${colors.red(` num=${tmp_res.length}`)} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
									process.exit(1)
								}
								let tmp_article = tmp_res[0];
								if ( tmp_article instanceof ContentArticle )
								{
									article = tmp_article
								}
								else
								{
									console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Error: <tmp_res> contains unknwon Objects!")}`);
									console.dir(tmp_res, {colors: true});
									process.exit(1)
								}
							});
							// article = ContentArticle.init($, each)
							*/
						}
						else
						{
							console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown DIV")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
						}
						break;
					
					default:
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown TAG")} :: type=[${each.type}] name=[${each.name}] class=[${$(each).prop('class')}]`);
						break;
				} // end switch
			} 
		} // end for each

		if ( typeof(title)=='undefined' || title==null || title.length<=0 )
		{
			console.log(colors.red(`${colors.magenta(new Debug().shortInfo())} :: Error: <title> is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`))
			process.exit(1);
		}
		// dieser Fall kann vorkommen, wenn ein Accordeon nur ein interaktiver Modul (wird ignoriert) enthält
		// if ( articles.length <= 0 )
		// {
		// 	console.log(colors.red(`${colors.magenta(new Debug().shortInfo())} :: Error: <article> not found or is empty! tag=[type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]]`))
		// 	process.exit(1);
		// }
		result.push( new ContentAccordeon(title, articles) )
	}

	private _parse_accordeon_cntWrp(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each of tag.children )
		{
			let tagObj = $(each);
			let cls = tagObj.prop('class');
			switch ( each.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /am-accordion-cnt/i.test(cls) )
					{
						this._parse_accordeon_cnt(url, $, each, result);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #6 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #7")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}

	private _parse_accordeon_cnt(url: string, $: any, tag: any, result: Array<any>)
	{
		let hasInteractiveModuleHeader = false;
		{
			const txt_maxLen = 30;
			const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
			// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
		}
		for( let each of tag.children )
		{
			let tagObj = $(each);
			let cls = tagObj.prop('class');
			switch ( each.type )
			{
				case 'text': 
					// ignore
					break;

				case 'script':
					hasInteractiveModuleHeader = true;
					break;

				case 'tag':
					let tag_id = tagObj.prop('id');
					if ( /link/i.test(each.name) )
					{
						hasInteractiveModuleHeader = true;
					}
					else if ( /div/i.test(each.name) && (hasInteractiveModuleHeader == true) )
					{
						// interaktives Module ignorieren
						hasInteractiveModuleHeader = false;		// Flag zurücksetzen
					}
					else if ( /am-rt/i.test(cls) )
					{
						hasInteractiveModuleHeader = false;
						//
						// this._parse_section_tag(url, $, each, result);
						result.push( ContentArticle.init(url, $, each) );
					}
					else if ( /p/i.test(each.name) )
					{
						hasInteractiveModuleHeader = false;
						//
						let p = ContentArticleDataParagraph.init(url, $, each, false)
						if ( p.textComponents.length > 0 )
						{
							let article = new ContentArticle()
								article.data.push( p )
							result.push( article );
						}
					}
					else
					{
						hasInteractiveModuleHeader = false;
						//
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #8 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						hasInteractiveModuleHeader = false;
						//
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #9")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}

	private _parse_teaser_group(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each of tag.children )
		{
			let tagObj = $(each);
			let cls = tagObj.prop('class');
			switch ( each.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /am-content-teaser-link/i.test(cls) )
					{
						this._parse_teaser(url, $, each, result);
					}
					else
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #10 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #11")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}

	private _parse_teaser(url: string, $: any, tag: any, result: Array<any>)
	{
		// console.log(`${colors.magenta(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}]`);
		for( let each of tag.children )
		{
			let tagObj = $(each);
			let cls = tagObj.prop('class');
			switch ( each.type )
			{
				case 'text': /* ignore */ break;

				case 'tag':
					if ( /am-content-teaser/i.test(cls) )
					{
						result.push( ContentTeaser_amv.init_amv(url, $, each) );
					}
					else
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #12 TAG")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;

				default:
					{
						const txt_maxLen = 30;
						const txt = tagObj.text().trim().replace(/[\n\r]+/, '');
						console.log(`${colors.magenta(new Debug().shortInfo())} :: ${colors.red("Unknown #13")} :: type=[${each.type}] name=[${each.name}] class=[${cls}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
					}
					break;
			}
		}
	}
}
