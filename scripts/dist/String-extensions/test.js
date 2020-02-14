"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../String-extensions");
console.log("----------------------- splice");
var result = "foo baz".splice(4, 0, "bar ");
console.log(result);
console.log("----------------------- padding");
console.log(`[${'123'.padding_left(2)}]`);
console.log(`[${'123'.padding_left(5)}]`);
console.log(`[${'123'.padding_left(5, '0')}]`);
console.log(`[${'123'.padding_left(5, 'abc')}]`);
console.log(`[${'123'.padding_right(2)}]`);
console.log(`[${'123'.padding_right(5)}]`);
console.log(`[${'123'.padding_right(5, '.')}]`);
console.log(`[${'123'.padding_right(5, 'abc')}]`);
