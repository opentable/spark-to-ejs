var gulp = require('gulp');
var del = require('del');
var ext_replace = require('gulp-ext-replace');
var replace = require('gulp-replace-task');
var runSequence = require('run-sequence');


gulp.task('Clean', function() {
      return del(['Templates-spark/']);
});

gulp.task('Replace', function () {
   return gulp.src('/Users/Abram/GitHub/SearchResults/Web/Views/Shared/**/*.spark')
    .pipe(replace({
      patterns: [

        {
          match: /\$\{\=/g,
          replacement: function(){
           return '<%';
          }
        },
          {
            match: /\}/g,
            replacement: function(){
            return '%>';
             }
          }
      ]
    }))
    .pipe(gulp.dest('Templates-spark'));
});

gulp.task('Change_Extensions',  function() {
    return gulp.src('Templates-spark/**/*.spark')
      .pipe(ext_replace('.ejs'))
      .pipe(gulp.dest('Templates-ejs'))
});

gulp.task('build', function(callback) {
  runSequence('Clean','Replace','Change_Extensions', 'Clean',callback);
});
