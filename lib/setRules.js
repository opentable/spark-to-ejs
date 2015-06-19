'use strict';
 var decoder  = require('../lib/decoder.js');
 /*
 This file contains all the rules for converting spark templates to EJS templates
****************************************************************************
****************************************************************************
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
 * @param element
 * @return
 */
function ifRule(element) {
    var startTag = "<% if(:condition){%>",
        endTag = "<%}%>",
        condition = element.attribs.condition;
 
    if(condition !== undefined) {
        startTag =startTag.replace(':condition',condition);
    }
    return [startTag, endTag];
}

/**
 * foreach rule function
 * Transform the structure of foreach spark to ejs
 * Example
 * @example
 *      SPARK
 *      <for each="var restaurant in resultsTable.Results.Restaurants">
 *          <div>content</div>
 *       </for>
 *
 *      EJS
 *      <% resultsTable.Results.Restaurants.forEach(function(restaurant) { %>
 *          <div>content</div>
 *      <%}%>
 * @param element
 * @return
 */
function foreachRule(element) {
    var startTag = " <% :object.forEach(function(:index) { %>",
          endTag = "<%)}%>",
          argumentsFor  = element.attribs.each.split(" ");
   
    if(arguments.length>0) {
        startTag =startTag.replace(':object',argumentsFor[3]).replace(':index',argumentsFor[1]);
    }
    return [startTag, endTag];
}

  /**
 * render rule function
 * Transform the structure of render partial spark to ejs
 * @example
 *      SPARK
 *        <render partial="Redesign/Modals/_SingleSearchModal" singleSearchModalModel="Model" />
 *      EJS
 *       <%-partial('../Redesign/Modals/_SingleSearchModal.ejs',singleSearchModalModel=Data.Model)%>
 * @param element
 * @return
 */
function renderpartialRule(element){
     var renderTag = " <%-partial(':partial', :arguments)%>",
            argumentsPartial  = element.attribs.partial,
            attr = null;
            delete element.attribspartial;
            attr=decoder.renderPartialAttributes(element.attribs);

          if(argumentsPartial.length>0) {
             renderTag =renderTag.replace(':partial',argumentsPartial[0]).replace(':arguments',attr);
           }
     return  [renderTag,''] ;
}

 
module.exports.applyRule = function(element) {
   switch(element.name) {
         case "render":
            return  renderpartialRule(element);
        case "if":
            return  ifRule(element);
        case "for":
            return  foreachRule(element);
        case 'root':
           return ["",""];
        case "render":
            return renderpartialRule(element);
        default:
                 var attributes = decoder.renderAttributes(element.attribs);
                 if(element.name) {
                 return ["<"+element.name+ attributes +">", "</"+ element.name + ">"];
                 }
            return ["", ""];      
   }
};