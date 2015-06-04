var gulp = require('gulp');
var del = require('del');
var ext_replace = require('gulp-ext-replace');
var replace = require('gulp-replace-task');
var runSequence = require('run-sequence');


gulp.task('Clean', function() {
      return del(['Templates-spark/']);
});

gulp.task('Replace', function () {
   return gulp.src('/Users/aarias/Git/spark-to-ejs/Views/Shared/**/*.spark')
    .pipe(replace({
      patterns: [

        {
          match: /(<viewdata)(.+)(\/\>)/g,
          replacement: function(){
           return '' ;
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
          {
            match: /\}/g,
            replacement: function(){
            return ' %>';
             }
          },
          ,

          {
            match: /(\<if condition\=\")(.+)(\"\>)/g,
            replacement: function(match, left, center, right){
            return '<%if (' + center + ') %>';
             }
          },
          ,

          {
            match: /\<div if\=\"/g,
            replacement: function(){
            return '<%if (Data.';
             }
          },

          {
            match: /\<if condition\=\"/g,
            replacement: function(){
            return '<%if (Data.';
             }
          },

          {
            match: /\<else\>/g,
            replacement: function(){
            return '<% } else { %>';
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
            match: /\<render partial\=\"/g,
            replacement: function(){
            return '<% include  ../';
             }
          },
          {
            match: /\<render partial\=\"Redesign\/Filters\/\_Filters\" filters\=\"Model\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/Filters/_Filters %>';
             }
          },
           {
            match: /\<render partial\=\"Redesign\/Results\/\_ResultsTable" resultsTable\=\"Model\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/Results/_ResultsTable  %>';
             }
          },
           {
            match: /\<render partial\=\"Redesign\/Results\/\_NoResults\" noResults\=\"Model\" clearLastFilter\=\"false\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/Results/_NoResults  %>';
             }
          },

          {
            match: /\#Html\.RenderAction\(\"Header\"\, \"Srs\"\, new \{ pageType \= Model\.Display\.SrsPageType\, domainCulture \= Model\.DomainCulture\, metro \= Model\.Display\.Metro \}\)\;/g,
            replacement: function(){
            return '<%- Data.Header %>';
             }
          },
          ,

          {
            match: /\<render partial\=\"\_FilterLocationGroup" filterLocationGroup\=\"filters\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterLocationGroup  %>';
             }
          },
          {
            match: /\<render partial\=\"\_FilterCuisine\" filterCuisine\=\"filters\.Filters\.Cuisines\" selectedCount\=\"filters\.Filters\.SelectedCuisineCount\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterCuisine  %>';
             }
          },
          {
            match: /\<render partial\=\"\_FilterOffers\" filterOffers\=\"filters\" filterGroupId\=\"\'offer\_type\_filters\'\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterOffers  %>';
             }
          },
          {
            match: /\<render partial\=\"\_FilterPrice\" filterPrice\=\"filters\.Filters\.PriceBands\" selectedCount\=\"filters\.Filters\.SelectedPriceBandCount\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterPrice  %>';
             }
          },
          {
            match: /\<render partial\=\"\_FilterExactTime\" filterExactTime\=\"filters\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterExactTime  %>';
             }
          },
          {
            match: /\<render partial\=\"\_FilterPopOnly\" filterPopOnly\=\"filters\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterPopOnly  %>';
             }
          },
           {
            match: /\<render partial\=\"\_FilterViewOptions\" filterViewOptions\=\"filters\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterViewOptions  %>';
             }
          },
           {
            match: /\<render partial\=\"\_FilterSortOrder\" request\=\"filters\.Request\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterSortOrder  %>';
             }
          },
           {
            match: /\<render partial\=\"\_FilterSortOrder\" request\=\"filters\.Request\" \/\>/g,
            replacement: function(){
            return '<% include  ../Redesign/filters/_FilterSortOrder  %>';
             }
          },
          {
            match: /\_\$\{/g,
            replacement: function(){
             return '_<%=' ;
            }
          },
          {
            match: /\<\/if>/g,
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
          }
          ,
          {
            match: /\"\$\{/g,
            replacement: function(){
             return '"<%=' ;
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
