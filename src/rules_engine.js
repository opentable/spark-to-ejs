'use strict';
var setRules = require("./set_rules.js");

exports.rulesEngine = function (data, cheerio) {
    var $ = cheerio.load(data, {
            recognizeSelfClosing : true
        }),
        selector = null,
        elements = null,
        rule = null,
        output = null;

    //0 output = ""
    //1. Get all nodes from beginning & loop
    //1.1  find a matching rule for the current node
    //1.2  snipet = execute rule
    //1.3  output +=snipet
    //2. save new ejs file (output)

    function traverseDom(element) {
        var content = "", structure;
            structure = setRules.applyRule(element),
            output = "";

        if(element.children !== undefined) {
            for(var i=0; i<element.children.length; i++ ) {
                content += "\n\t" + traverseDom(element.children[i]);
            }
        }

        if(structure !== undefined) {
            output = structure[0] + content + structure[1];
        }

        return output;
    }

    return traverseDom($.root()[0]);
};
