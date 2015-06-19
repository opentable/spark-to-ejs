'use strict';
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
    for (var key in attribs) {
        if(attribs.hasOwnProperty(key)) {
            output+= " " + key+"='"+attribs[key]+"' ";
          }
    }
    return output;
};