import { TextExtractCentral } from './TextExtractCentral'
import colors = require('colors')
import path = require('path')
import root = require('../../../root')

let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json')
let es = new TextExtractCentral(output_fpath)
// -----
// tabs, lists, tables, info-button, img:  https://www.central.de/produkte/vollversicherung/fuer-selbststaendige-und-arbeitnehmer/komfortschutz/
es.extractFromUrl(
	'https://www.central.de/produkte/vollversicherung/fuer-selbststaendige-und-arbeitnehmer/komfortschutz/',
	// 'https://www.central.de/gesundheitsangebote/aerztliche-beratung/videosprechstunde/',		// akkordeons
	// 'https://www.central.de/gesundheitsangebote/aerztliche-beratung/',						// 3 teaser in einer Zeile
	// 'https://www.central.de/produkte/zusatzversicherung/krankenzusatzversicherung/mein-zahnschutz/',
	true,
	true,
	true
)
