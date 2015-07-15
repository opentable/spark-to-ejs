'use strict';
var tools = require('../lib/tools.js');
/*
 renderAttributes function is going to check if the attributes contains spark tags like '${}' and change them, and also give a little format to the attributes
*/
exports.renderAttributes = function (attribs, inScript) {
  var output = "";
  var response;
  for (var key in attribs) {
    if (["checked", "selected", "disabled"].indexOf(key) !== -1) {
      response = tools.ApplyRegularExpression(key + '="' + attribs[key] + '"', inScript, true);
      output = output + response;
    } else {
      if (attribs.hasOwnProperty(key)) {
        attribs[key] = tools.ApplyRegularExpression(attribs[key], inScript, true);
        output += " " + key + '="' + attribs[key] + '"';
      }
    }
  }
  return output;
};
/*
 renderPartialAttributes function is going to give format to the attributes of the renderpartialRule
*/
exports.renderPartialAttributes = function (attribs) {
  var output = "";
  for (var attribute in attribs) {
    if (attribs.hasOwnProperty(attribute)) {
      output = output + ',' + attribute + "=" + attribs[attribute];
    }
  }
  return output;
};
/*
renderVarAttributes function is going to give format to the attributes of the varRule
*/
exports.renderVarAttributes = function (attribs) {
  var output = "",
    response;
  for (var attribute in attribs) {
    if (attribs.hasOwnProperty(attribute)) {
      if (attribute !== 'type') {
        response = tools.ApplyRegularExpression(attribs[attribute]);
        output = output + '<%var' + ' ' + attribute + "=" + response + '  %>' + '\n';
      }
    }
  }
  return output;
};
