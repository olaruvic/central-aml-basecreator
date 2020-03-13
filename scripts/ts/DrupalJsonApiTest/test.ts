import colors = require('colors')
import fs = require('fs')
import path = require('path')
import root = require('../../../root')
import { DrupalJsonApiTest } from './DrupalJsonApiTest'
import { Debug } from '../Debug/Debug'
//
const json_data = require(path.join(root(), "central-amv-data", "juli2020.json"));
let o = new DrupalJsonApiTest(json_data)
	o.copyFieldToServer( 'template', 'field_page_template' );
/*
o.find_field( 'field_url_segment', 'mein-zukunftsplan', (err, json) => { 
	if ( !err )
	{
		// console.dir(body, {colors: true})
		if ( json.data != null )
		{
			console.log(` ${json.data.length} entrie(s) found! `.bgCyan.black);
		}
		else
		{
			console.log(` No entries found! Invalid field name? `.bgRed.black);
		}
		console.dir(json.data, {colors: true, depth: 2})
	}
	else
	{
		console.log(`${new Debug().shortInfo()} : Error`.red.bold);
		console.dir(err, {colors: true});
	}
} );
*/