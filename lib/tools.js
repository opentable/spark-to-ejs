// 'use strict';
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
/*
this function is going to change the spark string format to ejs.
*/
CheckStringFormatBlock=function(input) {
    var expValue;
      expValue = /(\!\{string\.Format)(\(.+\))(\})/g;
         input = input.replace(expValue, function(match, left, center, right) {
         return '<%='+'String.Format' + center + '%>';
     });
      expValue = /(\$\{string\.Format)(\(.+\))(\})/g;
         input = input.replace(expValue, function(match, left, center, right) {
         return '<%='+'String.Format' + center + '%>';
     });
     expValue = /(string\.Format\()(.+)(\))/g;
        input = input.replace(expValue, function(match, left, center, right) {
        return '<%='+'String.Format(' + center + ')%>';
    });
    return input;
};
/*
CheckBooleanBlock is going to change the spark boolean blocks to ejs.
* Example
* @example
*      SPARK
*     <i class="first?{productIsFirst}">
*
*      EJS
*     <i class="<%= productIsFirst ? 'first' : '' %>">
*
* @param element
* @return
*/
CheckBooleanBlock=function(input,expValue) {
      input = input.replace(expValue, function(match, left, center, right) {
        left=left.substring(0,left.length-2);
        return '<%= '+center+' ? ' +'\''+left+'\''+' : '+ '\'\'' +'%>';
           });
    return input;
};
/*
this function is going to apply regular expresions to the elements for change open spark tags to ejs.
*/
CheckBlockCode = function (input) {
    var expValue;
           expValue =/\$\{/g;
              input=input.replace(expValue,'<%=');
           expValue =/\}/g;
              input=input.replace(expValue,'%>');
    return input;
};
/*
this function is going to apply regular expresions to the Html.render elements.
*/
CheckRenderActionBlock=function(input){
  var expValue;
      expValue = /(\#Html\.RenderAction\(\")(\w+)("\,.+)/g;
        input = input.replace(expValue, function(match, left, center, right) {
     return '<%-'+'data.' + center + '%>';
 });
 return input;
};

exports.ApplyRegularExpression=function(input){

  expValue0 = /(\$\{string\.Format)(\(.+\))(\})/g;
  expValue1 = /(\!\{string\.Format)(\(.+\))(\})/g;
  expValue2 = /([A-Za-z]{1,}\?\{)([^\}]+)(\})/g;
  expValue3 = /(\#Html\.RenderAction\(\")(\w+)("\,.+)/g;
  expValue4 =/\$\{/g;

  if(input.match(expValue0)) {
    return CheckStringFormatBlock(input);
  }else if (input.match(expValue1)) {
    return CheckStringFormatBlock(input);
  }else if (input.match(expValue2)) {
    return CheckBooleanBlock(input,expValue2);
  }else if (input.match(expValue3)) {
      return CheckRenderActionBlock(input);
  }else if (input.match(expValue4)) {
    return CheckBlockCode(input);
  }
  return input;
};
