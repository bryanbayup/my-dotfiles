!function(e){var n={};function t(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,t),i.l=!0,i.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var i in e)t.d(o,i,function(n){return e[n]}.bind(null,i));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";t.r(n),t.d(n,"default",(function(){return i}));var o={collection:[{id:1,position:1,name:"name_1",sname:"none",min:0,max:0,value:0},{id:2,position:2,name:"name_2",sname:"grayscale",min:0,max:100,value:80},{id:3,position:3,name:"name_3",sname:"sepia",min:0,max:100,value:80},{id:4,position:4,name:"name_4",sname:"invert",min:0,max:100,value:80},{id:5,position:5,name:"name_5",sname:"hue-rotate",min:0,max:360,value:90},{id:6,position:5,name:"name_6",sname:"blur",min:0,max:35,value:10},{id:7,position:7,name:"name_7",sname:"contrast",min:100,max:1e3,value:300}]};function i(){return o}o.get=e=>new Promise(n=>{const t=e.reduce((e,n)=>(e[n]=o[n],e),{});chrome.storage.local.get(t,n)}),o.getCollection=()=>new Promise(e=>{o.get(["collection"]).then(n=>{let t=n.collection;t.sort((function(e,n){let t=0;return e.position>n.position?t=1:e.position<n.position&&(t=-1),t})),e(t)})})}]);