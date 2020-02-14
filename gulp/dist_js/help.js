const gulp = require("gulp");
const colors = require('colors/safe');

gulp.task('help', (done) => {
    console.log('\nGulp help started in: '+colors.yellow(process.env.INIT_CWD));
    return done();
});