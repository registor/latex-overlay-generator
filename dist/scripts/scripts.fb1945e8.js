"use strict";angular.module("latexOverlayApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","xeditable","ui.codemirror","ngDialog"]).config(["$routeProvider",function(a){a.when("/v0.0.1",{templateUrl:"views/v0.0.1.html",controller:"MainCtrl"}).when("/",{templateUrl:"views/about.html",controller:"AboutCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope",function(a){a.latex={},a.latex.code="",a.overlay={},a.overlay.file="black-demo.png",a.overlay.items=[{macro:"annotatedFigureBox",label:"A",position:"bl",x0:.01,y0:.7,x1:.32,y1:.89,x2:.01,y2:.7},{macro:"annotatedFigureBox",label:"B",position:"bl",x0:.32,y0:.19,x1:.4,y1:.3,x2:.32,y2:.19},{macro:"annotatedFigureBox",label:"C",position:"bl",x0:.49,y0:.8,x1:.53,y1:.89,x2:.49,y2:.8},{macro:"annotatedFigureBox",label:"D",position:"bl",x0:.5,y0:.18,x1:.7,y1:.3,x2:.5,y2:.18}]}]),angular.module("latexOverlayApp").controller("RadiolistCtrl",["$scope","$filter",function(a,b){a.statuses=[{value:"tl",text:"top-left"},{value:"bl",text:"bottom-left"},{value:"tr",text:"top-right"},{value:"br",text:"bottom-right"},{value:"na",text:"custom"}],a.showStatus=function(){var c=b("filter")(a.statuses,{value:a.selectedItem.position});return a.selectedItem.position&&c.length?c[0].text:"Not set"}}]).controller("MainCtrl",["$scope","$rootScope","ngDialog","$http",function(a,b,c,d){function e(){var a="\\begin{annotatedFigure}\n";a=a+"	{\\includegraphics[width=1.0\\linewidth]{"+b.overlay.file+"}}\n";for(var c=0;c<b.overlay.items.length;c++){var d=b.overlay.items[c];a=a+"	\\"+d.macro+"{"+d.x0+","+d.y0+"}{"+d.x1+","+d.y1+"}{"+d.label+"}{"+d.x2+","+d.y2+"}%"+d.position+"\n"}return a+="\\end{annotatedFigure}\n"}function f(b){var c=1/a.overlay.width*b;return Number(c.toFixed(4))}function g(b){var c=1-1/a.overlay.height*b;return Number(c.toFixed(4))}function h(b){var c=b*a.overlay.width;return c}function i(b){var c=a.overlay.height-b*a.overlay.height;return c}function j(a){var c=new fabric.Point(h(a.x0),i(a.y0)),d=(a.x1-a.x0)*b.overlay.width,e=(a.y1-a.y0)*b.overlay.height,f=new fabric.Rect({hasBorders:!1,fill:"blue",opacity:.5,width:d,height:e,hasRotatingPoint:!1,dataItem:a,strokeWidth:0,angle:0});f.setPositionByOrigin(c,"left","bottom"),n.add(f);var g=new fabric.Circle({radius:10,fill:"#eef",originX:"center",originY:"center"}),j=new fabric.Text(a.label,{fontSize:10,originX:"center",originY:"center"}),k=new fabric.Group([g,j],{left:0,top:0,selectable:!1}),l=new fabric.Point(h(a.x2),i(a.y2));k.setPositionByOrigin(l,"center","center"),n.add(k),n.renderAll()}function k(a,b){var c=new Image;c.onload=b,c.src=a}function l(b){k(b,function(c){var d=this;console.log("Local image loaded locally: "+this.width+"x"+this.height),d.width>d.height?(a.overlay.orientation="landscape",a.overlay.width=n.width,a.overlay.height=n.width*(d.height/d.width)):(a.overlay.orientation="portrait",a.overlay.width=n.height*(d.width/d.height),a.overlay.height=n.height),n.setBackgroundImage(b,n.renderAll.bind(n),{left:0,top:0,originX:"left",originY:"top",width:a.overlay.width,height:a.overlay.height}),a.redrawOverlays()})}function m(a,b){PDFJS.getDocument(a).then(function(a){a.getPage(1).then(function(a){var c=1,d=a.getViewport(c),e=document.getElementById("offscreenCanvas");e.height=d.height,e.width=d.width;{var f=e.getContext("2d"),g={canvasContext:f,viewport:d};a.render(g).then(function(){b(e.toDataURL())})}})})}a.editorOptions={lineWrapping:!0,lineNumbers:!0,mode:"stex",theme:"default"},a.latex.code=b.latex.code,a.selectedItem={};var n=new fabric.Canvas("overlayCanvas",{selection:!0});a.getFullLatex=function(){d.get("v0.0.1.txt").success(function(b){var c=e(),d=b.replace("%ANNOTATED_FIGURE%",c);a.latex.code=d})},a.createLatexCode=function(){var a=e();b.latex.code=a},a.changeAllLabelPosition=function(){for(var a=0;a<b.overlay.items.length;a++){var c=b.overlay.items[a];"bl"===c.position&&(c.x2=c.x0,c.y2=c.y0),"tl"===c.position&&(c.x2=c.x0,c.y2=c.y1),"tr"===c.position&&(c.x2=c.x1,c.y2=c.y1),"br"===c.position&&(c.x2=c.x1,c.y2=c.y0)}},a.changeLabelPosition=function(a){"bl"===a.position&&(a.x2=a.x0,a.y2=a.y0),"tl"===a.position&&(a.x2=a.x0,a.y2=a.y1),"tr"===a.position&&(a.x2=a.x1,a.y2=a.y1),"br"===a.position&&(a.x2=a.x1,a.y2=a.y0)},n.on({"object:modified":function(c){var d=(c.target,n.getActiveObject());d.dataItem.x0=f(d.oCoords.bl.x),d.dataItem.y0=g(d.oCoords.bl.y),d.dataItem.x1=f(d.oCoords.tr.x),d.dataItem.y1=g(d.oCoords.tr.y),b.$apply(function(){a.changeLabelPosition(d.dataItem),a.createLatexCode(),a.redrawOverlays()})},"object:selected":function(c){var d=n.getActiveObject();console.log(d.dataItem),a.selectedItem=d.dataItem,b.$apply()}}),n.selection=!1,a.clickToOpen=function(b){a.item=b,c.open({template:"dialogs/overlay.html",showClose:!0,scope:a})},a.redrawOverlays=function(){n.clear().renderAll();for(var a=0;a<b.overlay.items.length;a++){var c=b.overlay.items[a];j(c)}},a.parseLatexCode=function(){var c,d=a.latex.code,e=/\\annotatedFigureBox{(.*),(.*)}{(.*),(.*)}{(.*)}{(.*),(.*)}%(.*)/g;for(b.overlay.items=[];null!==(c=e.exec(d));){var f={macro:"annotatedFigureBox",label:c[5],x0:c[1],y0:c[2],x1:c[3],y1:c[4],x2:c[6],y2:c[7],position:c[8]};b.overlay.items.push(f)}};var o=document.getElementById("fileSelect");$('[data-toggle="tooltip"]').tooltip(),o.addEventListener("change",function(c){var d=o.files[0],e=new FileReader;e.onload=function(c){b.overlay.file=d.name,console.log(d.name);var f=d.name.split(".").pop().toLowerCase();"pdf"==f?(console.log("Convert pdf file..."),m(e.result,function(c){l(c),b.$apply(function(){a.createLatexCode(),a.redrawOverlays()})})):(l(e.result),b.$apply(function(){a.createLatexCode(),a.redrawOverlays()}))},e.readAsDataURL(d)}),a.createLatexCode(),l("black-demo.png")}]),angular.module("latexOverlayApp").controller("AboutCtrl",["$scope","$http",function(a,b){a.editorOptions={readOnly:!0,lineWrapping:!0,lineNumbers:!0,mode:"stex",theme:"default"},a.usage={},a.usage.code="",b.get("usage.txt").success(function(b){a.usage.code=b})}]);