import colors = require('colors')
import path = require('path')
import root = require('../../../root')
import { Debug } from '../Debug/Debug'
import { TextExtractCentral } from './TextExtractCentral'

let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json')
let es = new TextExtractCentral(output_fpath)
// -----
// tabs, lists, tables, info-button, img:  https://www.central.de/produkte/vollversicherung/fuer-selbststaendige-und-arbeitnehmer/komfortschutz/
es.extractFromUrl(
	'https://www.central.de/produkte/vollversicherung/fuer-selbststaendige-und-arbeitnehmer/komfortschutz/',
	// 'https://www.central.de/gesundheitsangebote/aerztliche-beratung/videosprechstunde/',		// akkordeons
	// 'https://www.central.de/gesundheitsangebote/aerztliche-beratung/',						// 3 teaser in einer Zeile
	// 'https://www.central.de/produkte/zusatzversicherung/krankenzusatzversicherung/mein-zahnschutz/',
	// 'https://www.central.de/gesundheitsangebote/',												// verteiler
	// 'https://www.central.de/kundenservice/service-kontakt/dokumente-einreichen/hkp-zahn-einreichen/online-einreichen-antwort-per-e-mail/',	// form-tag
	// 'https://www.central.de/ratgeber/stationaer/anschlussheilbehandlung-und-rehabilitation/',
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
