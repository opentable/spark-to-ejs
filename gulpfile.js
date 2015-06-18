var gulp = require('gulp');
var shell = require('gulp-shell');
var del = require('del');
var ext_replace = require('gulp-ext-replace');
var replace = require('gulp-replace-task');
var runSequence = require('run-sequence');


gulp.task('Clean', function() {
    return del(['Templates-ejs/','Templates-ejs2/']);
});

gulp.task('Replace', function () {
   return gulp.src('/Users/aarias/Git/spark-to-ejs/Templates-ejs/**/*.ejs')
    .pipe(replace({
      patterns: [

        {
          match: /(\$\{)(.+)(\})/g,
          replacement: function(match, left, center, right){
          return '<%= ' + center + '%>' ;
          }
        },

        ]
    }))
    .pipe(gulp.dest('/Users/aarias/Git/spark-to-ejs/Templates-ejs2/'));
});



gulp.task('Change_Extensions',  function() {
    return gulp.src('views/**/*.spark')
      .pipe(ext_replace('.ejs'))
      .pipe(gulp.dest('/Users/aarias/Git/spark-to-ejs/Templates-ejs'))
});

gulp.task('build', function(callback) {
  runSequence('Clean','Change_Extensions','Replace',callback);
});
