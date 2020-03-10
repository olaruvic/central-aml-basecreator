import { TextExtractAMV } from './TextExtractAMV'
import colors = require('colors')
import path = require('path')
import root = require('../../../root')

let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json')
let es = new TextExtractAMV(output_fpath)
// -----
es.extractFromUrl(
	'https://www.amv.de/vermoegensaufbau-und-sicherheitsplan/', 
	// 'https://www.amv.de/direktversicherung/',		// Bild ohne p-Tag (Tabellen-Header), Tabelle mit Bildern, tooltip
	// 'https://www.amv.de/parkdepot-flex/',		// breites Bild außerhab eines Akkordeons
	true,
	true,
	true,
	(json) => {
		// console.log(`${new Debug().shortInfo()} :: ${"DEBUG HALT".bold}`.bgRed.white);
		// process.exit(1);
		console.log("------------------------------------------------");
		console.dir(json, {colors: true, depth: 100})
		console.log("------------------------------------------------");
		console.log(JSON.stringify(json))
	}
)
