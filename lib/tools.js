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
      expValue = /(\!\{[sS]tring\.Format)(\(.+\))(\})/g;
         input = input.replace(expValue, function(match, left, center, right) {
         return '<%='+'String.Format' + center + '%>';
     });
      expValue = /(\$\{[sS]tring\.Format)(\(.+\))(\})/g;
         input = input.replace(expValue, function(match, left, center, right) {
         return '<%='+'String.Format' + center + '%>';
     });
     expValue = /([sS]tring\.Format\()(.+)(\))/g;
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
CheckBooleanBlock=function(input) {

  expValue = /([a-zA-z-_]{1,}\=\"checked\?\{)(.+)(\}\")/g;
   input = input.replace(expValue, function(match, left, center, right) {
     left=left.substring(0,left.length-2);
     return '<%= '+center+' ? \'' +'checked\'' +' : \'\'' +'%>';
        });

      expValue = /([a-zA-z-_]{1,}\?\{)([^\}]+)(\})/g;
      input = input.replace(expValue, function(match, left, center, right) {
        left=left.substring(0,left.length-2);
        return '<%= '+center+' ? ' +'\''+left+'\''+' : '+ '\'\'' +'%>';
           });

      expValue = /([a-zA-z-_]{1,}\=\"\?\{)(.+)(\}\")/g;
       input = input.replace(expValue, function(match, left, center, right) {
         left=left.substring(0,left.length-4);
         return '<%= '+center+' ? \'' +left+'\'' +' : \'\'' +'%>';
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

        expStringFormat1= /(\$\{[Ss]tring\.Format)(\(.+\))(\})/g;
        expStringFormat2 = /(\!\{[Ss]tring\.Format)(\(.+\))(\})/g;
        expBooleanBlock1 = /([a-zA-z-_]{1,}\=\")(checked\?\{.+)(\}\")/g;
        expBooleanBlock2= /([a-zA-z-_]{1,}\?\{)([^\}]+)(\})/g;
        expBooleanBlock3 = /([a-zA-z-_]{1,}\=\"\?\{)(.+)(\}\")/g;
        expRenderAction = /(\#Html\.RenderAction\(\")(\w+)("\,.+)/g;
        expBlock=/\$\{/g;

        if(input.match(expStringFormat1)) {
          return CheckStringFormatBlock(input);
        }else if (input.match(expStringFormat2)) {
        return CheckStringFormatBlock(input);
      }else if (input.match(expBooleanBlock1)) {
          return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock2)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock3)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expRenderAction)) {
            return CheckRenderActionBlock(input);
        }else if (input.match(expBlock)) {
          return CheckBlockCode(input);
        }
  return input;
};
