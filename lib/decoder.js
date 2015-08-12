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
  return ", { "
   + Object.keys(attribs).map((key)=> "'" + key + "': " + attribs[key]).join(', ')
   + ' } ';
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
        response = tools.ApplyRegularExpression(attribs[attribute], true);
        output += '<% var ' + attribute + '=' + response + ' %>\n';
      }
    }
  }
  return output;
};

var VIEW_MODEL_ATTRIBUTES = [
  'AdvertType',
  'Html',
  'Model',
  'PageType',
  'Request',
  'Resources',
  'SrsPageType',
  'System',
  'block',
  'layout',
  'partial'
];

exports.renderViewdataAttributes = function (attribs) {
  var output = "";
  var response;

  for (var attribute in attribs) {
    if (attribs.hasOwnProperty(attribute)) {
      if(attribute === 'model') {
        output += '<% var model = locals.Model %>\n';
      }
      else if (attribute !== 'type') {
        output += '<% var ' + attribute + ' = locals.' + attribute + ' %>\n';
      }
    }
  }

  VIEW_MODEL_ATTRIBUTES.forEach(function(attribute) {
    if(!attribs[attribute]) {
      output += '<% var ' + attribute + ' = locals.' + attribute + ' %>\n';
    }
  });

  return output;
};
