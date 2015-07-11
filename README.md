#Spark to EJS Converter Script
This is a gulp project that uses some awesome libraries like cheerio and ejs-mate for converting spark templates to ejs. so far, this project transform this spark tags

###some examples:
###If
```xml
    SPARK
      <if condition="item==true">
          <div>content</div>
      </if>
    EJS
      <% if(item==true){ %>
          <div>content</div>
      <%}%>
```
###Element if
```xml
    SPARK
       <div class="main" if="TableisTrue">
           <div>content</div>
       </if>
    EJS
       <% if(TableisTrue){ %>
           <div class="main">
               <div>content</div>
          </div>
      <%}%>
```
###Test if
 ```xml
    SPARK
     <test if="x">anyXml</test>
    EJS
     <% if(x){%>
       anyXml
     <% } %>
 ```
###Each attribute
```xml
    SPARK
         <label each="var offer in Offers" class="offers">${offer.name}</label>
    EJS
        <% Offers.forEach(function(offer) { %>
            <label class='offers' ><%=offer.name%></label>
        <%)}%>
```
###Foreach loop
```xml
    SPARK
       <for each="var restaurant in Restaurants">
          <div>content</div>
       </for>
    EJS
       <% Restaurants.forEach(function(restaurant) { %>
         <div>content</div>
       <%}%>
```

###Variables
```xml
    SPARK
       <var  RestaurantOffers="Restaurant.tables" />
    EJS
       <%var RestaurantOffers=Restaurant.tables %>
```
###Render Partial
```xml
    SPARK
        <render partial="Redesign/_Restaurants" Results="Model" />
    EJS
       <%-partial('Redesign/_Restaurants',Results=Model)%>
```
##Installation
```$git clone https://github.com/opentable/spark-to-ejs.git```<br>
   ```$cd spark-to-ejs```<br>
   ```$npm install```<br>
###Run
   ```$ gulp build```<br>
###Configuration
You need to change the default path of your spark templates on ```config.js```,by default all the new ejs templates is going to be on /templates-ejs.
```js
module.exports = {
   inputPath : './Views',
   outPath  :  './templates-ejs'
};
```
The MIT License (MIT)
