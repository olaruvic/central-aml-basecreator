const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');

export function stringToFile(pathToFile:string, stringToSave:string, log?:boolean): boolean{
    if(log===null || typeof(log)==='undefined'){
        log = true;
    }
    // console.log(log);
    try{
        fs.writeFileSync(pathToFile,stringToSave);
        if(log===true){
            console.log(colors.green(pathToFile+" has been saved!"));
        }
        return true;
    }
    catch(e){
        console.log(colors.red('\Error: Failed saving \n'+pathToFile));
        console.log(e);
        return false;
    }
}