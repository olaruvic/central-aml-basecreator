import { Debug } from './../Debug/Debug';
import colors = require('colors')
const fs = require('fs')
const path = require('path')
const root = require('../../../root')
const needle = require('needle')
const _url = require('url')
const cheerio = require('cheerio')

export class DebugTag
{
	static print($: any, tag: any)
	{
		const txt_maxLen = 30;
		const txt = $(tag).text().trim().replace(/[\n\r]+/, '');
		const children = tag.children;
		const num_children = ( typeof(children)!='undefined' && children!=null ? children.length : "-" );
		console.log(`${colors.cyan(new Debug().shortInfo())} :: type=[${tag.type}] name=[${tag.name}] class=[${$(tag).prop('class')}] children=[${num_children}] text=[${txt.substr(0, txt_maxLen)}${txt.length>txt_maxLen?"...":""}]`);
	}
}