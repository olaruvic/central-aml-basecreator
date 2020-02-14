import root = require('../../../root')
import colors = require('colors')
import path = require('path')
import { JSON2Array } from '../JSON2Array/JSON2Array';
import fse = require('fs-extra')
import URL = require('url')
import '../String-extensions';

export class CreateFolders
{
	constructor() {}

	static exec(target_path: string, json: any)
	{
		let json2arr = new JSON2Array(json, false)
		//
		let cf = new CreateFolders()
		cf._createFolders(target_path, json2arr, true, true)
		//
		if ( json2arr.error.length > 0 )
		{
			console.log(colors.red.bold("---------------------------------------------- Fehlerhafte Einträge"))
			for( let each of json2arr.error )
			{
				console.log(` • ${colors.red(each.url)} => ${colors.red.bold(each.page.name)}`)
				console.log(`   ${colors.white.bold("NOTES")}: ${(each.page.notes.trim().length > 0 ? each.page.notes : 'no notes')}`)
				console.dir(each.page.content.sourceUrl, {colors: true})
				console.log(colors.red.bold("----------------------------------------------"))
			}
			console.log();
		}
	}

	static url2path(target_path: string, json: any, log: boolean): {[url: string]: string}
	{
		let json2arr = new JSON2Array(json, false)
		//
		let cf = new CreateFolders()
		return cf._createFolders(target_path, json2arr, false, false)
	}

	private _createFolders(target_path: string, json2arr: JSON2Array, log: boolean, createFolders: boolean): {[target_path: string]: any}
	{
		let folder_array = json2arr.array
		let count = 0
		let url2path = {}
		//
		for(let each of folder_array)
		{
			count += 1;
			//
			let dir = '';
			if ( each.isVanityUrl )
			{
				let comps_url = URL.parse(each.url)
				let comps = URL.parse(each.vanity)
				dir = path.join(target_path, comps_url.host, 'vanity-urls', comps.host+comps.pathname );
				if ( !dir.endsWith(path.sep) ) dir += path.sep;
				//
				if ( log )
				{
					console.log(colors.white.bold(count.toString().padding_left(4, ' ')), colors.yellow.bold(dir));
				}
			}
			else
			{
				let comps = URL.parse(each.url)
				dir = path.join(target_path, comps.host, comps.pathname);
				if ( !dir.endsWith(path.sep) ) dir += path.sep;
				//
				if ( log )
				{
					console.log(colors.white.bold(count.toString().padding_left(4, ' ')), colors.white(dir));
				}
			}
			// save result path
			url2path[dir] = each;
			// create path
			if ( createFolders )
			{
				fse.ensureDirSync(dir);
			}
		}
		return url2path
	}
}
