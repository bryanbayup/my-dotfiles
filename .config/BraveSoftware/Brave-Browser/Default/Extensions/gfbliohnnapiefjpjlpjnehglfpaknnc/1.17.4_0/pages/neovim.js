(()=>{var e={234:function(e){
/*! @license DOMPurify 2.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.4.7/LICENSE */
e.exports=function(){"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,n){return t=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},t(e,n)}function n(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function o(e,r,i){return o=n()?Reflect.construct:function(e,n,o){var r=[null];r.push.apply(r,n);var i=new(Function.bind.apply(e,r));return o&&t(i,o.prototype),i},o.apply(null,arguments)}function r(e){return i(e)||a(e)||c(e)||l()}function i(e){if(Array.isArray(e))return s(e)}function a(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function c(e,t){if(e){if("string"==typeof e)return s(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?s(e,t):void 0}}function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,o=new Array(t);n<t;n++)o[n]=e[n];return o}function l(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var u=Object.hasOwnProperty,f=Object.setPrototypeOf,d=Object.isFrozen,m=Object.getPrototypeOf,p=Object.getOwnPropertyDescriptor,h=Object.freeze,y=Object.seal,g=Object.create,b="undefined"!=typeof Reflect&&Reflect,v=b.apply,E=b.construct;v||(v=function(e,t,n){return e.apply(t,n)}),h||(h=function(e){return e}),y||(y=function(e){return e}),E||(E=function(e,t){return o(e,r(t))});var T=O(Array.prototype.forEach),A=O(Array.prototype.pop),S=O(Array.prototype.push),k=O(String.prototype.toLowerCase),w=O(String.prototype.toString),N=O(String.prototype.match),x=O(String.prototype.replace),C=O(String.prototype.indexOf),L=O(String.prototype.trim),U=O(RegExp.prototype.test),M=_(TypeError);function O(e){return function(t){for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return v(e,t,o)}}function _(e){return function(){for(var t=arguments.length,n=new Array(t),o=0;o<t;o++)n[o]=arguments[o];return E(e,n)}}function R(e,t,n){var o;n=null!==(o=n)&&void 0!==o?o:k,f&&f(e,null);for(var r=t.length;r--;){var i=t[r];if("string"==typeof i){var a=n(i);a!==i&&(d(t)||(t[r]=a),i=a)}e[i]=!0}return e}function D(e){var t,n=g(null);for(t in e)!0===v(u,e,[t])&&(n[t]=e[t]);return n}function I(e,t){for(;null!==e;){var n=p(e,t);if(n){if(n.get)return O(n.get);if("function"==typeof n.value)return O(n.value)}e=m(e)}function o(e){return console.warn("fallback value for",e),null}return o}var F=h(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),H=h(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),B=h(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),P=h(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),z=h(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),j=h(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),K=h(["#text"]),W=h(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),G=h(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),q=h(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Y=h(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),V=y(/\{\{[\w\W]*|[\w\W]*\}\}/gm),$=y(/<%[\w\W]*|[\w\W]*%>/gm),Q=y(/\${[\w\W]*}/gm),Z=y(/^data-[\-\w.\u00B7-\uFFFF]/),X=y(/^aria-[\-\w]+$/),J=y(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ee=y(/^(?:\w+script|data):/i),te=y(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),ne=y(/^html$/i),oe=function(){return"undefined"==typeof window?null:window},re=function(t,n){if("object"!==e(t)||"function"!=typeof t.createPolicy)return null;var o=null,r="data-tt-policy-suffix";n.currentScript&&n.currentScript.hasAttribute(r)&&(o=n.currentScript.getAttribute(r));var i="dompurify"+(o?"#"+o:"");try{return t.createPolicy(i,{createHTML:function(e){return e},createScriptURL:function(e){return e}})}catch(e){return console.warn("TrustedTypes policy "+i+" could not be created."),null}};function ie(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:oe(),n=function(e){return ie(e)};if(n.version="2.4.7",n.removed=[],!t||!t.document||9!==t.document.nodeType)return n.isSupported=!1,n;var o=t.document,i=t.document,a=t.DocumentFragment,c=t.HTMLTemplateElement,s=t.Node,l=t.Element,u=t.NodeFilter,f=t.NamedNodeMap,d=void 0===f?t.NamedNodeMap||t.MozNamedAttrMap:f,m=t.HTMLFormElement,p=t.DOMParser,y=t.trustedTypes,g=l.prototype,b=I(g,"cloneNode"),v=I(g,"nextSibling"),E=I(g,"childNodes"),O=I(g,"parentNode");if("function"==typeof c){var _=i.createElement("template");_.content&&_.content.ownerDocument&&(i=_.content.ownerDocument)}var ae=re(y,o),ce=ae?ae.createHTML(""):"",se=i,le=se.implementation,ue=se.createNodeIterator,fe=se.createDocumentFragment,de=se.getElementsByTagName,me=o.importNode,pe={};try{pe=D(i).documentMode?i.documentMode:{}}catch(e){}var he={};n.isSupported="function"==typeof O&&le&&void 0!==le.createHTMLDocument&&9!==pe;var ye,ge,be=V,ve=$,Ee=Q,Te=Z,Ae=X,Se=ee,ke=te,we=J,Ne=null,xe=R({},[].concat(r(F),r(H),r(B),r(z),r(K))),Ce=null,Le=R({},[].concat(r(W),r(G),r(q),r(Y))),Ue=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Me=null,Oe=null,_e=!0,Re=!0,De=!1,Ie=!0,Fe=!1,He=!1,Be=!1,Pe=!1,ze=!1,je=!1,Ke=!1,We=!0,Ge=!1,qe="user-content-",Ye=!0,Ve=!1,$e={},Qe=null,Ze=R({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),Xe=null,Je=R({},["audio","video","img","source","image","track"]),et=null,tt=R({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),nt="http://www.w3.org/1998/Math/MathML",ot="http://www.w3.org/2000/svg",rt="http://www.w3.org/1999/xhtml",it=rt,at=!1,ct=null,st=R({},[nt,ot,rt],w),lt=["application/xhtml+xml","text/html"],ut="text/html",ft=null,dt=i.createElement("form"),mt=function(e){return e instanceof RegExp||e instanceof Function},pt=function(t){ft&&ft===t||(t&&"object"===e(t)||(t={}),t=D(t),ye=ye=-1===lt.indexOf(t.PARSER_MEDIA_TYPE)?ut:t.PARSER_MEDIA_TYPE,ge="application/xhtml+xml"===ye?w:k,Ne="ALLOWED_TAGS"in t?R({},t.ALLOWED_TAGS,ge):xe,Ce="ALLOWED_ATTR"in t?R({},t.ALLOWED_ATTR,ge):Le,ct="ALLOWED_NAMESPACES"in t?R({},t.ALLOWED_NAMESPACES,w):st,et="ADD_URI_SAFE_ATTR"in t?R(D(tt),t.ADD_URI_SAFE_ATTR,ge):tt,Xe="ADD_DATA_URI_TAGS"in t?R(D(Je),t.ADD_DATA_URI_TAGS,ge):Je,Qe="FORBID_CONTENTS"in t?R({},t.FORBID_CONTENTS,ge):Ze,Me="FORBID_TAGS"in t?R({},t.FORBID_TAGS,ge):{},Oe="FORBID_ATTR"in t?R({},t.FORBID_ATTR,ge):{},$e="USE_PROFILES"in t&&t.USE_PROFILES,_e=!1!==t.ALLOW_ARIA_ATTR,Re=!1!==t.ALLOW_DATA_ATTR,De=t.ALLOW_UNKNOWN_PROTOCOLS||!1,Ie=!1!==t.ALLOW_SELF_CLOSE_IN_ATTR,Fe=t.SAFE_FOR_TEMPLATES||!1,He=t.WHOLE_DOCUMENT||!1,ze=t.RETURN_DOM||!1,je=t.RETURN_DOM_FRAGMENT||!1,Ke=t.RETURN_TRUSTED_TYPE||!1,Pe=t.FORCE_BODY||!1,We=!1!==t.SANITIZE_DOM,Ge=t.SANITIZE_NAMED_PROPS||!1,Ye=!1!==t.KEEP_CONTENT,Ve=t.IN_PLACE||!1,we=t.ALLOWED_URI_REGEXP||we,it=t.NAMESPACE||rt,Ue=t.CUSTOM_ELEMENT_HANDLING||{},t.CUSTOM_ELEMENT_HANDLING&&mt(t.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Ue.tagNameCheck=t.CUSTOM_ELEMENT_HANDLING.tagNameCheck),t.CUSTOM_ELEMENT_HANDLING&&mt(t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Ue.attributeNameCheck=t.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),t.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(Ue.allowCustomizedBuiltInElements=t.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Fe&&(Re=!1),je&&(ze=!0),$e&&(Ne=R({},r(K)),Ce=[],!0===$e.html&&(R(Ne,F),R(Ce,W)),!0===$e.svg&&(R(Ne,H),R(Ce,G),R(Ce,Y)),!0===$e.svgFilters&&(R(Ne,B),R(Ce,G),R(Ce,Y)),!0===$e.mathMl&&(R(Ne,z),R(Ce,q),R(Ce,Y))),t.ADD_TAGS&&(Ne===xe&&(Ne=D(Ne)),R(Ne,t.ADD_TAGS,ge)),t.ADD_ATTR&&(Ce===Le&&(Ce=D(Ce)),R(Ce,t.ADD_ATTR,ge)),t.ADD_URI_SAFE_ATTR&&R(et,t.ADD_URI_SAFE_ATTR,ge),t.FORBID_CONTENTS&&(Qe===Ze&&(Qe=D(Qe)),R(Qe,t.FORBID_CONTENTS,ge)),Ye&&(Ne["#text"]=!0),He&&R(Ne,["html","head","body"]),Ne.table&&(R(Ne,["tbody"]),delete Me.tbody),h&&h(t),ft=t)},ht=R({},["mi","mo","mn","ms","mtext"]),yt=R({},["foreignobject","desc","title","annotation-xml"]),gt=R({},["title","style","font","a","script"]),bt=R({},H);R(bt,B),R(bt,P);var vt=R({},z);R(vt,j);var Et=function(e){var t=O(e);t&&t.tagName||(t={namespaceURI:it,tagName:"template"});var n=k(e.tagName),o=k(t.tagName);return!!ct[e.namespaceURI]&&(e.namespaceURI===ot?t.namespaceURI===rt?"svg"===n:t.namespaceURI===nt?"svg"===n&&("annotation-xml"===o||ht[o]):Boolean(bt[n]):e.namespaceURI===nt?t.namespaceURI===rt?"math"===n:t.namespaceURI===ot?"math"===n&&yt[o]:Boolean(vt[n]):e.namespaceURI===rt?!(t.namespaceURI===ot&&!yt[o])&&!(t.namespaceURI===nt&&!ht[o])&&!vt[n]&&(gt[n]||!bt[n]):!("application/xhtml+xml"!==ye||!ct[e.namespaceURI]))},Tt=function(e){S(n.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){try{e.outerHTML=ce}catch(t){e.remove()}}},At=function(e,t){try{S(n.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){S(n.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e&&!Ce[e])if(ze||je)try{Tt(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}},St=function(e){var t,n;if(Pe)e="<remove></remove>"+e;else{var o=N(e,/^[\r\n\t ]+/);n=o&&o[0]}"application/xhtml+xml"===ye&&it===rt&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var r=ae?ae.createHTML(e):e;if(it===rt)try{t=(new p).parseFromString(r,ye)}catch(e){}if(!t||!t.documentElement){t=le.createDocument(it,"template",null);try{t.documentElement.innerHTML=at?ce:r}catch(e){}}var a=t.body||t.documentElement;return e&&n&&a.insertBefore(i.createTextNode(n),a.childNodes[0]||null),it===rt?de.call(t,He?"html":"body")[0]:He?t.documentElement:a},kt=function(e){return ue.call(e.ownerDocument||e,e,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT,null,!1)},wt=function(e){return e instanceof m&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||!(e.attributes instanceof d)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes)},Nt=function(t){return"object"===e(s)?t instanceof s:t&&"object"===e(t)&&"number"==typeof t.nodeType&&"string"==typeof t.nodeName},xt=function(e,t,o){he[e]&&T(he[e],(function(e){e.call(n,t,o,ft)}))},Ct=function(e){var t;if(xt("beforeSanitizeElements",e,null),wt(e))return Tt(e),!0;if(U(/[\u0080-\uFFFF]/,e.nodeName))return Tt(e),!0;var o=ge(e.nodeName);if(xt("uponSanitizeElement",e,{tagName:o,allowedTags:Ne}),e.hasChildNodes()&&!Nt(e.firstElementChild)&&(!Nt(e.content)||!Nt(e.content.firstElementChild))&&U(/<[/\w]/g,e.innerHTML)&&U(/<[/\w]/g,e.textContent))return Tt(e),!0;if("select"===o&&U(/<template/i,e.innerHTML))return Tt(e),!0;if(!Ne[o]||Me[o]){if(!Me[o]&&Ut(o)){if(Ue.tagNameCheck instanceof RegExp&&U(Ue.tagNameCheck,o))return!1;if(Ue.tagNameCheck instanceof Function&&Ue.tagNameCheck(o))return!1}if(Ye&&!Qe[o]){var r=O(e)||e.parentNode,i=E(e)||e.childNodes;if(i&&r)for(var a=i.length-1;a>=0;--a)r.insertBefore(b(i[a],!0),v(e))}return Tt(e),!0}return e instanceof l&&!Et(e)?(Tt(e),!0):"noscript"!==o&&"noembed"!==o&&"noframes"!==o||!U(/<\/no(script|embed|frames)/i,e.innerHTML)?(Fe&&3===e.nodeType&&(t=e.textContent,t=x(t,be," "),t=x(t,ve," "),t=x(t,Ee," "),e.textContent!==t&&(S(n.removed,{element:e.cloneNode()}),e.textContent=t)),xt("afterSanitizeElements",e,null),!1):(Tt(e),!0)},Lt=function(e,t,n){if(We&&("id"===t||"name"===t)&&(n in i||n in dt))return!1;if(Re&&!Oe[t]&&U(Te,t));else if(_e&&U(Ae,t));else if(!Ce[t]||Oe[t]){if(!(Ut(e)&&(Ue.tagNameCheck instanceof RegExp&&U(Ue.tagNameCheck,e)||Ue.tagNameCheck instanceof Function&&Ue.tagNameCheck(e))&&(Ue.attributeNameCheck instanceof RegExp&&U(Ue.attributeNameCheck,t)||Ue.attributeNameCheck instanceof Function&&Ue.attributeNameCheck(t))||"is"===t&&Ue.allowCustomizedBuiltInElements&&(Ue.tagNameCheck instanceof RegExp&&U(Ue.tagNameCheck,n)||Ue.tagNameCheck instanceof Function&&Ue.tagNameCheck(n))))return!1}else if(et[t]);else if(U(we,x(n,ke,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==C(n,"data:")||!Xe[e])if(De&&!U(Se,x(n,ke,"")));else if(n)return!1;return!0},Ut=function(e){return e.indexOf("-")>0},Mt=function(t){var o,r,i,a;xt("beforeSanitizeAttributes",t,null);var c=t.attributes;if(c){var s={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Ce};for(a=c.length;a--;){var l=o=c[a],u=l.name,f=l.namespaceURI;if(r="value"===u?o.value:L(o.value),i=ge(u),s.attrName=i,s.attrValue=r,s.keepAttr=!0,s.forceKeepAttr=void 0,xt("uponSanitizeAttribute",t,s),r=s.attrValue,!s.forceKeepAttr&&(At(u,t),s.keepAttr))if(Ie||!U(/\/>/i,r)){Fe&&(r=x(r,be," "),r=x(r,ve," "),r=x(r,Ee," "));var d=ge(t.nodeName);if(Lt(d,i,r)){if(!Ge||"id"!==i&&"name"!==i||(At(u,t),r=qe+r),ae&&"object"===e(y)&&"function"==typeof y.getAttributeType)if(f);else switch(y.getAttributeType(d,i)){case"TrustedHTML":r=ae.createHTML(r);break;case"TrustedScriptURL":r=ae.createScriptURL(r)}try{f?t.setAttributeNS(f,u,r):t.setAttribute(u,r),A(n.removed)}catch(e){}}}else At(u,t)}xt("afterSanitizeAttributes",t,null)}},Ot=function e(t){var n,o=kt(t);for(xt("beforeSanitizeShadowDOM",t,null);n=o.nextNode();)xt("uponSanitizeShadowNode",n,null),Ct(n)||(n.content instanceof a&&e(n.content),Mt(n));xt("afterSanitizeShadowDOM",t,null)};return n.sanitize=function(r){var i,c,l,u,f,d=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if((at=!r)&&(r="\x3c!--\x3e"),"string"!=typeof r&&!Nt(r)){if("function"!=typeof r.toString)throw M("toString is not a function");if("string"!=typeof(r=r.toString()))throw M("dirty is not a string, aborting")}if(!n.isSupported){if("object"===e(t.toStaticHTML)||"function"==typeof t.toStaticHTML){if("string"==typeof r)return t.toStaticHTML(r);if(Nt(r))return t.toStaticHTML(r.outerHTML)}return r}if(Be||pt(d),n.removed=[],"string"==typeof r&&(Ve=!1),Ve){if(r.nodeName){var m=ge(r.nodeName);if(!Ne[m]||Me[m])throw M("root node is forbidden and cannot be sanitized in-place")}}else if(r instanceof s)1===(c=(i=St("\x3c!----\x3e")).ownerDocument.importNode(r,!0)).nodeType&&"BODY"===c.nodeName||"HTML"===c.nodeName?i=c:i.appendChild(c);else{if(!ze&&!Fe&&!He&&-1===r.indexOf("<"))return ae&&Ke?ae.createHTML(r):r;if(!(i=St(r)))return ze?null:Ke?ce:""}i&&Pe&&Tt(i.firstChild);for(var p=kt(Ve?r:i);l=p.nextNode();)3===l.nodeType&&l===u||Ct(l)||(l.content instanceof a&&Ot(l.content),Mt(l),u=l);if(u=null,Ve)return r;if(ze){if(je)for(f=fe.call(i.ownerDocument);i.firstChild;)f.appendChild(i.firstChild);else f=i;return(Ce.shadowroot||Ce.shadowrootmod)&&(f=me.call(o,f,!0)),f}var h=He?i.outerHTML:i.innerHTML;return He&&Ne["!doctype"]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&U(ne,i.ownerDocument.doctype.name)&&(h="<!DOCTYPE "+i.ownerDocument.doctype.name+">\n"+h),Fe&&(h=x(h,be," "),h=x(h,ve," "),h=x(h,Ee," ")),ae&&Ke?ae.createHTML(h):h},n.setConfig=function(e){pt(e),Be=!0},n.clearConfig=function(){ft=null,Be=!1},n.isValidAttribute=function(e,t,n){ft||pt({});var o=ge(e),r=ge(t);return Lt(o,r,n)},n.addHook=function(e,t){"function"==typeof t&&(he[e]=he[e]||[],S(he[e],t))},n.removeHook=function(e){if(he[e])return A(he[e])},n.removeHooks=function(e){he[e]&&(he[e]=[])},n.removeAllHooks=function(){he={}},n}return ie()}()}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={exports:{}};return e[o].call(i.exports,i,i.exports,n),i.exports}(()=>{"use strict";function e(t,n,o){(n=n||{}).action=t,-1!==["closeTab","nextTab","previousTab","moveTab","reloadTab","setZoom","closeTabLeft","closeTabRight","focusTabByIndex"].indexOf(t)&&(n.repeats=e.repeats,e.repeats=1);try{n.needResponse=void 0!==o,chrome.runtime.sendMessage(n,o),"read"===t&&i.on("onTtsEvent",o)}catch(e){!function(e,t,n){void 0===n&&(n=document),n.dispatchEvent(new CustomEvent(`surfingkeys:${e}`,{detail:t}))}("front",["showPopup","[runtime exception] "+e])}}var t,o,r,i=(t={conf:{autoSpeakOnInlineQuery:!1,lastKeys:"",blocklistPattern:void 0,lurkingPattern:void 0,smartCase:!0,caseSensitive:!1,clickablePat:/(https?:\/\/|thunder:\/\/|magnet:)\S+/gi,clickableSelector:"",editableSelector:"div.CodeMirror-scroll,div.ace_content",cursorAtEndOfInput:!0,defaultSearchEngine:"g",defaultVoice:"Daniel",editableBodyCare:!0,enableAutoFocus:!0,enableEmojiInsertion:!1,experiment:!1,focusFirstCandidate:!1,focusOnSaved:!0,hintAlign:"center",hintExplicit:!1,hintShiftNonActive:!1,historyMUOrder:!0,language:void 0,lastQuery:"",modeAfterYank:"",nextLinkRegex:/(\b(next)\b)|下页|下一页|后页|下頁|下一頁|後頁|>>|»/i,digitForRepeat:!0,omnibarMaxResults:10,omnibarHistoryCacheSize:100,omnibarPosition:"middle",omnibarSuggestion:!0,omnibarSuggestionTimeout:200,omnibarTabsQuery:{},pageUrlRegex:[],prevLinkRegex:/(\b(prev|previous)\b)|上页|上一页|前页|上頁|上一頁|前頁|<<|«/i,richHintsForKeystroke:1e3,scrollStepSize:70,showModeStatus:!1,showProxyInStatusBar:!1,smartPageBoundary:!1,smoothScroll:!0,startToShowEmoji:2,stealFocusOnLoad:!0,tabsThreshold:100,verticalTabs:!0,textAnchorPat:/(^[\n\r\s]*\S{3,}|\b\S{4,})/g,ignoredFrameHosts:["https://tpc.googlesyndication.com"],scrollFriction:0,aceKeybindings:"vim",caretViewport:null,mouseSelectToQuery:[],useNeovim:!1,useLocalMarkdownAPI:!0}},o={},r=new Promise((function(t,n){window===top?t(window.location.href):e("getTopURL",null,(function(e){t(e.url)}))})),t.on=function(e,t){o[e]=t},t.updateHistory=function(t,n){var o=t+"History";e("getSettings",{key:o},(function(t){var r=t.settings[o]||[],i={};"Array"===n.constructor.name?(i[o]=n,e("updateSettings",{settings:i})):n.trim().length&&"."!==n&&((r=r.filter((function(e){return e.trim().length&&e!==n&&"."!==e}))).unshift(n),r.length>50&&r.pop(),i[o]=r,e("updateSettings",{settings:i}))}))},chrome.runtime.onMessage.addListener((function(e,t,n){o[e.subject]&&o[e.subject](e,t,n)})),t.getTopURL=function(e){r.then((function(t){e(t)}))},t.postTopMessage=function(e){r.then((function(t){window===top&&(t=window.location.origin),"null"!==t&&"file://"!==new URL(t).origin||(t="*"),top.postMessage({surfingkeys_uihost_data:e},t)}))},t.getCaseSensitive=function(e){return t.conf.caseSensitive||t.conf.smartCase&&/[A-Z]/.test(e)},t),a=n(234);const c={keyCodesMac:{Minus:["-","_"],Equal:["=","+"],BracketLeft:["[","{"],BracketRight:["]","}"],Backslash:["\\","|"],Semicolon:[";",":"],Quote:["'",'"'],Comma:[",","<"],Period:[".",">"],Slash:["/","?"]},keyCodes:{ESC:27,backspace:8,deleteKey:46,enter:13,ctrlEnter:10,space:32,shiftKey:16,ctrlKey:17,f1:112,f12:123,comma:188,tab:9,downArrow:40,upArrow:38},modifierKeys:{16:"Shift",17:"Ctrl",18:"Alt",91:"Meta",92:"Meta",93:"ContextMenu",229:"Process"},keyNames:{8:"Backspace",9:"Tab",12:"NumLock",27:"Esc",32:"Space",46:"Delete"},keyIdentifierCorrectionMap:{"U+00C0":["U+0060","U+007E"],"U+0030":["U+0030","U+0029"],"U+0031":["U+0031","U+0021"],"U+0032":["U+0032","U+0040"],"U+0033":["U+0033","U+0023"],"U+0034":["U+0034","U+0024"],"U+0035":["U+0035","U+0025"],"U+0036":["U+0036","U+005E"],"U+0037":["U+0037","U+0026"],"U+0038":["U+0038","U+002A"],"U+0039":["U+0039","U+0028"],"U+00BD":["U+002D","U+005F"],"U+00BB":["U+003D","U+002B"],"U+00DB":["U+005B","U+007B"],"U+00DD":["U+005D","U+007D"],"U+00DC":["U+005C","U+007C"],"U+00BA":["U+003B","U+003A"],"U+00DE":["U+0027","U+0022"],"U+00BC":["U+002C","U+003C"],"U+00BE":["U+002E","U+003E"],"U+00BF":["U+002F","U+003F"]}};var s="Windows";function l(e,t){var n,o=0;return-1!==e.indexOf("Ctrl-")&&(o|=1),-1!==e.indexOf("Alt-")&&(o|=2),-1!==e.indexOf("Meta-")&&(o|=4),-1!==e.indexOf("Shift-")&&(o|=8),n=8192+((n=t.length>1?256+c.specialKeys.indexOf(t):t.charCodeAt(0))<<4)+o,String.fromCharCode(n)}"undefined"!=typeof navigator&&(-1!==navigator.platform.indexOf("Mac")?s="Mac":-1!==navigator.userAgent.indexOf("Linux")&&(s="Linux")),c.getKeyChar=function(e){var t;if(e.keyCode in this.modifierKeys)t="";else{if(this.keyNames.hasOwnProperty(e.keyCode))t="{0}".format(this.keyNames[e.keyCode]);else if(t=e.key||"",-1!==["Shift","Meta","Alt","Ctrl"].indexOf(t)&&(t=""),t)t.charCodeAt(0)>127||"Dead"===t?e.keyCode<127?(t=String.fromCharCode(e.keyCode),t=e.shiftKey?t:t.toLowerCase()):this.keyCodesMac.hasOwnProperty(e.code)&&(t=this.keyCodesMac[e.code][e.shiftKey?1:0]):"Unidentified"===t&&(t="");else if(e.keyIdentifier)if("U+"!==e.keyIdentifier.slice(0,2))t="{0}".format(e.keyIdentifier);else{var n=e.keyIdentifier;if(("Windows"===s||"Linux"===s)&&this.keyIdentifierCorrectionMap[n]){var o=this.keyIdentifierCorrectionMap[n];n=e.shiftKey?o[1]:o[0]}var r="0x"+n.substring(2);t=String.fromCharCode(parseInt(r)),t=e.shiftKey?t:t.toLowerCase()}e.shiftKey&&t.length>1&&(t="Shift-"+t),t.length>0&&(e.metaKey&&(t="Meta-"+t),e.altKey&&(t="Alt-"+t),e.ctrlKey&&(t="Ctrl-"+t)),t.length>1&&(t="<{0}>".format(t))}return c.decodeKeystroke(c.encodeKeystroke(t))===t&&(t=c.encodeKeystroke(t)),t},c.isWordChar=function(e){return e.keyCode<123&&e.keyCode>=97||e.keyCode<91&&e.keyCode>=65||e.keyCode<58&&e.keyCode>=48},c.encodeKeystroke=function(e){for(var t,n=/<(?:Ctrl-)?(?:Alt-)?(?:Meta-)?(?:Shift-)?([^>]+|.)>/g,o="",r=0;null!==(t=n.exec(e));)o+=e.substr(r,t.index-r),o+=l(t[0],t[1]),r=n.lastIndex;return o+=e.substr(r)},c.specialKeys=["Esc","Space","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Backspace","Enter","Tab","Delete","End","Home","Insert","NumLock","PageDown","PageUp","Pause","ScrollLock","CapsLock","PrintScreen","Escape","Hyper"],c.decodeKeystroke=function(e){for(var t="",n=0;n<e.length;n++){var o=e[n].charCodeAt(0);if(o>8192){var r=(o-=8192)%4096>>4,i=15&o;o=o>>12?c.specialKeys[r%256]:String.fromCharCode(r),8&i&&(o="Shift-"+o),4&i&&(o="Meta-"+o),2&i&&(o="Alt-"+o),1&i&&(o="Ctrl-"+o),t+="<"+o+">"}else t+=e[n]}return t};document.createRange();function u(e,t){e.innerHTML=a.sanitize(t)}document.addEventListener("mousedown",(e=>{[e.clientX,e.clientY]})),DOMRect.prototype.has=function(e,t,n,o){return t>this.top-o&&t<this.bottom+o&&e>this.left-n&&e<this.right+n},String.prototype.format=function(){for(var e=this,t=0;t<arguments.length;t++){var n=new RegExp("\\{"+t+"\\}","gi");e=e.replace(n,arguments[t])}return e},String.prototype.reverse=function(){return this.split("").reverse().join("")},RegExp.prototype.toJSON=function(){return{source:this.source,flags:this.flags}},Array.prototype.flatMap||(Array.prototype.flatMap=function(e){return Array.prototype.concat.apply([],this.map(e))});document.createElement("div");HTMLElement.prototype.one=function(e,t){this.addEventListener(e,(function n(){t.call(this),this.removeEventListener(e,n)}))},HTMLElement.prototype.show=function(){this.style.display=""},HTMLElement.prototype.hide=function(){this.style.display="none"},HTMLElement.prototype.removeAttributes=function(){for(;this.attributes.length>0;)this.removeAttribute(this.attributes[0].name)},HTMLElement.prototype.containsWithShadow=function(e){const t=[this];for(;t.length;){const n=t.shift();if(n.contains(e))return!0;if(t.push(...n.children),n.shadowRoot){if(n.shadowRoot.contains(e))return!0;t.push(...n.shadowRoot.children)}}return!1},NodeList.prototype.remove=function(){this.forEach((function(e){e.remove()}))},NodeList.prototype.show=function(){this.forEach((function(e){e.show()}))},NodeList.prototype.hide=function(){this.forEach((function(e){e.hide()}))};!function(e,t,n){var o=document.createElement(e);if(t&&u(o,t),n)for(var r in n)o.setAttribute(r,n[r])}("div","",{style:"position: fixed; box-shadow: 0px 0px 4px 2px #63b2ff; background: transparent; z-index: 2140000000"});document.addEventListener("surfingkeys:defaultSettingsLoaded",(function(t){const{normal:n,api:o}=t.detail;new Promise(((e,t)=>{import("./neovim_lib.js").then((t=>{t.default().then((({nvim:t,destroy:o})=>{function r(e){const[t,o]=e;"Enter"===t&&(o.length?n.feedkeys(o[0]):(document.body.classList.add("neovim-disabled"),n.enter()))}t.on("nvim:open",(()=>{t.input("<Esc>"),t.on("surfingkeys:rpc",r)})),t.on("nvim:close",(()=>{window.close()})),e(t)}))}))})).then((t=>{e("connectNative",{mode:"standalone"},(e=>{e.error?(u(document.querySelector("#overlay"),e.error),document.body.classList.add("neovim-disabled")):(n.exit(),o.mapkey("<Alt-i>","",(function(){document.body.classList.remove("neovim-disabled"),n.exit()})),o.map("i","<Alt-i>"),t.connect(e.url))}))}))}))})()})();