'use strict';
var setRules = require("./setRules.js");

    function traverseDom(element) {
        var content = "",
            output = "",
            structure = setRules.applyRule(element);

        if(element.hasOwnProperty('children')) {
            for(var i=0; i<element.children.length; i++ ) {
                content += traverseDom(element.children[i]);
            }
        }

        if(structure !== undefined) {
            output = structure[0] + content+ structure[1];
        }

        return output + "\n";
    }

exports.rulesEngine = function (data, cheerio) {
    var $ = cheerio.load(data, {
            recognizeSelfClosing : true
        });
    return traverseDom($.root()[0]);

};
