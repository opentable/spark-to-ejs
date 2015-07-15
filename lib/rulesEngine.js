'use strict';
var ejsRules = require("./ejsRules.js");
var scriptRules = require("./scriptRules.js");
var watermark = "<!-- Template generated with OpenTable -spark to ejs convert V1.0 -https://github.com/opentable/spark-to-ejs -->\n\n\n\n";

function traverseDom(element, inScript) {
  var content = "";
  var output = "";
  var ruleSet = inScript ? scriptRules : ejsRules;
  var structure = ruleSet.applyRule(element);

  if (element.hasOwnProperty('children')) {
    for (var i = 0; i < element.children.length; i++) {
      content += traverseDom(element.children[i], element.inScript);
    }
  }

  if (structure !== undefined) {
    output = structure.startTag + content + structure.endTag;
  }

  return output + "\n";
}

exports.rulesEngine = function (data, cheerio) {
  var $ = cheerio.load(data, {
    recognizeSelfClosing: true
  });
  return watermark + traverseDom($.root()[0], false);

};
