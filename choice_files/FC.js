(function(){
	/** @id _FC */
	var _FC = (function(){
		// create private static attributes and methods here
		var _isIE = /*@cc_on!@*/ false;
		var _isLteIE7 = /*@cc_on @*/ /*@if (@_jscript_version <= 5.7) true; /*@end @*/ false;
		var _name = 'FC JavaScript Library.\n\n\u00A9 2009 Fortune Cookie UK'
		
		return function(){
		// create private privileged properties and methods with 'this.'
		// create private private properties and methods with 'var' and 'function'
			/** @id hasIE */
			this.hasIE = (function () { return _isIE; })();
			/** @id hasLteIE7 */
			this.hasLteIE7 = (function () {return _isLteIE7})();
			/** @id FC */
			this.FC = (function(){return _name})();
			
			/** @id showChildren */
			this.showChildren = function (el) {
				var __str = "";
			
				for (var __j in el) if (el.hasOwnProperty(__j)){
					__str += __j +" = "+ el[__j] + ", "
				}
			
				alert(__str);
			};
			
			/** @id commonEventObject */
			this.commonEventObject = function (e) {
				var __t;
					
				if (e.target) {
					__t = e.target;
				} else if (e.srcElement) {
					 __t = e.srcElement;
				}
				
				if (__t.nodeType == 3) {// defeat Safari bug
					__t = __t.parentNode;
				}
				
				return __t;
			};		
			
			/** @id stopReturn */
			this.stopReturn = function (e) {
				if (!e) {
					e = window.event;
				}
				(e.stopPropagation) ? e.stopPropagation() : e.cancelBubble = true;
				(e.preventDefault) ? e.preventDefault() : e.returnValue = false;
				return false;
			};
			
			/** @id clearTextNodes */
			this.clearTextNodes = function (n) {
				var __j = n.length;
				while (__j--) if (n[__j].nodeType == 3) {
					n.removeChild(n[__j]);
				}
				return n;
			};
			
			/** @id clearNodes */	
			this.clearNodes = function (n) {
				while (n.firstChild) {
					n.removeChild(n.firstChild)
				}
				return n;
			};
			
			/** @id toDecimalString */
			this.toDecimalString = function (val) {
				__val = Number(val);
				return ((__val * 100) % 100) ? __val.toString() : __val + ".00";
			};
			
			/** @id getStyle */
			this.getStyle = function(el,styleProp) {
				var x = document.getElementById(el), y;
				if (x.currentStyle)
					y = x.currentStyle[styleProp];
				else if (window.getComputedStyle)
					y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
				return y;
			};
			
			/** @id getElementsByClassName */
			this.getElementsByClassName = function(cl) {
				var retnode = [], myclass = /'\\b' + cl + '\\b'/, elem = document.getElementsByTagName('*');
				var i = elem.length;
				while (i--) {
					if (myclass.test(elem[i].className)) retnode.push(elem[i]);
				}
				return (!retnode.length) ? null : retnode;
			};
			
			/** @id addEvent */	
			this.addEvent = function(obj, evt, fn){
				if (obj.addEventListener) 
					obj.addEventListener(evt, fn, false);
				else 
					if (obj.attachEvent) 
						obj.attachEvent('on' + evt, fn);
				
				if (obj.getAttribute) {
					if (obj.getAttribute('href')) {
						obj.onclick = function(){
							return false
						}
					} else if (obj.getAttribute('href') && !obj.getAttribute('onclick')) {
						var func = obj.onclick;
						obj.onclick = function(){
							func();
							return false;
						}
					}
				}	
			};
			
			/** @id removeEvent */
			this.removeEvent = function(obj, type, fn) {
				if (obj.removeEventListener)
					obj.removeEventListener(type,fn,false);
				else if (obj.detachEvent)
					obj.detachEvent('on'+type,fn);
			};
			
			/** @id toggle */
			this.toggle = function(el) {
				el.style.display = (el.style.display == 'none') ? 'block' : 'none';
			};
			
			/** @id setJS */
			this.setJS = function () {
				document.body.className = (document.body.className) ? document.body.className + " js" : "js";
			};
			
			/** @id checkChange */
			this.checkChange = function(str, o){ // receives a unique identifier (ie: an id) and an Object literal
				(o[str]) ? delete o[str] : o[str] = true;
				
				for (var __j in o) if (o.hasOwnProperty(__j)) {return true}
				
				return false;
			};
			
			/** @id beforeUnload */
			this.beforeUnload = function (str) {
				window.onbeforeunload = (str) ? function (e) {
					if (e) {
						e.returnValue = str; // required for FF
					}
					return str;
				} : null ;
			};
			
			/** @id pngFix */
			this.pngFix = function(img){
				if (!this.hasLteIE7) {
					return false;
				} else {
					/*@cc_on
						var clear = img; // path to clear.gif
						@if (@_jscript_version >= 5.5 && @_jscript_version < 5.7)
							var els=document.body.getElementsByTagName("*");var ip=/\.png/i;var i=els.length;while(i--){var el=els[i];var es=el.style;if(el.src&&el.src.match(ip)&&!es.filter){es.height=el.height;es.width=el.width;es.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+el.src+"',sizingMethod='crop')";el.src=clear}else{var elb=el.currentStyle.backgroundImage;if(elb.match(ip)){var path=elb.split('"');var rep=(el.currentStyle.backgroundRepeat=="no-repeat")?"crop":"scale";es.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+path[1]+"',sizingMethod='"+rep+"')";es.height=el.clientHeight+"px";es.backgroundImage="none";}}}
						@end
					@*/			
				}
			};
			
			/** @id flickerFix **/
			this.flickerFix = function(){
				if (!this.hasLteIE7) {
					return false;
				} else {
					/*@cc_on 
						@if (@_win32)
							try {document.execCommand('BackgroundImageCache', false, true);}catch(e){}
						@end
					@*/		
				}
			};
			
		};
	})();
	
	window.FC = new _FC();
	
	// create public privileged static properties and methods with 
	/*  
		_FC.functionName = function (val) {
		}
	*/
	
//	_FC.vars = {}; // priviliged runtime properties with access to FC private content go here
//	_FC.functions = {}; // priviliged runtime methods with access to FC private content go here
	
	// create public non-privileged properties (like jQuery) and methods with 
	
	/*
	
		_FC.prototype = {
			functionName : function () {}
		}
		
	*/
})();
