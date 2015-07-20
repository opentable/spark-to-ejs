var config = require('./config');
var gulp = require('gulp'),
  ext_replace = require('gulp-ext-replace'),
  replace = require('gulp-replace-task'),
  runSequence = require('run-sequence'),
  fs = require("fs"),
  through = require('through2'),
  engine = require('./lib/rulesEngine.js'),
  cheerio = require('cheerio'),
  jshint = require('gulp-jshint'),
  path = require("path"),
  Source = "",
  c = 0;

gulp.task('Lint', function () {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/*this task is going to read all the spark templates and change its extension to .EJS*/
gulp.task('Change_Extensions', function () {
  return gulp.src(config.inputPath + '/**/*.spark')
    .pipe(ext_replace('.ejs'))
    .pipe(gulp.dest(config.outPath))
});

/*Read_File is going to read all the templates and apply the conversion rules and save some information for the report.html.*/
gulp.task("Read_File", function () {
  return gulp.src(config.outPath + '/**/*.ejs')
    .pipe(through.obj(function (file, enc, cb) {
      c += 1;
      Source += "<li><strong>Converted: </strong> <a href=" + file.path + " target='_blank'>" + path.basename(file.path) + "</a></li></br>\n";

      process.stdout.write(file.path + '\n');

      var content = String(file.contents),
        output = engine.rulesEngine(content, cheerio);
      fs.writeFile(file.path, output, function (err) {
        cb(null, file);
      });
    }))
});

/*this task is going to write a report of the converting process*/
gulp.task("Write_Report", function () {
  return gulp.src('./Reports/layout/LayoutReport.html')
    .pipe(through.obj(function (file, enc, cb) {
      var content = String(file.contents);
      var output = Source;
      var d = new Date();
      var date = d.toLocaleDateString();
      fs.writeFile('./Reports/report' + d + '.html', content + output + "</ol>\
            <div class='tool-footer'>\
            <div class='tool-footer-files'><h3>Total converted files:<strong>" + c + "</strong></div>\
            </div>\
            </body>\
            </html>", function (err) {
        cb(null, file);
      });
    }))
});

gulp.task('build', function (callback) {
  runSequence('Lint', 'Change_Extensions', 'Read_File', "Write_Report", callback);
});
