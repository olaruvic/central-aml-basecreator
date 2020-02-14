const colors = require('colors');
import { ContentArticleDataAbstract, ArticleContentType } from './ContentArticleDataAbstract';

export class ContentArticleDataTable extends ContentArticleDataAbstract
{
	rows: Array<Array<string>>

	constructor()
	{
		super(ArticleContentType.table)
		this.rows = []
	}

	static init($: any, tag: any): ContentArticleDataTable
	{
		let table = new ContentArticleDataTable()
		//
		let table_rows = tag.children
		if ( table_rows[0].name == 'tbody' ) table_rows = table_rows[0].children
		//
		for( let row of table_rows )
		{
			let cols = []
			for( let col of row.children )
			{
				cols.push( $(col).text().trim() )
			}
			table.rows.push( cols )
		}

		return table
	}
}
