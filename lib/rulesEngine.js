'use strict';
var ejsRules = require("./ejsRules.js");
var scriptRules = require("./scriptRules.js");

var emptyLineRegex  = / \+\s+' *'\s*/g;
var normalizeWhitespaceRegex = /\s\+\s{2,}([^\s])/g;
var scriptTagRegex = /' \+   '\<\/script\>/;

function cleanupOutput(output) {
  if (output.length && output[output.length - 1] !== '\n') {
    output += '\n';
  }

  output = output.replace(emptyLineRegex, " + ' '\n ");
  output = output.replace(scriptTagRegex, '</script>');

  output = output.replace(normalizeWhitespaceRegex, function(match, characterMatch) {
    return ' + ' + characterMatch;
  });

  output = output.replace(/ \+ ''/g, '');
  output = output.replace(/\.append\( *' *' *\n \+ /, '.append(\n');

  return output;
}

function traverseDom(element, inScript, indent) {
  var content = "";
  var output = "";
  var ruleSet = inScript ? scriptRules : ejsRules;
  var structure = ruleSet.applyRule(element);

  // The hotel California of conditions
  // once you're in a script block you can never leave
  structure.inScript = structure.inScript || inScript;

  if (element.hasOwnProperty('children')) {
    for (var i = 0; i < element.children.length; i++) {
      var extraIndent = '  ';

      if(structure.isRoot) {
        extraIndent = '';
      }

      content += traverseDom(
        element.children[i],
        structure.inScript,
        indent + extraIndent
      );

      if (structure.inScript) { content += ' + '; }
    }
  }

  if (structure !== undefined) {
    output = indent + structure.startTag + content + indent + structure.endTag;
    output = output.replace(/\s*$/, '\n');
  }

  return cleanupOutput(output);
}

exports.rulesEngine = function (data, cheerio) {
  var $ = cheerio.load(data, {
    recognizeSelfClosing: true,
    lowerCaseAttributeNames: false
  });

  var output = traverseDom($.root()[0], false, '');
  output = output.replace(/\n\n/g, '\n');

  return output;
};
