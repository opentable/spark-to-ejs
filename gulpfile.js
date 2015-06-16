var gulp = require('gulp');
var shell = require('gulp-shell');
var del = require('del');
var ext_replace = require('gulp-ext-replace');
var replace = require('gulp-replace-task');
var runSequence = require('run-sequence');


gulp.task('Clean', function() {
    return del(['Templates-ejs/']);
});

gulp.task('Replace', shell.task([
  'python src/parser/Spark_parser.py'
]))

gulp.task('Change_Extensions',  function() {
    return gulp.src('views/**/*.spark')
      .pipe(ext_replace('.ejs'))
      .pipe(gulp.dest('Templates-ejs'))
});

gulp.task('build', function(callback) {
  runSequence('Clean','Change_Extensions','Replace',callback);
});
