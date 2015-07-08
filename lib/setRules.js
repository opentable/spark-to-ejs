// 'use strict';
 var decoder  = require('../lib/decoder.js');
 var tools    = require('../lib/tools.js');

/*
 This file contains all the rules for converting spark templates to EJS templates
*********************************************************************************
*********************************************************************************

/**
* TestRule function convert the spark <test if> to ejs
* @example
*      SPARK
*      <test if="x">anyXml</test>
*
*      EJS
*      <% if(x){%>anyXml
*      <% } %>
*/
function TestRule(element){
      var startTag = "<% if(:condition){%>",endTag;
      var condition = element.attribs.if;
          if(condition !== undefined) {
              startTag =startTag.replace(':condition',condition);
            }
            endTag="<% } %>";
          //endTag=tools.getEndTagIf(element);
      return [startTag, endTag];
}
/**
* ViewDataRule function is a simple rule to eliminate all the viewdata spark tags on the templates.
* @example
*    Spark
*    <viewdata model="OpenTable.Web.SearchResults.Web.Models.ViewModels.SearchViewModel" />
*/
function viewdataRule(element){
      var startTag ="",
      endTag = "";
      return [startTag,endTag];
}
/** ContentRule function is going to change the  spark content tag to EJS.
/
* Example
* @example
*      SPARK
*      <content name="cssComponent">
*        <h3>Some content</h3>
*      </content>
*
*      EJS
*       <% block('cssComponent').append('<h3>Some content</h3>') %>
* @param element
* @return
*/
function ContentRule(element){
    var startTag = "<% block(':name').append('",
        endTag = "') %>",
        name = element.attribs.name;
        delete element.attribs.name;
        if(name !== undefined) {
            startTag =startTag.replace(':name',name);
        }
    return [startTag, endTag];
}
/*
* UseContentRule function is going to change the spark use Content tags to EJS
* Example
* @example
*      SPARK
*  <use content="data" />
*
*      EJS
* <%- block('data').toString() %>
* @param element
* @return
*/
function UseContentRule(element){
   var startTag = "<%- block(':name').toString() %>",
      endTag = "",
      name = element.attribs.content;
      delete element.attribs.content;
      if(name !== undefined) {
          startTag =startTag.replace(':name',name);
      }
      return [startTag, endTag];
}
/*
* Cache function is a simple rule to comment all the cache spark tags.
*/
function cacheRule(element){
  var attributes = decoder.renderAttributes(element.attribs);
  if(element.name) {
  return ['<%\/\*'+"<"+element.name+ attributes +">\*\/%>", "<%\/\*</"+ element.name + ">"+"\*\/%>"];
  }
}
 /**
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
          var startTag = "<%} else {%>",
            endTag = "<%}%>";
    return [startTag,endTag];
}
/**
* varRule function
* Transform the spark vars to ejs
* Example
* @example
*      SPARK
*        <var  offersFilters="offers.Filters" />
*      EJS
*        <%var offersFilters="offers.Filters" %>
* @param element
* @return
*/
function varRule(element) {
          var startTag = "",endTag = "";
          startTag+=decoder.renderVarAttributes(element.attribs);
    return [startTag,endTag];
}
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
    var startTag = "<% if(:condition){%>",endTag;
    var condition = element.attribs.condition;
        if(condition !== undefined) {
            startTag =startTag.replace(':condition',condition);
          }

        endTag=tools.getEndTagIf(element);

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
/**
* The textRule function is going to apply some rules to the text elements on the project,one of them is check if the text has the spark tags ${}.
**/
function textRule(element) {
    var startTag ="", endTag = "";
    if(element.data.trim() !== "") {
        startTag=tools.ApplyRegularExpression(element.data);
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
* Attribute each rule function
* Transform the structure of element each spark to ejs
* Example
* @example
*      SPARK
*      <div class="modal-list tooltip-offers">
*       <label each="var offer in offersTooltip.Offers" class="offer menu-list-label">${offer}</label>
*      </div>
*
*      EJS
*    <div class='modal-list tooltip-offers' >
*          <% offersTooltip.Offers.forEach(function(offer) { %>
*               <label class='offer menu-list-label' >${offer}</label>
*          <%)}%>
*     </div>
* @param element
* @return
*/
function attributeEach(element) {
    var startTag = " <% :object.forEach(function(:index) { %>"+"<:element.name:attributes>",
          endTag = "</:element.name><%)}%>",
          argumentsEach  = element.attribs.each.split(" ");
          delete element.attribs.each;
  var attributes=decoder.renderAttributes(element.attribs);
        if(arguments.length>0) {
         startTag =startTag.replace(':object',argumentsEach[3]).replace(':index',argumentsEach[1]).replace(':element.name',element.name).replace(':attributes',attributes);
         endTag=endTag.replace(':element.name',element.name);
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
     var renderTag = " <%-partial(':partial':arguments)%>",
            argumentsPartial  = element.attribs.partial,attr;
            delete element.attribs.partial;
            attr=decoder.renderPartialAttributes(element.attribs);
          if(argumentsPartial.length>0) {
             renderTag =renderTag.replace(':partial',argumentsPartial).replace(':arguments',attr);
           }
     return  [renderTag,''] ;
}
 /**
 * If render rule function
 * Transform the spark render tag inside a If tag
 * @example
 *      SPARK
 *      <render if="Model.Display.ShowSearchImage" partial="Redesign/Search/_SearchImage" searchImage="Model" />
 *
 *      EJS
 *      <% if(Model.Display.ShowSearchImage){ %>
 *          <%-partial('Redesign/Search/_SearchImage',searchImage=Model)%>
 *      <%}%>
 * @param element
 * @return
 */
function ifRenderRule(element) {
    var startTag = "<% if(:condition){%>\n",
        endTag = "\n <%}%>",
        response,
        condition = element.attribs.if;
    delete element.attribs.if;
    if(condition !== undefined) {
        startTag =startTag.replace(':condition',condition);
    }
    response = renderpartialRule(element);
    startTag+=response[0];
    return [startTag, endTag];
}
/*
* this module set the rule to the elements on the Dom
*/
module.exports.applyRule = function(element) {
   var condition= tools.getCondition(element);
   switch(condition) {

        case "test":
            return TestRule(element);
        case "use":
            return UseContentRule(element);
        case "content":
            return ContentRule(element);
        case "cache":
            return cacheRule(element);
        case "var":
            return varRule(element);
        case "attributeEach":
            return  attributeEach(element);
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
        case "ifRender":
           return ifRenderRule(element);
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
