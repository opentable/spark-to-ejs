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
        }else if (element.name === "test") {
           condition="test";
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
var expValue,response;
    var  exp1 = /([\$|\!]\{[sS]tring\.Format\()(.+)(\)\})/g;
      input = input.replace(exp1, function(match, left, center, right) {
       response=exports.ApplyRegularExpression(center);
       return '<%='+'String.Format(' + response + ')%>';
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

          expValue = /([a-zA-z-_]{1,}\=\"selected\?\{)(.+)(\}\")/g;
           input = input.replace(expValue, function(match, left, center, right) {
             left=left.substring(0,left.length-2);
      return '<%= '+center+' ? \'' +'selected\'' +' : \'\'' +'%>';
                });

           expValue = /([a-zA-z-_]{1,}\=\"disabled\?\{)(.+)(\}\")/g;
           input = input.replace(expValue, function(match, left, center, right) {
             left=left.substring(0,left.length-2);
      return '<%= '+center+' ? \'' +'disabled\'' +' : \'\'' +'%>';
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

            expValue = /(.+\?\{)([^\}]+)(\})/g;
             input = input.replace(expValue, function(match, left, center, right) {
               left=left.substring(2,left.length-3);
      return '<%= '+center+' ? ' +'\''+left+'\''+' : '+ '\'\'' +'%>';
                   });


    return input;
};
/*
this function is going to apply regular expresions to the elements for change open spark tags to ejs.
*/
CheckBlockCode = function (input) {
 // console.log(input);
  var expIsNullOrEmpty=/(string\.IsNullOrWhiteSpace\()(.+)(\))/g;
  var expIsNullOrWhiteSpace=/(string\.IsNullOrEmpty\()(.+)(\))/g;
  var expJoin=/(string\.[jJ]oin\()([^\)]+)(\))/g;
   var  expValue =/(\$\{)([^\}]+)(\})/g;
   var   expValue2 =/(\!\{)([^\}]+)(\})/g;

               input = input.replace(expIsNullOrEmpty, function(match, left, center, right) {
              return 'String.IsNullOrEmpty(' + center + ')';
              });

               input = input.replace(expIsNullOrWhiteSpace, function(match, left, center, right) {
              return 'String.IsNullOrWhiteSpace(' + center + ')';
              });

               input = input.replace(expJoin, function(match, left, center, right) {
               return 'String.Join(' + center + ')';
              });
               input=input.replace(expValue, function(match, left, center, right) {
               return '<%=' + center + '%>';
              });

               input=input.replace(expValue2, function(match, left, center, right) {
               return '<%=' + center + '%>';
              });

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

// CheckIsNullOrCondition=function(input){
//    // console.log("entro al checkisnull function");
//   var expIsNullOrEmpty=/(string\.IsNullOrWhiteSpace\()(.+)(\))/g;
//    var expIsNullOrWhiteSpace=/(string\.IsNullOrEmpty\()(.+)(\))/g;
//    var expJoin=/(string\.[jJ]oin\()(.+)(\))/g;
//
//        input = input.replace(expIsNullOrEmpty, function(match, left, center, right) {
//       return 'String.IsNullOrEmpty(' + center + ')';
//       });
//
//        input = input.replace(expIsNullOrWhiteSpace, function(match, left, center, right) {
//       return 'String.IsNullOrWhiteSpace(' + center + ')';
//       });
//
//        input = input.replace(expJoin, function(match, left, center, right) {
//       return 'String.Join(' + center + ')';
//       });
//
//    return input;
// };

exports.ApplyRegularExpression=function(input){
      //   console.log(input);

        expStringFormat1 = /([\$|\!]\{[sS]tring\.Format)(\(.+\))(\})/g;
        expStringFormat2 = /([sS]tring\.Format\()(.+)(\))/g;

        expBooleanBlock1 = /([a-zA-z-_]{1,}\=\")(checked\?\{.+)(\}\")/g;
        expBooleanBlock2= /([a-zA-z-_]{1,}\?\{)([^\}]+)(\})/g;
        expBooleanBlock22= /(.+\?\{)([^\}]+)(\})/g;
        expBooleanBlock3 = /([a-zA-z-_]{1,}\=\"\?\{)(.+)(\}\")/g;
        expBooleanBlock4 = /([a-zA-z-_]{1,}\=\"selected\?\{)(.+)(\}\")/g;
        expBooleanBlock5 = /([a-zA-z-_]{1,}\=\"disabled\?\{)(.+)(\}\")/g;

        expRenderAction = /(\#Html\.RenderAction\(\")(\w+)("\,.+)/g;

        expIsNullOrEmpty=/(string\.IsNullOrWhiteSpace\()(.+)(\))/g;
        expIsNullOrWhiteSpace=/(string\.IsNullOrEmpty\()(.+)(\))/g;
        expJoin=/(string\.[jJ]oin\()([^\)]+)(\))/g;
        expJoin2=/([\$|\!]\{string\.[jJ]oin\()([^\)]+)(\)\})/g;

         expBlock =/(\!\{)([^\}]+)(\})/g;
         expBlock2 =/(\$\{)([^\}]+)(\})/g;

        if(input.match(expStringFormat1)) {
          return CheckStringFormatBlock(input);
        }else if(input.match(expStringFormat2)) {
            input = input.replace(expStringFormat2, function(match, left, center, right) { return 'String.Format(' + center+')';});
        }else if (input.match(expBooleanBlock1)) {
          return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock2)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock22)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock3)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock4)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expBooleanBlock5)) {
            return CheckBooleanBlock(input);
        }else if (input.match(expRenderAction)) {
            return CheckRenderActionBlock(input);
        }else if (input.match(expIsNullOrEmpty)) {
         return CheckBlockCode(input);
       }else if (input.match(expIsNullOrWhiteSpace)) {
        return CheckBlockCode(input);
      }else if (input.match(expJoin)) {
      return CheckBlockCode(input);
     }else if (input.match(expJoin2)) {
       return CheckBlockCode(input);
     }else if (input.match(expBlock)) {
       return CheckBlockCode(input);
     }else if (input.match(expBlock2)) {
       return CheckBlockCode(input);
     }
  return input;
};
