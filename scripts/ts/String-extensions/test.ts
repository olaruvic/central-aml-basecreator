import '../String-extensions';

console.log("----------------------- splice");
var result = "foo baz".splice(4, 0, "bar ");
console.log(result);										// => foo bar baz

// console.log("----------------------- pathComponents");
// console.log("".pathComponents());							// => []
// console.log("/".pathComponents());							// => []
// console.log("path1".pathComponents());						// => [ 'path1' ]
// console.log("/path1".pathComponents());						// => [ 'path1' ]
// console.log("/path1/".pathComponents());					// => [ 'path1' ]
// console.log("path1/".pathComponents());						// => [ 'path1' ]
// console.log("/path1/path2".pathComponents());				// => [ 'path1', 'path2' ]
// console.log("/path1/path2/".pathComponents());				// => [ 'path1', 'path2' ]
// console.log("path1/path2/".pathComponents());				// => [ 'path1', 'path2' ]
// console.log("path1/path2".pathComponents());				// => [ 'path1', 'path2' ]
// console.log("path1/path2/file.txt".pathComponents());		// => [ 'path1', 'path2', 'file.txt' ]

// console.log("----------------------- lastPathComponent");
// console.log("".lastPathComponent());						// => null
// console.log("/".lastPathComponent());						// => null
// console.log("path1".lastPathComponent());					// => path1
// console.log("/path1".lastPathComponent());					// => path1
// console.log("/path1/".lastPathComponent());					// => path1
// console.log("path1/".lastPathComponent());					// => path1
// console.log("/path1/path2".lastPathComponent());			// => path2
// console.log("/path1/path2/".lastPathComponent());			// => path2
// console.log("path1/path2/".lastPathComponent());			// => path2
// console.log("path1/path2".lastPathComponent());				// => path2
// console.log("path1/path2/file.txt".lastPathComponent());	// => file.txt

console.log("----------------------- padding");
console.log(`[${'123'.padding_left(2)}]`)			// [123]
console.log(`[${'123'.padding_left(5)}]`)			// [  123]
console.log(`[${'123'.padding_left(5, '0')}]`)		// [00123]
console.log(`[${'123'.padding_left(5, 'abc')}]`)	// [ab123]
console.log(`[${'123'.padding_right(2)}]`)			// [123]
console.log(`[${'123'.padding_right(5)}]`)			// [123  ]
console.log(`[${'123'.padding_right(5, '.')}]`)		// [123..]
console.log(`[${'123'.padding_right(5, 'abc')}]`)	// [123ab]

// https://codeburst.io/https-chidume-nnamdi-com-npm-module-in-typescript-12b3b22f0724
