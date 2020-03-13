import fs = require('fs')
import fse = require('fs-extra')
import path = require('path')
import root = require('../../../root')
import colors = require('colors')
import { Debug } from '../Debug/Debug'
import { JSON2Array } from '../JSON2Array/JSON2Array'
let needle = require('needle')

export class DrupalJsonApiTest
{
	api_url: string
	json_data: JSON2Array

	constructor(json: any)
	{
		this.api_url = "http://page-manager-test.hogarthww.de/jsonapi/node/generali_page";
		this.json_data = new JSON2Array(json, false)
	}

	find_field(field: string, value: string, callback: (err: any, json: any)=>void = null)
	{
		let params = encodeURI( `filter[${field}]=${value}` );
		//
		needle.get(this.api_url + '?' + params, function(err, res, body) {
			let json = null;
			if ( !err && res.statusCode==200 )
			{
				json = JSON.parse( body.toString('utf8') );
			}
			if ( callback )
			{
				callback( err, json );
			}
		})
	}

	copyFieldToServer(json_field_name: string, drupal_field_name: string)
	{
		for( let each_page of this.json_data.array )
		{
			let field_value = each_page[json_field_name];
			if ( typeof(field_value)!='undefined' && field_value!=null && field_value.trim().length>0 )
			{
				field_value = field_value.trim();
				this.find_field(drupal_field_name, field_value, (err, json) => {
					if (  )
				});
			}
		}
	}
}