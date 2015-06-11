var gulp = require('gulp');
var del = require('del');
var ext_replace = require('gulp-ext-replace');
var replace = require('gulp-replace-task');
var runSequence = require('run-sequence');


gulp.task('Clean', function() {
      return del(['Templates-spark/']);
});

gulp.task('Replace', function () {
   return gulp.src('/Users/aarias/Git/spark-to-ejs/Views/**/*.spark')
    .pipe(replace({
      patterns: [
          {
            match: /(<cache key\=\")(.+)(\/\>)/g,
            replacement: function(){
             return '' ;
            }
          },
        {
          match: /(<viewdata)(.+)(\/\>)/g,
          replacement: function(){
           return '' ;
          }
        },
          {
          match: /(<viewdata)(.+)(\/\>)/g,
          replacement: function(){
              return '' ;
          }
        },
        {
          match: /(\<render partial\=\"_)(\w+)(\".+\/\>)/g,
          replacement: function(match, left, center, right){
            var i ="'";
            var arguments=right;
            return '<%- partial( '+i+'_' + center + i+ ','+arguments.replace(/(")+/g, '').replace(/(\/\>)+/g, '')+' ) %>';
           }
        },
        {
          match: /(\<render partial\=\")(.)(\".\/\>)/g,
          replacement: function(match, left, center, right){
            var i ="'";
            var arguments=right;
            return '<%- partial( '+i + center + i+ ','+arguments.replace(/(")+/g, '')+' ) %>';
           }
        },
        {
          match: /(\$\{)(\w+)(\})/g,
          replacement: function(match, left, center, right){
           return '<%= ' + center + '%>' ;
          }
        },
        {
          match: /\$\{/g,
          replacement: function(){
          return '<% ';
           }
        },
        ,
        {
          match: /\#\{/g,
          replacement: function(){
          return '<% ';
           }
        },
          {
            match: /\}/g,  //I need fix this
            replacement: function(){
            return ' %>';
             }
          },
          {
            match: /(\<li if\=\")(.+)(\"\>)/g,
            replacement: function(match, left, center, right){
            return '<li>'+
            '<%if (' + center + ') %>';
             }
          },
          {
            match: /(\<if condition\=\")(.+)(\"\>)/g,
            replacement: function(match, left, center, right){
            return '<%if (' + center + ') %>'+match;
             }
          },

          {
            match: /\<div if\=\"/g,
            replacement: function(){
            return '<%if (Data.';
             }
          }
          ,
          {
            match: /\<\/if\>/g,
            replacement: function(){
             return '<% } %>' ;
            }
          },
          {
            match: /\<\/else\>/g,
            replacement: function(){
             return '<% } %>' ;
            }
          }
          ,
          {
            match: /\<\}\></g,
            replacement: function(){
             return '<% } %>' ;
            }
          }
          ,
          {
            match: /\<\/for/g,
            replacement: function(){
             return '<% } %>' ;
            }
          },
          {
            match: /\<else\>/g,
            replacement: function(){
            return '<% else { %>';
             }
          },

          {
            match: /\#Html\.RenderAction\(\"Css\"\, \"Srs\"\, new \{ domainCulture \= Model\.DomainCulture \}\)\;/g,
            replacement: function(){
            return '<%- Data.Css %>';
             }
          }
          ,

          {
            match: /\#Html\.RenderAction\(\"Favicon\"\, \"Srs\"\, new \{ domainCulture \= Model\.DomainCulture \}\)\;/g,
            replacement: function(){
            return '<%- Data.Favicon %>';
             }
          }
          ,

          {
            match: /\#Html\.RenderAction\(\"JsHead\"\, \"Srs\"\, new \{ domainCulture \= Model\.DomainCulture \}\)\;/g,
            replacement: function(){
            return '<%- Data.JsHead %>';
             }
          }
          ,

          {
            match: /\#Html.RenderAction\(\"Js\"\, \"Srs\"\, new \{ domainCulture \= Model\.DomainCulture\, jqueryOnBody \= false \}\)\;/g,
            replacement: function(){
            return '<%- Data.Js %>';
             }
          },
          {
            match: /\#Html\.RenderAction\(\"Header\"\, \"Srs\"\, new \{ pageType \= Model\.Display\.SrsPageType\, domainCulture \= Model\.DomainCulture\, metro \= Model\.Display\.Metro \}\)\;/g,
            replacement: function(){
            return '<%- Data.Header %>';
             }
          },


          {
            match: /\_\$\{/g,
            replacement: function(){
             return '_<%=' ;
            }
          }
          ,
          {
            match: /\"\$\{/g,
            replacement: function(){
             return '"<%=' ;
            }
          }
          ,
          {
          match: /(\<render if\=\"_)(\.+)(\"\/\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return '<%if(' + center+ ') %>';
           }
          },
          {
            match: /\!\{(.+)(\/})/g,
            replacement: function(match, left, center, right){
             return '<%=!'+ center + '%>'
            }
          },

          {
          match: /(\<div if\=\"\!string\.IsNullOrEmpty\(\=\"_)(\.+)(\"\/\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return '<%if(' + center+ ') %>';
           }
        },
          {
            match: /\!\{(.+)(\/})/g,
            replacement: function(match, left, center, right){
             return '<%=!'+ center + '%>'
            }
          },
             {
          match: /(\<for each\=\")(\.+)(\"\>)/g,
          replacement: function(match, left, center, right){

            var arguments=right;
            return '<%-'+ left+center+'.forEach(function(r) { %>'

           }
        },
        {
          match: /(\<render  if\=\")(\.+)(\"\/\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return '<%if(' + center+ ') %>';
           }
        },
        ,
        {
          match: /(\<partial\=\")(\.+)(\"\/\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <%-partial('+ center+ ') %>';
           }
        },
        {
          match: /\<a href\=\"\$\{)(\.+)(\})/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <a href=<%='+ center+ '%>';
           }
        },
        ,
        {
          match: /\#for\()(\.+)(\)\{)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <% for('+ center+ '){%>';
           }
        },
        {
          match: /\<i if\=\"(\.+)(\<\/i\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <%if'+ center+ '){%>'+'<i>'+left+'<i>';
           }
        },
          {
          match: /\<span if\=\"(\.+)(\"\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <%if'+ center+ '){%>'+'<span>'+left+'</span>';
           }
        },
          {
          match: /\<p if\=\"(\.+)(\"\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <%if'+ center+ '){%>'+'<p>'+left+'</p>';
           }
        },
        {
          match: /\<h2 if\=)(\.+)(\<\/h2\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <%if'+ center+ '){%>'+'<h2>'+left+'<h2>';
           }
        },
        {
          match: /\<h3 if\=)(\.+)(\<\/h2\>)/g,
          replacement: function(match, left, center, right){
            var arguments=right;
            return ' <%if'+ center+ '){%>'+'<h3>'+left+'<h3>';
           }
        },
      ]
    }))
    .pipe(gulp.dest('/templates-js/'));
});

gulp.task('Change_Extensions',  function() {
    return gulp.src('Templates-spark/**/*.spark')
      .pipe(ext_replace('.ejs'))
      .pipe(gulp.dest('Templates-ejs'))
});

gulp.task('build', function(callback) {
  runSequence('Clean','Replace','Change_Extensions', 'Clean',callback);
});
