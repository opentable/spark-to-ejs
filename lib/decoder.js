'use strict';
var tools = require('../lib/tools.js');
/*
the renderAttributes function is going to check if the attributes contains spark tags like '${}' and change them, and also give a little format to the attributes
*/
exports.renderAttributes=function (attribs) {
    var output = "", response;
    for (var key in attribs) {
          if(key === "checked") {
            response = tools.ApplyRegularExpression(key + "=\""+attribs[key] +"\"");
            output =output  +response;
           }else {
            if(attribs.hasOwnProperty(key)) {
                attribs[key] = tools.ApplyRegularExpression(attribs[key]);
                output+= " " + key+"=\"" +attribs[key]+"\"";
            }
        }
    }
    return output;
};
/*
the renderPartialAttributes function is going to give format to the attributes of the renderpartialRule
*/
exports.renderPartialAttributes=function (attribs) {
    var output = "";
    for (var attribute in attribs) {
        if(attribs.hasOwnProperty(attribute)) {
            output=output+','+attribute+"="+attribs[attribute];
        }
    }
    return output;
};
/*
the renderVarAttributes function is going to give format to the attributes of the varRule
*/
exports.renderVarAttributes=function (attribs) {
    var output = "";
    for (var attribute in attribs) {
        if(attribs.hasOwnProperty(attribute)) {
            output=output+'<%var'+' '+attribute+"="+attribs[attribute]+'  %>'+'\n';
        }
    }
    return output;
};
