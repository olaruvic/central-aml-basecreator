import { TextExtract } from './TextExtract'
import colors = require('colors')
import path = require('path')
import root = require('../../root')

let output_fpath = path.join('/Users', 'victorolaru', 'Desktop', 'text.json')
let es = new TextExtract(output_fpath)
// -----
es.extractFromUrl(
	'https://www.amv.de/vermoegensaufbau-und-sicherheitsplan/', //'https://www.amv.de/direktversicherung/',
	'produkte\\s+der\\s+(generali|AachenM(ü|ue)nchener)',
	'.(pdf|txt)$',		// valid files
	true,
	null,
	true,
	true,
	true
)
