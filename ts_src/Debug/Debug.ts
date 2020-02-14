const colors = require('colors');
const path = require('path');

export class Debug
{
	call_stack: Array<string>;

	constructor() 
	{
		let call_stack = (new Error()).stack;
		let regex = /at (.+)/igm;
		this.call_stack = call_stack.match(regex);
	}

	func(): string
	{
		let caller = this.call_stack[1];
		let result = /at ([^()]+)\s+\(/igm.exec(caller);
		if ( result != null)
		{
			return result[1];
		}
		result = /at (.+)\s*/igm.exec(caller);
		if ( result != null )
		{
			let arr = result[1].split(/[\/\\]/);
			return `<${arr[arr.length-1]}>`;
		}
		return "<no func>";
	}

	line(): string
	{
		let caller = this.call_stack[1];
		let line = /at[^(]+\s+\(([^)]+)\)/igm.exec(caller);
		if ( line != null )
		{
			let line_str = line[1];
			return /[^:]+:([0-9]+):[0-9]+/igm.exec(line_str)[1];
		}
		let result = /[^:]+:([0-9]+):[0-9]+/igm.exec(caller);
		if ( result != null )
		{
			return result[1];
		}
		return "<no line>";
	}

	file(): string
	{
		let caller = this.call_stack[1];
		let line = /at[^(]+\s+\(([^)]+)\)/igm.exec(caller);
		if ( line != null )
		{
			let line_str = line[1];
			return /([^:]+):[0-9]+:[0-9]+/igm.exec(line_str)[1];
		}
		let result = /at ([^:]+).*/igm.exec(caller);
		if ( result != null )
		{
			return result[1];
		}
		return caller;
	}

	shortFile(): string
	{
		let comps = this.file().split(path.sep);
		let shortFile = "...";
		for(let i = Math.max(comps.length - 3, 0); i < comps.length; i++)
		{
			shortFile = path.join(shortFile, comps[i]);
		}
		return shortFile;
	}

	info(): string
	{
		return `${this.file()} >> func ${this.func()}, line ${this.line()}`;
	}

	shortInfo(): string
	{
		return `${this.shortFile()} >> ${this.func()}:${this.line()}`;
	}
}