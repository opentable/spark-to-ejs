var cheerio = require('cheerio');
var del = require('del');
var fs = require('fs');
var path = require('path');
var runSequence = require('run-sequence');
var through = require('through2');

var gulp = require('gulp');
var ext_replace = require('gulp-ext-replace');
var replace = require('gulp-replace-task');
var jshint = require('gulp-jshint');

var config = require('./config');
var engine = require('./lib/rulesEngine.js');

var source = "";
var c = 0;

gulp.task('lint', function () {
  return gulp.src('./lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean', function (cb) {
  del([config.outPath + '/**/*.ejs'], { force: true }, cb);
});

/*this task is going to read all the spark templates and change its extension to .EJS*/
gulp.task('changeExtensions', function () {
  return gulp.src(config.inputPath + '/**/*.spark')
    .pipe(ext_replace('.ejs'))
    .pipe(gulp.dest(config.outPath))
});

/*Read_File is going to read all the templates and apply the conversion rules and save some information for the report.html.*/
gulp.task("readFile", function () {
  return gulp.src(config.outPath + '/**/*.ejs')
    .pipe(through.obj(function (file, enc, cb) {
      c += 1;
      source += "<li><strong>Converted: </strong> <a href=" + file.path + " target='_blank'>" + path.basename(file.path) + "</a></li></br>\n";

      process.stdout.write(file.path + '\n');

      var content = file.contents.toString();
      var output = engine.rulesEngine(content, cheerio);

      fs.writeFile(file.path, output, function (err) {
        if(err) {
          process.stdout.write('ERR: ' + err.toString() + ' \n');
          cb(err);
        } else {
          cb(null, file);
        }

      });
    }))
});

/*this task is going to write a report of the converting process*/
gulp.task("writeReport", function () {
  return gulp.src('./Reports/layout/LayoutReport.html')
    .pipe(through.obj(function (file, enc, cb) {
      var content = String(file.contents);
      var output = source;
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
  runSequence('lint', 'clean', 'changeExtensions', 'readFile', "writeReport", callback);
});
