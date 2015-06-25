'use strict';
exports.getCondition=function(element) {
    var condition = element.name;
    if(element.attribs!==undefined && element.attribs.hasOwnProperty("if")) {
        if(element.name === "render") {
            condition = "ifRender";
        } else {
            condition = "ifAttribute";
        }
    }
    if(element.attribs!==undefined && element.attribs.hasOwnProperty("each") && element.name!=='for'){
    condition="attributeEach";
    }
    if(element.type === "text") {
        condition = "text";
    }
    return condition;
};
