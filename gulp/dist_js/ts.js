const gulp = require("gulp");
const ts = require("gulp-typescript");
const path = require('path');
const root = require('../../root');
const colors = require('colors/safe');
const minify = require('gulp-minify');

const tsProject = ts.createProject(path.join(root(),'config','ts_project.json'));

const folders = {
    gulp: { 
        watch: path.join('gulp','ts_src','**','*.ts'), 
        dist: path.join('gulp','dist_js','**','*.ts') 
    },
    ts: {
        watch: path.join('ts_src','**','*.ts'),
        dist: path.join('ts_dist','**','*.js') 
    }
};

function compile () {
    console.log(colors.yellow('Compiling ts'));
    tsProject.src = path.join(root(), folders.ts.watch);
    var tsResult = gulp.src(
        folders.ts.watch, 
        { base: folders.ts.watch }) // or tsProject.src()
        .pipe(tsProject())
        .on('error',function(e){
            console.log(colors.bgRed(colors.white('Compiled with errors')));
            console.log(e);
        });
    return tsResult.js
/*            .pipe(minify({
					exclude: ['ts'],		// enable for debug mode
                    ext:{
                        src:'-debug.js',
                        min:'.js'
                        }
					})
			)*/
            .pipe(gulp.dest(path.join(root(),folders.ts.dist)));
}

function watchFiles() {    
    const folders_ts_watch = path.join(root(),folders.ts.watch).replace(/\\/g,'/');
    console.log(colors.yellow('\nWatching: ')+ folders_ts_watch);
    var watcher = gulp.watch(folders_ts_watch, {cwd:'./'}, gulp.series(compile));
    watcher.on('change', function(f) {
        const d = new Date();
        console.log(colors.green(d.toTimeString()+'\nFile changed: '+ f));
      });   
}

gulp.task('watch:ts', gulp.series(compile, watchFiles));
