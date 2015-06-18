'use strict';
var setRules = require("./set_rules.js");
    
    function traverseDom(element) {
        var content = "", 
            structure = setRules.applyRule(element),
            output = "";
        console.log(element.name,element.type);
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

exports.rulesEngine = function (data, cheerio) {
    var $ = cheerio.load(data, {
            recognizeSelfClosing : true
        });
    return traverseDom($.root()[0]);
};
