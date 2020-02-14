const gulp = require("gulp");
const path = require('path');
const root = require('./root');

var requireDir = require('require-dir');
requireDir(path.join(root(),'gulp','dist_js'));

/* 
TOP LEVEL FUNCTIONS 
gulp.task - define tasks
gulp.src - define source files
gulp.dest - define output
gup.watch - watch files

npm link gulp

https://devhints.io/gulp

*/

gulp.task('default', gulp.series('help'), (done) => {
    done();
});