(function () {
	'use strict';
	function rulesEngine(data, setRules, cheerio) {
		var $ = cheerio.load(data),
			selector = null,
			elements = null,
			rule = null;
		for (var i=0; i < setRules.length; i++) {
			selector = setRules[i][0];
			rule = setRules[i][1];
			elements = $(selector);
			for (var j=0; j < elements.length; j++) {
				rule($, elements[j]);
			}
		}
		return $.html();
	}
	module.exports = rulesEngine;
})();
