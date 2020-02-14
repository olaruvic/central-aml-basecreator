import fs = require('fs')
import fse = require('fs-extra')
import path = require('path')
import colors = require('colors')
import { Debug } from '../Debug/Debug'
import glob = require('glob')


class FileData
{
	mv_full_fpaths: Array<string>
	fsize: number
	count: number

	constructor(full_fpath: string, fsize: number)
	{
		this.mv_full_fpaths = [ full_fpath ]
		this.fsize = fsize
		this.count = 0
	}

	addFileToMove(full_fpath: string)
	{
		this.mv_full_fpaths.push(full_fpath)
		this.count += 1
	}
}


export class CleanUpFolders
{
	target_path : string

	//#######################################################################################################
	constructor(target_path: string)
	{
		this.target_path = target_path
	}

	//#######################################################################################################
	private _getFileSize(filename: string): number 
	{
		const stats = fs.statSync(filename)
		const fileSizeInBytes = stats.size
		return fileSizeInBytes
	}

	//#######################################################################################################
	// cleanUpIfGTNumDoubles == -1 : move all images
	//
	run(subDir_name: string, targetDir_name: string, cleanUpIfGTNumDoubles: number)
	{
		console.log(colors.yellow.bold(`--------------------- cleaning up ${subDir_name} folders`))
		let css_files = glob.sync(path.join(this.target_path, '**', subDir_name, '*'), {
			'mark': true, 							// Add a '/' character to directory matches
			'dot': false, 							// alle Dateien die mit '.' anfangen ignorieren, z.B. '.DS_Store'
			'ignore': [path.join('**','.*')]		// da 'dot' = false (default), müssen '**/.*' nicht mehr explizit ignoriert werden - habe es nur als Platzhalter eingebaut, falls später irgendwelche Dateien noch ignoriert werden müssen
		})
		
		let global_path = path.join(this.target_path, targetDir_name)
		if ( fs.existsSync(global_path) == false )
		{
			fse.ensureDirSync(global_path)
		}

		let filesToMove : {[fname: string]: FileData} = {}
		for (let each_fpath of css_files)
		{
			// console.log(`++ ${each_fpath}`.yellow.bold)
			let fname = path.basename(each_fpath)
			let fsize = this._getFileSize(each_fpath)
			let check = filesToMove[fname]
			let addFile = true
			if ( check!=null && check.fsize==fsize )
			{
				// console.log('	++ add file to move'.cyan)
				addFile = false
				check.addFileToMove(each_fpath)
			}
			if ( addFile == true )
			{
				// console.log('	++ adding new file'.green)
				filesToMove[fname] = new FileData(each_fpath, fsize)
			}
		}

		for (let each_fname of Object.keys(filesToMove))
		{
			let each_file = filesToMove[each_fname]
			if ( cleanUpIfGTNumDoubles==-1 || each_file.count>=cleanUpIfGTNumDoubles )
			{
				// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> moving'.bgRed.white.bold)
				// console.dir(each_file, {colors: true})
				for (let idx = 0; idx < each_file.mv_full_fpaths.length; idx++)
				{
					let src = each_file.mv_full_fpaths[idx]
					let dst = path.join(global_path, each_fname)
					if ( idx == 0 )
					{
						console.log(colors.grey(`moved to global : `), dst.green.bold)
						fs.renameSync(src, dst)
					}
					else
					{
						fs.unlinkSync(src)
					}
				}
			}
		}
	}

	cleanUp_emptyFolders(subDir_name: string)
	{
		let css_folders = glob.sync(path.join(this.target_path, '**', subDir_name), {
			'mark': true, 							// Add a '/' character to directory matches
			'dot': false, 							// alle Dateien die mit '.' anfangen ignorieren, z.B. '.DS_Store'
			'ignore': [path.join('**','.*')]		// da 'dot' = false (default), müssen '**/.*' nicht mehr explizit ignoriert werden - habe es nur als Platzhalter eingebaut, falls später irgendwelche Dateien noch ignoriert werden müssen
		})
		for (let each of css_folders)
		{
			let num_files = fs.readdirSync(each).length
			if ( num_files <= 0 )
			{
				console.log(colors.grey(`remove folder : `), each)
				fs.rmdirSync(each)
			}
		}
	}
}