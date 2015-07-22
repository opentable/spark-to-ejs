var decoder = require('../lib/decoder.js');
var tools = require('../lib/tools.js');

/* This file contains all the rules for converting spark templates to EJS templates*/


/**
 * TestRule function is going to convert the spark <test if> tags to ejs
 * @example
 *      SPARK
 *      <test if="x">anyXml</test>
 *
 *      EJS
 *      <% if(x){%>anyXml
 *      <% } %>
 */
function TestRule(element) {
  var startTag = "if (:condition) { ",
      endTag  = " }";

  var condition = tools.ApplyRegularExpression(element.attribs.if, true);

  if (condition !== undefined) {
    startTag = startTag.replace(':condition', condition);
  }

  return { startTag, endTag };
}
/**
 * ViewDataRule function is a simple rule to comment all the viewdata spark tags on the templates.
 * @example
 *    SPARK
 *    <viewdata model="OpenTable.Web.SearchResults.Web.Models.ViewModels.SearchViewModel" />
 */
function ViewDataRule(element) {
  var attributes = decoder.renderAttributes(element.attribs, true);

  return {
    startTag: '/*' + "<" + element.name + attributes + ">",
    endTag: ' */'
  };
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
function ContentRule(element) {
  throw new Error('should not have nested content blocks');
  // var startTag = "<% block(':name').append('";
  // var endTag = "') %>";
  // var name = element.attribs.name;
  // delete element.attribs.name;

  // if (name !== undefined) {
  //   startTag = startTag.replace(':name', name);
  // }

  // return { startTag, endTag };
}

/**
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
function UseContentRule(element) {
  throw new Error('should not be rendering a content block inside a content block');
  // var startTag = "<%- block(':name').toString() %>",
  //   endTag = "",
  //   name = element.attribs.content;
  // delete element.attribs.content;
  // if (name !== undefined) {
  //   startTag = startTag.replace(':name', name);
  // }
  // return { startTag, endTag };
}
/**
 * cacheRule function is a simple rule to comment all the cache spark tags.
 */
function CacheRule(element) {
  return { startTag: "", endTag: "''" };
}
  /**
   * elseRule function
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
  function ElseRule(element) {
    var startTag = "} else {",
      endTag = "}";

    return { startTag, endTag };
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
  function VarRule(element) {
    var startTag = "' <!-- TODO: move the following line to the top of the file --> '\n + '";
    var endTag = "''";
    var response;

    for (var attribute in element.attribs) {
      if(element.attribs.hasOwnProperty(attribute)) {
        if (attribute !== 'type') {
          // TODO: this will never work as written
          response = tools.ApplyRegularExpression(element.attribs[attribute], true);

          startTag += 'var ' + attribute + " = " + response + ';\'\n + ';
        }
      }
    }

    return { startTag, endTag };
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
  function IfRule(element) {
    var startTag = "( :condition ? ";
    var endTag = "'' : '')";
    var condition = element.attribs.condition;
    condition = tools.ApplyRegularExpression(condition, true);
    if (condition !== undefined) {
      startTag = startTag.replace(':condition', condition);
    }

    // endTag = tools.getEndTagIf(element);

    return { startTag, endTag };
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
  function IfAttributeRule(element) {
    var startTag = "( :condition ? '<:element :attributes >' + '",
      endTag = "' + '</:element>' : '')",
      condition = element.attribs.if;
    condition = tools.ApplyRegularExpression(condition, true);

    delete element.attribs.if;
    if (condition !== undefined) {
      startTag = startTag.replace(':condition', condition).replace(":element", element.name);
    }

    startTag = startTag.replace(":attributes", decoder.renderAttributes(element.attribs, true));
    endTag = endTag.replace(":element", element.name);

    return { startTag, endTag };
  }
  /**
   * textRule function is going to apply some rules to the text elements on the project,one of them is check if the text has the spark tags ${}.
   **/
  function TextRule(element) {
    var startTag = "'";
    var endTag = "'";
    var isEmpty = true;

    element.data = element.data.trim();
    element.data = element.data.split('\n').join("' \n + '");

    if (element.data !== "") {
      startTag += tools.ApplyRegularExpression(element.data, true, true);
      isEmpty = false;
    }

    return { startTag, endTag, isEmpty };
  }
  /**
   * CommentRule function is going to write the Html comments.
   **/
  function CommentRule(element) {
    var startTag = "'<!--",
      endTag = "-->'";
    if (element.data.trim() !== "") {
      startTag += element.data;
    }

    return { startTag, endTag };
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
  function ForeachRule(element) {
    var startTag = " :object.map(function(:index) { return ",
      endTag = "''}).join('\\n')",
      argumentsFor = element.attribs.each.split(" ");

    if (arguments.length > 0) {
      startTag = startTag.replace(':object', argumentsFor[3]).replace(':index', argumentsFor[1]);
    }

    return { startTag, endTag };
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
  function AttributeEach(element) {
    var startTag = " :object.forEach(function(:index) { '<:element.name:attributes>' + ",
      endTag = "' + '</:element.name>'})",
      argumentsEach = element.attribs.each.split(" ");
    delete element.attribs.each;
    var attributes = decoder.renderAttributes(element.attribs, true);
    if (arguments.length > 0) {
      startTag = startTag.replace(':object', argumentsEach[3]).replace(':index', argumentsEach[1]).replace(':element.name', element.name).replace(':attributes', attributes);
      endTag = endTag.replace(':element.name', element.name);
    }

    return { startTag, endTag };
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
  function RenderPartialRule(element) {
    var renderTag = "partial(':partial':arguments)",
      argumentsPartial = element.attribs.partial,
      attr;
    delete element.attribs.partial;
    attr = decoder.renderPartialAttributes(element.attribs);
    if (argumentsPartial.length > 0) {
      renderTag = renderTag.replace(':partial', argumentsPartial).replace(':arguments', attr).replace('.spark', '');
    }
    return {
      startTag: renderTag,
      endTag: ''
    };
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
  function IfRenderRule(element) {
    var startTag = "( :condition ? return ";
    var endTag = "\n : '' )";
    var response;
    var condition = tools.ApplyRegularExpression(element.attribs.if, true);

    delete element.attribs.if;

    if (condition !== undefined) {
      startTag = startTag.replace(':condition', condition);
    }

    response = RenderPartialRule(element);
    startTag += response.startTag;

    return { startTag, endTag };
  }

  function DefaultRule(element) {
    var attributes = decoder.renderAttributes(element.attribs, true);

    if (element.name) {
      return {
        startTag: "'<" + element.name + attributes + ">' + ",
        endTag: "'</" + element.name + ">'"
      };
    }

    return { startTag: '', endTag: '' };
  }

  /**
   * This module set the rule to the elements on the DOM
   */
  module.exports.applyRule = function (element) {
    var condition = tools.getCondition(element);

    switch (condition) {
      case "comment":
        return CommentRule(element);
      case "test":
        return TestRule(element);
      case "use":
        return UseContentRule(element);
      case "content":
        return ContentRule(element);
      case "cache":
        return CacheRule(element);
      case "var":
        return VarRule(element);
      case "attributeEach":
        return AttributeEach(element);
      case "else":
        return ElseRule(element);
      case "viewdata":
        return ViewDataRule(element);
      case "render":
        return RenderPartialRule(element);
      case "if":
        return IfRule(element);
      case "ifAttribute":
        return IfAttributeRule(element);
      case "ifRender":
        return IfRenderRule(element);
      case "for":
        return ForeachRule(element);
      case "text":
        return TextRule(element);
      case 'root':
        return { startTag: "", endTag: "" };
      default:
        return DefaultRule(element);
    }
  };
