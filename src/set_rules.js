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
function ifRule(element) {
    var startTag = "<% if(:condition){%>",
        endTag = "<%}%>",
        condition = element.attribs['condition'];

    if(condition !== undefined) {
        startTag =startTag.replace(':condition',condition);
    }
    return [startTag, endTag];
}
function foreachRule(element) {
    
    var startTag = " <% :object.forEach(function(:index) { %>",
          endTag = "<%)}%>",
          argumentsFor  = element.attribs['each'].split(" ");
   
    if(arguments.length>0) {
        startTag =startTag.replace(':object',argumentsFor[3]).replace(':index',argumentsFor[1]);
    }
    return [startTag, endTag];
}

exports.applyRule = function(element) {
   switch(element.name) {
        case "if":
            return  ifRule(element);
        case "for":
            return  foreachRule(element);
        case "render":
        default:
            if(element.name) {
                 return ["<"+element.name+">", "<"+ element.name + "/>"];   
            }
            return ["", ""];      
   }
};
