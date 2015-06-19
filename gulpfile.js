var gulp        = require('gulp'),
    ext_replace = require('gulp-ext-replace'),
    replace     = require('gulp-replace-task'),
    runSequence = require('run-sequence'),
    fs          = require("fs"),
    through     = require('through2'),
    engine      = require('./lib/rulesEngine.js'),
    cheerio     = require('cheerio'),
    jshint      = require('gulp-jshint');
 

gulp.task('Lint', function () {
   return gulp.src('./lib/*.js')
       .pipe(jshint())
       .pipe(jshint.reporter('default'));
});
 
gulp.task('Change_Extensions',  function() {
    return gulp.src('./Views/**/*.spark')
      .pipe(ext_replace('.ejs'))
      .pipe(gulp.dest('./templates-ejs'))
});
 
gulp.task("Read_File", function() {
    return gulp.src('./templates-ejs/**/*.ejs')
        .pipe(through.obj(function (file, enc,cb) {
            var content = String(file.contents),
                output = engine.rulesEngine(content, cheerio);
            fs.writeFile(file.path, output, function (err) {
                cb(null,file);
            });
        }))
});
 
gulp.task('build', function(callback) {
  runSequence('Lint','Change_Extensions','Read_File',callback);
});