import root = require('../../../root')
import colors = require('colors')
import path = require('path')
import { JSON2Array } from '../JSON2Array/JSON2Array';
import fse = require('fs-extra')
import URL = require('url')

export class CreateFolders
{
	constructor() {}

	static exec(target_path: string, json: any, stopExecOnError: boolean)
	{
		let cf = new CreateFolders()
		let error = cf._createFolders(target_path, json, false, false)
		if ( error.length > 0 )
		{
			console.log(colors.red.bold("Fehler: Mehrfacheinträge gefunden!"))
			for( let each of error )
			{
				console.log(` • ${colors.red(each.path)} => ${colors.red.bold(each.obj.name)}`)
			}
			if ( stopExecOnError )
			{
				process.exit(1)
			}
		}
		cf._createFolders(target_path, json, true, true)
	}

	private _createFolders(target_path: string, json: any, createFolders: boolean, log: boolean): Array<any>
	{
		let check = {}
		let error = []
		let folder_array = new JSON2Array(json).array
		let count = 0
		for(let each of folder_array)
		{
			let comps = URL.parse(each.url)
			let dir = path.join(target_path, comps.host, comps.pathname);
			if ( !dir.endsWith(path.sep) ) dir += path.sep;
			//
			if ( check[dir] == null )
			{
				check[dir] = 1
				count += 1
				if ( log )
				{
					let root = path.join(target_path, comps.host)
					console.log(colors.white.bold(this._formatStr(count, 4)), colors.gray(root) + colors.white(comps.pathname));
				}
				if ( createFolders ) fse.ensureDirSync(dir);
			}
			else
			{
				error.push( {path: dir, obj: each} )
			}
		}
		return error
	}

	private _formatStr(num: number, len: number): string
	{
		let res = num.toString()
		for(let idx = res.length; idx < len; idx++)
		{
			res = ' ' + res;
		}
		return res
	}
}
