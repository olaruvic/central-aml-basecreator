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
	origin: string
	target_path: string
	target_path_subdir: string
	tmp_dirName: string

	constructor(sourceType: ImageDownloadDataSourceType, css_file_url: string, source_url: string, source_type_str: string, raw_image_url: string, origin: string, target_path: string, target_path_subdir: string, tmp_dirName: string)
	{
		this.source_type = sourceType
		this.css_file_url = css_file_url
		this.source_url = source_url
		this.source_type_str = source_type_str
		this.raw_image_url = raw_image_url
		this.origin = origin
		this.target_path = target_path
		this.target_path_subdir = target_path_subdir
		this.tmp_dirName = tmp_dirName
	}
}


export class ImageSpider
{
	target_path: string
	url_list: Array<string> = []
	image_dictionary: {[image_fname: string]: number} = {}

	private site_enum_idx : number
	private downloadImages_list: Array<ImageDownloadData>
	private downloadImages_enum_idx: number
	private downloadImages_callback: ()=> void = null
	private downloadCssImage_list: Array<ImageDownloadData>
	private downloadCssImage_enum_idx: number
	private downloadCssImage_callback: ()=> void = null

	//#######################################################################################################
	constructor(url_list: string, image_target_path: string) 
	{
		this.target_path = image_target_path
		this.url_list = null

		if (typeof(url_list)=='undefined' || url_list==null || url_list=='' )
		{
			console.log(colors.bgRed.white.bold(`Error: Parameter ${colors.underline('url_list')} required!\n`))
			process.exit(1)
		}
		if ( fs.existsSync(url_list) == false )
		{
			console.log(colors.bgRed.white.bold(`Error: JSON File '${url_list}' does not exists!\n`))
			process.exit(1)
		}
		let urlList = f2s.fileToString(url_list, true).trim()
		if ( typeof(urlList)=='undefined' || urlList==null && urlList=='' )
		{
			console.log(colors.bgRed.white.bold(`Error: JSON File '${urlList}' is empty!\n`))
			process.exit(1)		
		}
		this.url_list = urlList.split(/[\n\r]/igm).filter(r=>r!=='')

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
		// process sites
		this.site_enum_idx = 0
		//console.log(colors.bgRed.white.bold(`${new Debug().shortInfo()}`), colors.bgRed.black(` :: Habe this._read_next_url() auskommentiert, damit ich this._cleanUp_multipleImages() schneller testen kann (es werden z.Z. keine Bilder heruntergeladen!!!)\n`))
		this._read_next_url()
		/*console.log(colors.bgRed.white.bold(`${new Debug().shortInfo()}`), colors.bgRed.black(` :: diese Zeile muss kommentiert werden, wenn test von CleanUp fertig\n`))
		new CleanUpFolders(this.target_path).run('images', 'global_images', 5)
		*/
	}

	//#######################################################################################################
	private _read_next_url(): void
	{
		let _this = this
		// let timeout = ( this.site_enum_idx <= 0 ? 1 : (this.site_enum_idx % 5 == 0 ? 5000 : 1) )
		// let timeout = ( this.site_enum_idx <= 0 ? 1 : 4000 )
		let timeout = 1
		console.log(colors.cyan.bold((this.site_enum_idx <= 0 ? 1 : this.site_enum_idx) + " of " + this.url_list.length))
		setTimeout(() => {
			_this._delayed__read_next_url()
		}, timeout);
	}
	private _delayed__read_next_url(): void
	{
		const _this = this

		// get next URL
		let url = null
		while ( url==null && this.site_enum_idx<this.url_list.length ) 
		{
			url = this.url_list[this.site_enum_idx]
			this.site_enum_idx += 1
			if ( url.match(/^\s*(\/{2,}|#)/i) != null )		// ignore comments := '// ...', '# ...'
			{
				url = null
			}
		}
		if ( url != null )
		{
			//--------------------------------------
			// process next site
			//--------------------------------------
			// get images from URL
			needle.get(url, function(err, res, body) {
				if ( !err ) 
				{  
					_this._html_getImageSources(url, body, function() { _this._read_next_url() })
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
			new CleanUpFolders(this.target_path).run('css', 'global_css', 1)
			new CleanUpFolders(this.target_path).run('images', 'global_images', 5)
		}
	}

	//#######################################################################################################
	// href		:= '/test/test2', 'https://<host>/<path>'
	// origin	:= 'https://www.amv.de', 'http://www.amv.de', 'https://amv.de', 'http://amv.de', ...
	//
	private _checkAndFormatLocalURL(href: string, origin: string): string|null
	{
		let url_obj = new _url.URL(origin)
		let host_name = url_obj.hostname
		// check if 'href' starts with 'http(s)' ... 'href' like 'http[s]://[www.]amv.de'
		if ( href.match(/^https?:\/\//i) != null )
		{
			if ( host_name.match(/www\./i) != null )
			{
				host_name = host_name.substr(4)		// 'www.'.length = 4
			}
			let regex = new RegExp('^https?:\/\/(www\.)?'+host_name, 'i')
			if ( href.match(regex) != null )
			{
				return href
			}
			return null
		}
		// 'href' like '/.../.../...'
		let imageURL = origin.replace(/[\/\\]$/i, '') + '/' + href.replace(/^[\/\\]/i, '')
		return imageURL
	}

	//#######################################################################################################
	private _html_getImageSources(url: string, html_body: string, callback: ()=>void = null)
	{
		const $ = cheerio.load(html_body, {
			/*xml: {
			  normalizeWhitespace: true,
			}*/
		})

		let _this = this
		let url_obj = new _url.URL(url)
		let origin = url_obj.origin
		// let current_host_name = url_obj.hostname
		let __tmp_host = url_obj.host.replace(/\./ig, '_')
		let __tmp_dirName = url_obj.pathname.replace(/^(\/|\\)/ig, '').replace(/(\/|\\)$/ig, '').replace(/(\/|\\)/ig, '---').replace(/\./ig, '_')
		let __tmp_target_dirName = __tmp_host + '---' + __tmp_dirName
		let target_path = path.join(this.target_path, __tmp_target_dirName)

		// create source.url file
		this._createSourceURLFile(target_path, url)

		// init. list enum
		this.downloadImages_list = []
		// this.downloadImages_enum_idx = 0				... initialization further below
		// this.downloadImages_callback = callback		... initialization further below

		// process img tags
		$('img').each(function (i, e) {
			// console.log(colors.cyan("--------"+i+":"), $(this).attr().src)
			//---------------------------- process 'img.data-responsive-image' attribute
			if ( ($(this).attr())['data-responsive-image'] )
			{
				console.log(colors.yellow("--------"+i+`: ${colors.red.bold('CURRENTLY NO ACTION for')} data-responsive-image=`), ($(this).attr())['data-responsive-image'])
			}
			//---------------------------- process 'img.src' attribute
			else if ( $(this).attr().src.trim().length > 0 )
			{
				//_this._copyImage(url, '.img ', $(this).attr().src, origin, target_path, 'images', __tmp_dirName)
				_this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.img, null, url, '.img ', $(this).attr().src, origin, target_path, 'images', __tmp_dirName))
			}
			//---------------------------- process UNKNOWN: if 'img' tag does not contain 'src' or 'data-responsive-image' attribute
			else
			{
				console.log(colors.bgRed("--------"+i+" :: UNKNOWN: "), $(this).attr())
			}
		})

		// process link tags (External style sheet)
		$('link').each(function (i, e) {
			// console.log(colors.magenta("--------"+i+":"), $(this).attr())
			let attrs = $(this).attr()
			if ( attrs.rel.trim().toLowerCase()=='stylesheet' && attrs.href.length>0 )
			{
				// console.log(colors.cyan("--------"+i+":"), attrs)
				let href = _this._checkAndFormatLocalURL(attrs.href, origin)
				if ( href != null )
				{
					/*needle.get(href, function(err, resp, body) {
						if ( !err )  
						{
							_this._css_getImageSources(url, '.link', body, origin, target_path, __tmp_dirName)
						}
					});
					*/
					_this.downloadImages_list.push(new ImageDownloadData(ImageDownloadDataSourceType.css, href, url, '.link', null, origin, target_path, null, __tmp_dirName))
				}
				else
				{
					console.log(colors.bgRed("--------"+i+" :: external URL: "), attrs)	
				}
			}
			else
			{
				console.log(colors.bgRed("--------"+i+" :: UNKNOWN: "), attrs)
			}
		})

		// process style tags (Internal Style Sheet)
		// ... implement here if needed

		// process style attributes (Inline Styles)
		// ... implement here if needed

		// download images
		this.downloadImages_enum_idx = 0
		this.downloadImages_callback = callback
		// console.log(colors.green("this.downloadImages_list.length="), this.downloadImages_list.length)
		this._download_next_image()
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
	private _download_next_image()
	{
		if ( this.downloadImages_enum_idx < this.downloadImages_list.length )
		{
			// console.log(colors.green("++ download :: enum_idx="), this.downloadImages_enum_idx)
			let _this = this
			let nextImg = this.downloadImages_list[this.downloadImages_enum_idx]
			this.downloadImages_enum_idx += 1

			switch ( nextImg.source_type )
			{
				case ImageDownloadDataSourceType.img:
					this._copyImage(
						nextImg.source_url, 
						nextImg.source_type_str, 
						nextImg.raw_image_url, 
						nextImg.origin, 
						nextImg.target_path, 
						nextImg.target_path_subdir, 
						nextImg.tmp_dirName,
						function() {
							_this._download_next_image()
						})
					break 

				case ImageDownloadDataSourceType.css:
					needle.get(nextImg.css_file_url, function(err, resp, body) {
						if ( !err )  
						{
							// _this._css_getImageSources(url, '.link', body, origin, target_path, __tmp_dirName)
							_this._css_getImageSources(
								nextImg.source_url, 
								nextImg.source_type_str, 
								body,
								nextImg.origin, 
								nextImg.target_path, 
								//nextImg.target_path_subdir, 
								nextImg.tmp_dirName,
								function() {
									_this._download_next_image()
								})
						}
						else
						{
							console.log(colors.bgRed.white('############################## Error downloading css file'))
							console.log(err)
							if ( typeof(_this._download_next_image)!='undefined' && _this._download_next_image!=null )
							{
								_this._download_next_image()
							}
						}
					});
					break

				default:
					{
						console.log(colors.bgRed.white.bold(`Error: Unknown source type (${nextImg.source_type})!\n`))
						console.log('nextImage=')
						console.dir(nextImg, {colors: true})
						process.exit(1)
					}
					break
			}
		}
		else
		{
			// console.log(colors.green("++ callback :: enum_idx="), this.downloadImages_enum_idx)
			if ( typeof(this.downloadImages_callback)!='undefined' && this.downloadImages_callback!=null )
			{
				this.downloadImages_callback()
			}
		}
	}

	//#######################################################################################################
	private _css_getImageSources(source_url: string, source_type: string, body: string, origin: string, target_path: string, __tmp_dirName: string, callback: ()=>void)
	{
		// match (ignore comments): 
		//		'/cms/themes/amvinternet/images/accordion-sprite.png'
		//		'http:/test.com/cms/themes/amvinternet/images/accordion-sprite.png'
		// 
		//const regex = /((https?:\/\/|\/[^\*])[^\s\'\"\)]+\.(png|jpg|gif))/gm

		// match (does not ignore comments): 
		//		'/* -pie-background: url(/cms/themes/amvinternet/images/accordion-sprite.png'
		//		'// -pie-background: url(/cms/themes/amvinternet/images/accordion-sprite.png'
		//		'/cms/themes/amvinternet/images/accordion-sprite.png'
		//		'http:/test.com/cms/themes/amvinternet/images/accordion-sprite.png'
		const regex = /((https?:\/\/|\/)[^\s\'\"\)]+\.(png|jpg|gif))/gm
		let m;
		let _this = this

		// console.log(body)

		this.downloadCssImage_list = []
		// this.downloadCssImage_enum_idx = 0			... initialization further below
		// this.downloadCssImage_callback = callback	... initialization further below
		while ((m = regex.exec(body)) !== null) 
		{
			if (m.index === regex.lastIndex) { regex.lastIndex++; }		// This is necessary to avoid infinite loops with zero-width matches
			
			// The result can be accessed through the `m`-variable.
			if ( m[0].match(/(\/\*|\/\/)/i) == null )	// process string, if does not start with '/*' or '//'
			{
				//this._copyImage(source_url, source_type, m[1], origin, target_path, 'css', __tmp_dirName, callback)
				this.downloadCssImage_list.push(new ImageDownloadData(ImageDownloadDataSourceType.css, null, source_url, source_type, m[1], origin, target_path, 'css', __tmp_dirName))
			}
/*			m.forEach((match, groupIndex) => {
				console.log(colors.red(`Found match, group ${groupIndex}: ${match}`))
			});*/
		}
		if ( this.downloadCssImage_list.length > 0 )
		{
			this.downloadCssImage_enum_idx = 0
			this.downloadCssImage_callback = callback
			this._download_next_css_image()
		}
		else
		{
			// wenn keine Bilder zum Download gefunden, dann callback aufrufen, damit die nächste CSS-Datei bzw. Site untersucht werden kann
			if ( typeof(callback)!='undefined' && callback!=null )
			{
				callback()
			}
		}
	}

	//#######################################################################################################
	private _download_next_css_image()
	{
		if ( this.downloadCssImage_enum_idx < this.downloadCssImage_list.length )
		{
			// console.log(colors.green("++ download :: enum_idx="), this.downloadCssImage_enum_idx)
			let _this = this
			let nextImg = this.downloadCssImage_list[this.downloadCssImage_enum_idx]
			this.downloadCssImage_enum_idx += 1

			this._copyImage(
				nextImg.source_url, 
				nextImg.source_type_str, 
				nextImg.raw_image_url, 
				nextImg.origin, 
				nextImg.target_path, 
				nextImg.target_path_subdir, 
				nextImg.tmp_dirName,
				function() {
					_this._download_next_css_image()
				})
		}
		else
		{
			if ( typeof(this.downloadCssImage_callback)!='undefined' && this.downloadCssImage_callback!=null )
			{
				this.downloadCssImage_callback()
			}
		}
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
	private _copyImage(
		source_url: string, 
		source_type: string, 
		raw_image_url: string, 
		origin: string, 
		target_path: string, 
		target_path_subdir: string, 
		__tmp_dirName: string, 
		callback: ()=>void
		)
	{	
		let _this = this
		let imageURL = this._checkAndFormatLocalURL(raw_image_url, origin)
		let comps = path.parse(imageURL)
		let image_fname = decodeURIComponent(comps.base)
		let full_targetPath = ( typeof(target_path_subdir)!='undefined' && target_path_subdir!=null && target_path_subdir.trim().length > 0
			? path.join(target_path, target_path_subdir)
			: target_path
		)
		if ( fs.existsSync(full_targetPath) == false )
		{
			fse.ensureDirSync(full_targetPath)
		}
		let image_targetPath = path.join(full_targetPath, image_fname)
		if ( this.image_dictionary[image_targetPath] != null )
		{
			if ( typeof(callback)!='undefined' && callback!=null )
			{
				callback()
			}
			return	// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Bild wurde bereits gespeichert - muss nicht noch ein Mal gedownloadet werden
		}
		this.image_dictionary[image_targetPath] = 1
		needle.get(imageURL, { output: image_targetPath }, function(err, resp, body) {
			console.log(`-------- source${colors.yellow(source_type)} =`, colors.grey(imageURL))
			if ( !err )
			{
				let addSubDir = ( typeof(target_path_subdir)!='undefined' && target_path_subdir!=null && target_path_subdir.trim().length > 0
					? path.sep+target_path_subdir
					: ''
				)
				console.log(`         target${colors.yellow(source_type)} = ${colors.green(_this.target_path)}${colors.green.bold(__tmp_dirName)}${colors.cyan(addSubDir)}${colors.green(path.sep+image_fname)}`)
			}
			else
			{
				console.log(colors.bgRed.white('############################## Error'))
				console.log(err)
			}
			if ( typeof(callback)!='undefined' && callback!=null )
			{
				callback()
			}
		});
	}
}
