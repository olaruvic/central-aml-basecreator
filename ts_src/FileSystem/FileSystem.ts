const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

export class FileSystem
{
	constructor() {}

	static updateFileExtension(current_fpath: string, new_fextension: string): string
	{
		let comps = path.parse(current_fpath)
		if ( !new_fextension.startsWith('.') ) { new_fextension = '.' + new_fextension }
		return path.join(comps.dir, comps.name + new_fextension)
	}

	static appendFileName(current_fpath: string, nameToAdd: string): string
	{
		if ( typeof(nameToAdd)=='undefined' || nameToAdd==null ) return current_fpath
		if ( nameToAdd.length <= 0 ) return current_fpath
		let comps = path.parse(current_fpath)
		return path.join(comps.dir, comps.name + nameToAdd + comps.ext)
	}

	static createFolder(fpath: string)
	{
		let comps = path.parse(fpath)
		let target_path = ( comps.ext.trim().length > 0
			? comps.dir
			: fpath
			)
		if ( fs.existsSync(target_path) == false )
		{
			fse.ensureDirSync(target_path)
		}
	}
}