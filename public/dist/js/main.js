!function(){"use strict";var a=angular.module("snakeApp",["ngRoute","ngTouch","snakeScreen","snakeGame","snakeLogin"]);a.config(["$routeProvider",function(a){a.when("/login/:menuItem",{templateUrl:"views/login.html"}).when("/game/:menuItem",{templateUrl:"views/screen.html"}).otherwise({redirectTo:function(a,b){switch(b){case"/login":return"/login/signin";case"/game":return"/game/settings";default:return"/game/settings"}}})}]),a.controller("AppCtrl",["$scope","$rootScope","$route",function(){}]),a.directive("ngMatch",["$parse",function(a){function b(b,c,d,e){if(e&&d.ngMatch){var f=a(d.ngMatch),g=function(a){var c=f(b),d=a===c;return e.$setValidity("match",d),a};e.$parsers.unshift(g),e.$formatters.push(g),d.$observe("ngMatch",function(){g(e.$viewValue)})}}var c={link:b,restrict:"A",require:"?ngModel"};return c}])}(),function(){"use scrict";var a=angular.module("snakeGame",[]);a.factory("settings",function(){var a={difficulty:1,difficultyOptions:[{name:"hard",number:0},{name:"medium",number:1},{name:"easy",number:2}],speed:1,speedOptions:[{name:1,number:0},{name:2,number:1},{name:3,number:2},{name:4,number:3},{name:5,number:4}],control:0,controlOptions:[{name:"touch control",number:0},{name:"accelerometer",number:1}]};return window.DeviceMotionEvent||a.controlOptions.pop(),a}),a.controller("GameScreenCtrl",["$scope",function(){this.menu=[{name:"score",url:"score",style:{width:"108px"}},{name:"settings",url:"settings",style:{width:"155px"}},{name:"play game",url:"playgame",style:{width:"198px"}},{name:"score",url:"score",style:{width:"108px"}},{name:"settings",url:"settings",style:{width:"155px"}},{name:"play game",url:"playgame",style:{width:"198px"}}],this.navStyle={}}]),a.controller("SettingsCtrl",["$scope","settings",function(a,b){this.difficulty=b.difficulty,this.difficultyOptions=b.difficultyOptions,this.speed=b.speed,this.speedOptions=b.speedOptions,this.control=b.control,this.controlOptions=b.controlOptions}]),a.controller("GameCtrl",["$scope",function(){}]),a.controller("ScoreCtrl",["$scope",function(){}])}(),function(){"use strict";var a=angular.module("snakeLogin",[]);a.controller("LoginCtrl",["$scope","$rootScope",function(){this.menu=[{name:"registration",url:"registration",style:{width:"219px"}},{name:"sign in",url:"signin",style:{width:"133px"}},{name:"registration",url:"registration",style:{width:"219px"}},{name:"sign in",url:"signin",style:{width:"133px"}}],this.navStyle={}}]),a.directive("signIn",function(){return{restrict:"A",controller:["$scope",function(){this.user={username:"",password:""}}]}}),a.controller("SignInCtrl",["$scope",function(){this.user={username:"",password:""}}]),a.controller("RegisterCtrl",["$scope",function(){this.user={username:"",password:"",confirmPassword:""}}])}(),function(){"use strict";var a=angular.module("snakeScreen",[]);a.factory("screenData",["$swipe","$route",function(a,b){return{screenStyle:{"margin-left":"0px"},setActive:function(a){for(var c=b.current.params.menuItem,d=0;d<a.length;d++)if(a[d].url===c){switch(d){case 0:a.unshift(a.pop());break;case 1:break;default:a.concat(a.splice(0,d))}break}},onSwipe:function(b,c){var d;b.swipe=!0,a.bind(b,{start:function(a){d=a,c[0]&&c[0](d,a)},move:function(a){b.swipe&&c[0]&&c[0](d,a)},end:function(a){b.swipe&&c[1]&&c[1](d,a)},cancel:function(){}})},offSwipe:function(a){a.swipe=!1}}}]),a.controller("ScreenCtrl",["$scope","screenData",function(a,b){this.screenStyle=b.screenStyle}]),a.directive("screenWrapper",["screenData",function(a){return{restrict:"E",replace:!0,transclude:!0,templateUrl:"templates/screen.html",scope:{menu:"=",navStyle:"="},link:function(b,c){var d=c.parent();a.setActive(b.menu),b.navStyle.transform="translateX(-"+b.menu[0].style.width+")",a.onSwipe(d,[function(c,e){b.$apply(function(){var f=e.x-c.x,g=d[0].offsetWidth,h=f>0?b.menu[0].style.width:b.menu[1].style.width;b.navStyle["margin-left"]=f/g*parseInt(h)+"px",a.screenStyle["margin-left"]=f+"px"})},function(e,f){b.$apply(function(){var g=d[0].offsetWidth,h=f.x-e.x,i=h>0?parseInt(b.menu[0].style.width):-parseInt(b.menu[1].style.width);3*Math.abs(h)>g?(TweenLite.to(c[0],.2,{css:{marginLeft:g*h/Math.abs(h)},onComplete:function(){b.$apply(function(){var d=-g;h>0?b.menu.unshift(b.menu.pop()):(b.menu.push(b.menu.shift()),d=g),TweenLite.fromTo(c[0],.2,{css:{marginLeft:d}},{css:{marginLeft:0},onComplete:function(){a.screenStyle["margin-left"]="0px"}})})}}),TweenLite.to("#main-nav ul",.2,{css:{marginLeft:i},onComplete:function(){b.$apply(function(){b.navStyle.transform="translateX(-"+b.menu[0].style.width+")",b.navStyle["margin-left"]="0px"})}})):(TweenLite.to(c[0],.2,{css:{marginLeft:0}}),TweenLite.to("#main-nav ul",.2,{css:{marginLeft:0}}))})}])}}}]),a.directive("wpSelect",function(){return{restrict:"E",replace:!0,templateUrl:"templates/select.html",scope:{model:"=",options:"="},link:function(a,b){b.children().css({"margin-top":-20*a.model+"px"}),b.on("click",function(){if(!b.hasClass("no-clickable")){var a=b.children().children().length;b.addClass("expanded").addClass("no-clickable"),TweenLite.to(b[0],.4,{css:{height:4+35*a}}),TweenLite.to(b.children()[0],.4,{css:{marginTop:0}})}})},controller:["$scope",function(a){this.setModel=function(b){a.$apply(function(){a.model=b})}}]}}),a.directive("wpOption",function(){return{restrict:"E",replace:!0,transclude:!0,require:"^wpSelect",templateUrl:"templates/option.html",scope:{option:"="},link:function(a,b,c,d){var e=b.parent(),f=e.parent();b.on("click",function(){f.hasClass("expanded")&&(d.setModel(a.option.number),f.removeClass("expanded"),TweenLite.to(f,.4,{css:{height:24},onComplete:function(){f.removeClass("no-clickable")}}),TweenLite.to(e,.4,{css:{marginTop:-20*a.option.number}}))})}}})}();