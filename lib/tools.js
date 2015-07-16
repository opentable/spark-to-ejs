/*
getCondition function returns the condition for apply the rules.
*/
var expBlock = /"[^"]+"|(\!\{)([^\}^\"]+)(\})/g;
var expBlock2 = /"[^"]+"|(\$\{)([^\}^\"]+)(\})/g;
var expIsNullOrEmpty = /(string\.IsNullOrEmpty\()(.+)(\))/g;
var expIsNullOrWhiteSpace = /(string\.IsNullOrWhiteSpace\()(.+)(\))/g;

function wrapWithBrackets(input, inScript, inQuotes) {
  return inScript
    ? inQuotes ? "' \n + " + input + " \n + '" : input
    : '<%= ' + input + ' %>';
}

exports.getCondition = function (element) {
  var condition;

  if (element.attribs !== undefined && element.attribs.hasOwnProperty("if")) {
    condition = "ifAttribute";
    if (element.name === "render") {
      condition = "ifRender";
    } else if (element.name === "test") {
      condition = "test";
    }
  } else if (element.attribs !== undefined && element.attribs.hasOwnProperty("each") && element.name !== 'for') {
    condition = "attributeEach";
  } else if (element.type === "text") {
    condition = "text";
  } else if (element.type == "comment") {
    condition = "comment";
  } else {
    condition = element.name;
  }
  return condition;
};
/*
 *  getEndTagIf returns the endTag for the if elements.
 */
exports.getEndTagIf = function (element) {
  var endTag;
  if (element.next !== null && element.next.type === 'text') {
    if (element.next.next !== null && element.next.next.name === 'else') {
      endTag = "";
    } else {
      endTag = "<% } %>";
    }
  } else if (element.next !== null && element.next.name === 'else') {
    endTag = '';
  } else {
    endTag = "<% } %>";
  }

  return endTag;
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
var CheckBooleanBlock = function (input, inScript, inQuotes) {
  var expValue;
  expValue = /([a-zA-z-_]{1,}\=\"checked\?\{)(.+)(\}\")/g;
  input = input.replace(expValue, function (match, left, center, right) {
    left = left.substring(0, left.length - 2);
    return wrapWithBrackets(center + ' ? \' checked\' : \'\'', inScript, inQuotes);
  });

  expValue = /([a-zA-z-_]{1,}\=\"selected\?\{)(.+)(\}\")/g;
  input = input.replace(expValue, function (match, left, center, right) {
    left = left.substring(0, left.length - 2);
    return wrapWithBrackets(center + ' ? \' selected\' : \'\'', inScript, inQuotes);
  });

  expValue = /([a-zA-z-_]{1,}\=\"disabled\?\{)(.+)(\}\")/g;
  input = input.replace(expValue, function (match, left, center, right) {
    left = left.substring(0, left.length - 2);
    return wrapWithBrackets(center + ' ? \' disabled\' : \'\'', inScript, inQuotes);
  });

  expValue = /([a-zA-z-_]{1,}\?\{)([^\}]+)(\})/g;
  input = input.replace(expValue, function (match, left, center, right) {
    left = left.substring(0, left.length - 2);
    return wrapWithBrackets(center + ' ? \'' + left + '\' : \'\'', inScript, inQuotes);
  });

  expValue = /([a-zA-z-_]{1,}\=\"\?\{)(.+)(\}\")/g;
  input = input.replace(expValue, function (match, left, center, right) {
    left = left.substring(0, left.length - 4);
    return wrapWithBrackets(center + ' ? \'' + left + '\' : \'\'', inScript, inQuotes);
  });

  expValue = /(.+\?\{)([^\}]+)(\})/g;
  input = input.replace(expValue, function (match, left, center, right) {
    left = left.substring(2, left.length - 3);
    return wrapWithBrackets(center + ' ? ' + '\'' + left + '\' : \'\'', inScript, inQuotes);
  });
  return input;
};
/*
CheckBlockCode is going to apply regular expressions to the elements for change open spark tags to ejs.
*/
var CheckBlockCode = function (input, inScript, inQuotes) {
  var expJoin = /(string\.[jJ]oin\()([^\)]+)(\))/g;

  input = input.replace(expIsNullOrEmpty, function (match, left, center, right) {
    return 'String.IsNullOrEmpty(' + center + ')';
  });

  input = input.replace(expIsNullOrWhiteSpace, function (match, left, center, right) {
    return 'String.IsNullOrWhiteSpace(' + center + ')';
  });

  input = input.replace(expJoin, function (match, left, center, right) {
    return 'String.Join(' + center + ')';
  });

  input = input.replace(expBlock, function (match, left, center, right) {
    if (!left || !center || !right) { return match; }
    return wrapWithBrackets(center, inScript, inQuotes);
  });

  input = input.replace(expBlock2, function (match, left, center, right) {
    if (!left || !center || !right) { return match; }
    return wrapWithBrackets(center, inScript, inQuotes);
  });

  return input;
};
/*
CheckRenderActionBlock is going to apply regular expressions to the Html.render elements.
*/
var CheckRenderActionBlock = function (input, inScript, inQuotes) {
  var expValue = /(\#Html\.RenderAction\()([^\)]+)(\))/g;
  input = input.replace(expValue, function (match, left, center, right) {
    center = center.replace('new {', '{');
    center = center.replace(/=/g, ':');
    return wrapWithBrackets('Html.RenderAction(' + center + ')', inScript, inQuotes);
  });

  input = input.trim();

  return input;
};

exports.ApplyRegularExpression = function (input, inScript, inQuotes) {
  var expBooleanBlock1 = /([a-zA-z-_]{1,}\=\")(checked\?\{.+)(\}\")/g;
  var expBooleanBlock2 = /([a-zA-z-_]{1,}\?\{)([^\}]+)(\})/g;
  var expBooleanBlock22 = /(.+\?\{)([^\}]+)(\})/g;
  var expBooleanBlock3 = /([a-zA-z-_]{1,}\=\"\?\{)(.+)(\}\")/g;
  var expBooleanBlock4 = /([a-zA-z-_]{1,}\=\"selected\?\{)(.+)(\}\")/g;
  var expBooleanBlock5 = /([a-zA-z-_]{1,}\=\"disabled\?\{)(.+)(\}\")/g;
  var expRenderAction = /(\#Html\.RenderAction\(\")(\w+)("\,.+)/g;

  var expJoin = /(string\.[jJ]oin\()([^\)]+)(\))/g;
  var expJoin2 = /([\$|\!]\{string\.[jJ]oin\()([^\)]+)(\)\})/g;

  if (input.match(expBooleanBlock1)) {
    return CheckBooleanBlock(input, inScript, inQuotes);
  } else if (input.match(expBooleanBlock2)) {
    return CheckBooleanBlock(input, inScript, inQuotes);
  } else if (input.match(expBooleanBlock22)) {
    return CheckBooleanBlock(input, inScript, inQuotes);
  } else if (input.match(expBooleanBlock3)) {
    return CheckBooleanBlock(input, inScript, inQuotes);
  } else if (input.match(expBooleanBlock4)) {
    return CheckBooleanBlock(input, inScript, inQuotes);
  } else if (input.match(expBooleanBlock5)) {
    return CheckBooleanBlock(input, inScript, inQuotes);
  } else if (input.match(expRenderAction)) {
    return CheckRenderActionBlock(input, inScript, inQuotes);
  } else if (input.match(expIsNullOrEmpty)) {
    return CheckBlockCode(input, inScript, inQuotes);
  } else if (input.match(expIsNullOrWhiteSpace)) {
    return CheckBlockCode(input, inScript, inQuotes);
  } else if (input.match(expJoin)) {
    return CheckBlockCode(input, inScript, inQuotes);
  } else if (input.match(expJoin2)) {
    return CheckBlockCode(input, inScript, inQuotes);
  } else if (input.match(expBlock)) {
    return CheckBlockCode(input, inScript, inQuotes);
  } else if (input.match(expBlock2)) {
    return CheckBlockCode(input, inScript, inQuotes);
  }

  return input;
};
