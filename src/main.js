(function () {
	'use strict';
	var fs = require('fs'),
		setRules    = require('./set_rules.js'),
		rulesEngine = require('./rules_engine.js'),
		cheerio     = require('cheerio'),
        async       = require('async'),
		fileParsed,
        filePath = process.argv[2];


    async.waterfall([
        function(callback) {
            if(filePath === undefined) {
                return callback({"Error" : "File not found"}, null);
            }
            fs.readFile(filePath, 'utf-8', function (err,data) {
                return callback(err,data);
            })
        },
        function(data, callback) {
            fileParsed = rulesEngine(data, setRules, cheerio);
            return callback(null, fileParsed);
        },
        function(fileParsed,callback) {
            fs.writeFile('_Timeslots.ejs', fileParsed, function (err) {
                return callback(err,'Done!');
		    });
        }
    ], function (err, result) {
        if(err) {
           console.log("Error: "+ JSON.stringify(err));
        } else {
            console.log(result);
        }

    });
})();
