'use strict';

/*
this function returns the condition for apply the rules.
*/
exports.getCondition=function(element) {
    var condition;

    if(element.attribs!==undefined && element.attribs.hasOwnProperty("if")) {
        condition = "ifAttribute";
        if(element.name === "render") {
            condition = "ifRender";
        }
    } else if(element.attribs!==undefined && element.attribs.hasOwnProperty("each") && element.name!=='for'){
        condition="attributeEach";
    } else if(element.type === "text") {
        condition = "text";
    } else {
        condition = element.name;
    }
    return condition;
};

/*
this function is going to apply regular expresions to the elements for change open spark tags to ejs.
*/
exports.checkBlockCode = function (input) {
    var expValue;
     expValue =/\$\{/g;
        input=input.replace(expValue,'<%=');

     expValue =/\}/g;
        input=input.replace(expValue,'%>');

     expValue = /(\#Html\.RenderAction\(\")(\w+)("\,.+)/g;
        input = input.replace(expValue, function(match, left, center, right) {
        return '<%-'+'data.' + center + '%>';
    });
    return input;
};

/*
*  the getEndTagIf is a function that return the endTag for the if elements.
*/
exports.getEndTagIf=function(element) {
    var endTag;
    if(element.next !== null && element.next.type ==='text'){
        if(element.next.next !== null && element.next.next.name==='else'){
            endTag="";
            }
        else{
            endTag = "<%}%>";
          }
     } else if(element.next !== null && element.next.name === 'else') {
             endTag = '';
         } else {
            endTag = "<%}%>";
       }

    return endTag;
};
