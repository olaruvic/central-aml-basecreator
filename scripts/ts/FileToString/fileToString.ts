import colors = require('colors/safe');
import fs = require('fs');

export function fileToString(filePath: string, stopOnError?:true): string
{
    try{
		let content = fs.readFileSync(filePath, 'utf8');
		return ( typeof(content)=='undefined' || content==null ? '' : content)
    }catch(e){
        console.log(colors.bgRed('There was an error reading the file: '+ filePath));
		console.log(e);
    }
    if(stopOnError===true){
        process.exit();
        return ''; 
	}
	return '';
}