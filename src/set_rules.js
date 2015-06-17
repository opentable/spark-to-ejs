(function(){
	'use strict';

    /**
     * If rule function
     * Transform the structure of if spark to ejs
     * Example
     * @example
     *      SPARK
     *      <if condition="timeslots.HasAvail">
     *          <div>content</div>
     *      </if>
     *
     *      EJS
     *      <% if(condition){ %>
     *          <div>content</div>
     *      <%}%>
     * @param $
     * @param element
     *
     */
	function ifRule($,element) {
		var ifTag = "<% if(:condition){%>",
			ifEnd = "<%}%>",
			condition,
			newElement;

		condition = element.attribs['condition'];
		if(condition !== undefined) {
			ifTag = ifTag.replace(':condition',condition);
		}
		newElement = ifTag + $(element).html()+ ifEnd;
		$(element).replaceWith(newElement);
	}

	module.exports = [
		["if",ifRule]
	];
})();
