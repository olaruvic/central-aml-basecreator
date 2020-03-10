import { CleanUpFolders } from '../CleanUpFolders/CleanUpFolders';
import fs = require('fs')
import fse = require('fs-extra')
import path = require('path')
import colors = require('colors')
import { Debug } from '../Debug/Debug'
import f2s = require('../FileToString/fileToString')
import s2f = require('../StringToFile/stringToFile')
let needle = require('needle')
let cheerio = require('cheerio')
let _url = require('url')
import { JSON2Array } from '../JSON2Array/JSON2Array';
import '../String-extensions';
import { CreateFolders } from '../CreateFolders/CreateFolders';
import { TextExtractAMV } from '../TextExtract/TextExtractAMV';
import { ContentArticle } from '../TextExtract/data_objects/ContentArticle';


const EMPTY = '--empty--';


enum ImageDownloadDataSourceType
{
	img = 1,
	css
}
class ImageDownloadData
{
	source_type: ImageDownloadDataSourceType
	css_file_url: string
	source_url: string
	source_type_str: string
	raw_image_url: string
	image_name_ext: string
	origin: string
	target_path: string
	target_path_subdir: string
	tmp_dirName: string

	constructor(	sourceType: ImageDownloadDataSourceType, 
					css_file_url: string, 
					source_url: string, 
					source_type_str: string, 
					raw_image_url: string, 
					image_name_ext: string, 
					origin: string, 
					target_path: string, 
					target_path_subdir: string, 
					tmp_dirName: string
					)
	{
		this.source_type = sourceType
		this.css_file_url = css_file_url
		this.source_url = source_url
		this.source_type_str = source_type_str
		this.raw_image_url = raw_image_url
		this.image_name_ext = image_name_ext
		this.origin = origin
		this.target_path = target_path
		this.target_path_subdir = target_path_subdir
		this.tmp_dirName = tmp_dirName
	}
}


export class ImageSpider
{
	json_data: any
	target_path: string
	url_list: Array<any> = []
	image_dictionary: {[url: string]: number} = {}
	cleanup_images: boolean

	private site_enum_idx : number
	private downloadImages_list: Array<ImageDownloadData>
	private downloadImages_enum_idx: number
	private downloadImages_callback: ()=> void = null
	private downloadCssImage_list: Array<ImageDownloadData>
	private downloadCssImage_enum_idx: number
	private downloadCssImage_callback: ()=> void = null

	//#######################################################################################################
	constructor(image_target_path: string, json_data: any, cleanup_images: boolean) 
	{
		this.target_path = image_target_path
		this.json_data = json_data
		this.cleanup_images = cleanup_images
		// this.url_list = null
		this.url_list = this._create_url_list(image_target_path, json_data, true)

		// if (typeof(url_list)=='undefined' || url_list==null || url_list=='' )
		// {
		// 	console.log(colors.bgRed.white.bold(`Error: Parameter ${colors.underline('url_list')} required!\n`))
		// 	process.exit(1)
		// }
		// if ( fs.existsSync(url_list) == false )
		// {
		// 	console.log(colors.bgRed.white.bold(`Error: JSON File '${url_list}' does not exists!\n`))
		// 	process.exit(1)
		// }
		// let urlList = f2s.fileToString(url_list, true).trim()
		// if ( typeof(urlList)=='undefined' || urlList==null && urlList=='' )
		// {
		// 	console.log(colors.bgRed.white.bold(`Error: JSON File '${urlList}' is empty!\n`))
		// 	process.exit(1)		
		// }
		// this.url_list = urlList.split(/[\n\r]/igm).filter(r=>r!=='')

		if (typeof(image_target_path)=='undefined' || image_target_path==null || image_target_path=='' )
		{
			console.log(colors.bgRed.white.bold(`Error: Parameter ${colors.underline('image_target_path')} required!\n`))
			process.exit(1)
		}
		if ( fs.existsSync(this.target_path) == false )
		{
			fse.ensureDirSync(this.target_path)
		}
	}

	//#######################################################################################################
	run(): void
	{
		console.log(colors.red.bold("######################################################### INFO | processing URLs"))
		// process sites
		this.site_enum_idx = 0
		//console.log(colors.bgRed.white.bold(`${new Debug().shortInfo()}`), colors.bgRed.black(` :: Habe this._read_next_url() auskommentiert, damit ich this._cleanUp_multipleImages() schneller testen kann (es werden z.Z. keine Bilder heruntergeladen!!!)\n`))
		this._read_next_url()
		/*console.log(colors.bgRed.white.bold(`${new Debug().shortInfo()}`), colors.bgRed.black(` :: diese Zeile muss kommentiert werden, wenn test von CleanUp fertig\n`))
		new CleanUpFolders(this.target_path).run('images', 'global_images', 5)
		*/
	}

	//#######################################################################################################
	private _create_url_list(target_path: string, json: any, ignore_generali_domains: boolean): Array<any>
	{
		let url2path = CreateFolders.url2path(target_path, json, false)
		let result = []
		let domain = {}
		for (let each_path in url2path)
		{
			let page:any = url2path[each_path]
			// console.log(colors.yellow(each_path))
			for (let each_url of page.content.sourceUrl)
			{
				let url = each_url.trim()
				if ( url.length <= 0 ) 
				{
					if ( domain[EMPTY] == null ) domain[EMPTY] = []
					// domain[EMPTY].push( {path: each_path, page_name: page.name} )
					domain[EMPTY].push( {path: page.url, page_name: page.name} )
					continue;
				}
				if ( !url.endsWith('/') ) url += '/';
				
				let comps = new _url.URL(url)
				if ( ignore_generali_domains && /generali/i.test(comps.host) )
				{
					continue;
				}
				
				result.push( {target_path: each_path, url: url, page: page} )
				domain[comps.host] = ( domain[comps.host] == null ? 1 : (domain[comps.host]+1) )
			}
		}
	
		console.log(colors.red.bold("######################################################### INFO | number of urls"))
		let max_len = 0
		for (let host in domain)
		{
			if ( host.length > max_len ) max_len = host.length
		}
		for (let host in domain)
		{
			if ( typeof(domain[host]) == 'number' )
			{
				console.log(colors.white.bold(host.padding_right(max_len)), ':', colors.yellow.bold(domain[host].toString().padding_left(3)), 'links')
			}
			else
			{
				console.log(colors.white.bold(host.padding_right(max_len)), ':', colors.yellow.bold(domain[host].length.toString().padding_left(3)), 'links')
			}
		}
		if ( domain[EMPTY].length > 0 )
		{
			console.log(colors.red.bold('\nempty URLs:'))
			max_len = 0
			for (let each of domain[EMPTY])
			{
				if ( each.page_name.length > max_len ) max_len = each.page_name.length;
			}
			let count = 0
			for (let each of domain[EMPTY])
			{
				count += 1
				console.log(count.toString().padding_left(4), ':', colors.white.bold(each.page_name.padding_right(max_len)), '=>', colors.gray(each.path))
			}
		} 

		return result
	}

	//#######################################################################################################
	private _read_next_url(): void
	{
		let _this = this
		// let timeout = ( this.site_enum_idx <= 0 ? 1 : (this.site_enum_idx % 5 == 0 ? 5000 : 1) )
		// let timeout = ( this.site_enum_idx <= 0 ? 1 : 4000 )
		let timeout = 1
		// console.log(colors.cyan.bold((this.site_enum_idx <= 0 ? 1 : this.site_enum_idx) + " of " + this.url_list.length))
		setTimeout(() => {
			_this._delayed__read_next_url()
		}, timeout);
	}
	private _delayed__read_next_url(): void
	{
		const _this = this

		// get next URL
		let url_data = null
		while ( url_data==null && this.site_enum_idx<this.url_list.length ) 
		{
			url_data = this.url_list[this.site_enum_idx]
			this.site_enum_idx += 1
			// if ( url_data.match(/^\s*(\/{2,}|#)/i) != null )		// ignore comments := '// ...', '# ...'
			// {
			// 	url_data = null
			// }
		}
		if ( url_data != null )
		{
			//--------------------------------------
			// process next site
			//--------------------------------------
			console.log(colors.cyan.bold((this.site_enum_idx <= 0 ? 1 : this.site_enum_idx) + " of " + this.url_list.length), ':', url_data.url)
			// get images from URL
			needle.get(url_data.url, function(err, res, body) {
				if ( !err ) 
				{  
					_this._html_processSite(url_data, body, function() { _this._read_next_url() })
				}
				else
				{
					_this._read_next_url()
				}
			})
		}
		else
		{
			//--------------------------------------
			// all sites processed, then clean up image folders
			// clean-up: move all images that occur multiple times (all sites) in the global folder
			//--------------------------------------
			if ( this.cleanup_images == true )
			{
				let cleanUpFolders = new CleanUpFolders(this.target_path)
					cleanUpFolders.run('css', path.join(this.json_data.url, '_global_css_images'), 5)
					cleanUpFolders.cleanUp_emptyFolders('css')
					cleanUpFolders.run('images', path.join(this.json_data.url, '_global_images'), 5)
					cleanUpFolders.cleanUp_emptyFolders('images')
			}
		}
	}

	private _html_processSite(url_data: any, html_body: string, callback: ()=>void = null)
	{
		const $ = cheerio.load(html_body, {
			/*xml: {
			  normalizeWhitespace: true,
			}*/
		})

		let _this = this
		let url_obj = new _url.URL(url_data.url)
		let origin = url_obj.origin
		// let current_host_name = url_obj.hostname
		let __tmp_host = url_obj.host.replace(/\./ig, '_')
		let __tmp_dirName = url_obj.pathname.replace(/^(\/|\\)/ig, '').replace(/(\/|\\)$/ig, '').replace(/(\/|\\)/ig, '---').replace(/\./ig, '_')
		let __tmp_target_dirName = __tmp_host + '---' + __tmp_dirName
		let target_path = path.join(url_data.target_path, '_content', __tmp_target_dirName)

		// create source.url file
		this._createSourceURLFile(target_path, url_data.url)

		// init. list enum
		this.downloadImages_list = []
		// this.downloadImages_enum_idx = 0				... initialization further below
		// this.downloadImages_callback = callback		... initialization further below

		// parse site content
		if ( /amv.de/i.test(origin) )
		{
			let es = new TextExtractAMV("")
			let json = es.extractFromHtmlBody(url_data.url, html_body, true, true, true);
			this._extractImages(json, this.downloadImages_list);
			console.log(`${new Debug().shortInfo()} :: ${"DEBUG HALT".bold}`.bgRed.white)
			process.exit(1);
		}
		// else if ( /central.de/i.test(origin) )
		// {

		// }
		else
		{
			console.log(`${new Debug().shortInfo()} :: Error: UNKNOWN host ${origin.bold}!`.red)
			process.exit(1);
		}

		// // process img tags
		// $('img').each(function (i, e) {
		// 	// console.log(colors.cyan("--------"+i+":"), $(this).attr().src)
		// 	//---------------------------- process 'img.data-responsive-image' attribute
		// 	if ( ($(this).attr())['data-responsive-image'] )
		// 	{
		// 		// console.log(colors.yellow("--------"+i+`: ${colors.red.bold('CURRENTLY NO ACTION for')} data-responsive-image=`), ($(this).attr())['data-responsive-image'])
		// 		let img_src = JSON.parse( ($(this).attr())['data-responsive-image'] );
		// 		for (let each_ratio in img_src)
		// 		{
		// 			let ratio_data = img_src[each_ratio];
		// 			for (let each_size in ratio_data)
		// 			{
		// 				let orig_src = ratio_data[each_size];
		// 				let src_name_ext = `---${each_ratio}---${each_size}`
		// 				_this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.img, null, url_data.url, '.img ', orig_src, src_name_ext, origin, target_path, 'images', __tmp_dirName))
		// 			}
		// 		}
		// 	}
		// 	//---------------------------- process 'img.src' attribute
		// 	else if ( $(this).attr().src.trim().length > 0 )
		// 	{
		// 		//_this._copyImage(url, '.img ', $(this).attr().src, origin, target_path, 'images', __tmp_dirName)
		// 		_this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.img, null, url_data.url, '.img ', $(this).attr().src, null, origin, target_path, 'images', __tmp_dirName))
		// 	}
		// 	//---------------------------- process UNKNOWN: if 'img' tag does not contain 'src' or 'data-responsive-image' attribute
		// 	else
		// 	{
		// 		console.log(colors.bgRed("--------"+i+" :: UNKNOWN.img: "), $(this).attr())
		// 	}
		// })

		// // process link tags (External style sheet)
		// $('link').each(function (i, e) {
		// 	// console.log(colors.magenta("--------"+i+":"), $(this).attr())
		// 	let attrs = $(this).attr()
		// 	if ( attrs.rel.trim().toLowerCase()=='stylesheet' && attrs.href.length>0 )
		// 	{
		// 		// console.log(colors.cyan("--------"+i+":"), attrs)
		// 		let href = _this._checkAndFormatLocalURL(attrs.href, origin)
		// 		if ( href != null )
		// 		{
		// 			/*needle.get(href, function(err, resp, body) {
		// 				if ( !err )  
		// 				{
		// 					_this._css_getImageSources(url, '.link', body, origin, target_path, __tmp_dirName)
		// 				}
		// 			});
		// 			*/
		// 			_this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.css, href, url_data.url, '.link', null, null, origin, target_path, null, __tmp_dirName))
		// 		}
		// 		else
		// 		{
		// 			console.log(colors.bgRed("--------"+i+" :: external URL: "), attrs)	
		// 		}
		// 	}
		// 	else if ( attrs.rel.trim().toLowerCase()=='canonical' && attrs.href.length>0 )
		// 	{
		// 		// ignore link.rel="canonical"
		// 	}
		// 	else
		// 	{
		// 		console.log(colors.bgRed("--------"+i+" :: UNKNOWN.css: "), attrs)
		// 	}
		// })

		// // process style tags (Internal Style Sheet)
		// // ... implement here if needed

		// // process style attributes (Inline Styles)
		// // ... implement here if needed

		// // download images
		// this.downloadImages_enum_idx = 0
		// this.downloadImages_callback = callback
		// // console.log(colors.green("this.downloadImages_list.length="), this.downloadImages_list.length)
		// this._download_next_image()
		//--------------------------------
		// ATTENTION!
		//		The callback() must be called after each pass, 
		//		otherwise the search of the URL list will be aborted.
		//
/*		if ( callback != null ) 
		{ 
			callback() 
		}*/
		//--------------------------------
	}

	//#######################################################################################################
	private _createSourceURLFile(target_path: string, url: string)
	{
		let contents = `[InternetShortcut]\nURL=${url}\nIconIndex=0`
		let fpath = path.join(target_path, 'source.url')
		if ( fs.existsSync(target_path) == false )
		{
			fse.ensureDirSync(target_path)
		}
		s2f.stringToFile(fpath, contents, true)
	}

	//#######################################################################################################
	private _extractImages(json_array: Array<any>, result: Array<ImageDownloadData>)
	{
		for(let each of json_array)
		{
			let img_array = each.getImages()
			console.log(each.constructor.name, img_array.length)
			result = result.concat( img_array )
		}
		console.dir(result, {colors: true})
	}
}
