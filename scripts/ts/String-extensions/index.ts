interface String 
{
	splice(start: number, delCount: number, newSubStr: string): string;
	// pathComponents(): Array<string>;		... DEPRECATED: use https://nodejs.org/api/path.html instead
	// lastPathComponent(): string;			... DEPRECATED: use https://nodejs.org/api/path.html instead
	padding_left(targetLength: number, padString?: string): string;
	padding_right(targetLength: number, padString?: string): string;
}

//var result = "foo baz".splice(4, 0, "bar ");
//console.log(result);		// Output: foo bar baz
String.prototype.splice = function(start: number, delCount: number, newSubStr: string): string 
{
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

/*
... DEPRECATED: use https://nodejs.org/api/path.html instead
String.prototype.pathComponents = function(): Array<string>
{
	return this.split(/[\\\/]/ig).filter(r=>r!=='');
}

... DEPRECATED: use https://nodejs.org/api/path.html instead
String.prototype.lastPathComponent = function(): string
{
	let components = this.pathComponents();
	return ( components.length > 0 ? components[components.length-1] : null );
}
*/

String.prototype.padding_left = function (targetLength: number, padString?: string) {
	if ( padString == null ) padString = ' '
	const len = Math.max(0, (targetLength - this.length))
	return String(padString.repeat(len).substr(0, len) + this)
}

String.prototype.padding_right = function (targetLength: number, padString?: string) {
	if ( padString == null ) padString = ' '
	const len = Math.max(0, (targetLength - this.length))
	return String(this + padString.repeat(len).substr(0, len))
}
