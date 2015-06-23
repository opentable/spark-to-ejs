'use strict';
// var cheerio  = require('cheerio');


exports.renderAttributes=function (attribs) {
    var output = "";
    for (var key in attribs) {
        if(attribs.hasOwnProperty(key)) {
            output+= " " + key+"='"+attribs[key]+"' ";
          }
    }
    return output;
};

exports.renderPartialAttributes=function (attribs) {
    var output = "";
    for (var attribute in attribs) {
        if(attribs.hasOwnProperty(attribute)) {
            output=output+','+attribute+"="+attribs[attribute];
        }
    }
    return output;
};
