'use strict';
var ejsRules = require("./ejsRules.js");
var scriptRules = require("./scriptRules.js");
var watermark = "<!-- spark-to-ejs - https://github.com/opentable/spark-to-ejs -->\n";

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
      content += traverseDom(
        element.children[i],
        structure.inScript,
        indent + '  '
      );

      if (structure.inScript) { content += ' + '; }
    }
  }

  if (structure !== undefined) {
    output = indent + structure.startTag + content + indent + structure.endTag;
    output = output.replace(/\s*$/, '\n');
  }

  if (output.length && output[output.length - 1] !== '\n') {
    output += '\n';
  }

  return output;
}

exports.rulesEngine = function (data, cheerio) {
  var $ = cheerio.load(data, {
    recognizeSelfClosing: true,
    lowerCaseAttributeNames: false
  });

  var output = watermark + traverseDom($.root()[0], false, '');
  output = output.replace(/\n\n/g, '\n');

  return output;
};
