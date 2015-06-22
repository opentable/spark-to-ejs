'use strict';
 var decoder  = require('../lib/decoder.js');
 var tools    = require('../lib/tools.js');
 /*
 This file contains all the rules for converting spark templates to EJS templates
****************************************************************************
****************************************************************************

*ViewData function is a simple rule to eliminate all the viewdata spark tags on the templates.
* @example
*    Spark
*    <viewdata model="OpenTable.Web.SearchResults.Web.Models.ViewModels.SearchViewModel" />
*/

function viewdataRule(element){
  var startTag ="",
      endTag = "";
  return [startTag,endTag];
}

 /*
 * else rule function
 * Transform the structure of else spark to ejs
 * Example
 * @example
 *      SPARK
 *      <else>
 *          <div>content</div>
 *      </else>
 *
 *      EJS
 *      <% else{ %>
 *          <div>content</div>
 *      <%}%>
 * @param element
 * @return
 */
function elseRule(element) {
    var startTag = "<% else {%>",
        endTag = "<%}%>";
    return [startTag,endTag];
}

 /*
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
 * If attribute rule function
 * Transform the structure of if attribute spark to ejs
 * Example
 * @example
 *      SPARK
 *      <div class="main" if="timeslots.HasAvail">
 *          <div>content</div>
 *      </if>
 *
 *      EJS
 *      <% if(timeslots.HasAvail){ %>
 *          <div class="main">
 *              <div>content</div>
 *          </div>
 *      <%}%>
 * @param element
 * @return
 */
function ifAttributeRule(element) {
    var startTag = "<% if(:condition){%>\n <:element :attributes >",
        endTag = "</:element> \n <%}%>",
    condition = element.attribs.if;
    delete element.attribs.if;
    if(condition !== undefined) {
        startTag =startTag.replace(':condition',condition).replace(":element",element.name);
    }

    startTag= startTag.replace(":attributes",decoder.renderAttributes(element.attribs));
    endTag = endTag.replace(":element",element.name);
    return [startTag, endTag];
}


function textRule(element) {
    var startTag ="", endTag = "";

    if(element.data.trim() !== "") {
        startTag = element.data;
    }
    return [startTag,endTag];
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
            argumentsPartial  = element.attribs.partial,attr;
            delete element.attribs.partial;
            attr=decoder.renderPartialAttributes(element.attribs);

          if(argumentsPartial.length>0) {
             renderTag =renderTag.replace(':partial',argumentsPartial).replace(':arguments',attr);
           }
     return  [renderTag,''] ;
}

module.exports.applyRule = function(element) {
   var condition= tools.getCondition(element);
   switch(condition) {

        case "else":
            return  elseRule(element);
        case "viewdata":
            return  viewdataRule(element);
        case "render":
            return  renderpartialRule(element);
        case "if":
            return  ifRule(element);
        case "ifAttribute":
            return    ifAttributeRule(element);
        case "for":
            return  foreachRule(element);
        case "text":
           return textRule(element);
        case 'root':
           return ["",""];
        default:
                 var attributes = decoder.renderAttributes(element.attribs);
                 if(element.name) {
                 return ["<"+element.name+ attributes +">", "</"+ element.name + ">"];
                 }
            return ["", ""];
   }
};
