'use strict';
exports.getCondition=function(element) {
    var condition = element.name;
    if(element.attribs!==undefined && element.attribs.hasOwnProperty("if")) {
        condition = "ifAttribute";
    }
    if(element.type === "text") {
        condition = "text";
    }
    return condition;
};