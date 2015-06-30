/**
 * Functions to handle the Primary Navigation drop-downs
 */
 
jQuery().ready(function(){
	
	$(".navigation > ul > li")
	.not(".drop-down UL LI")
	.each(function(a) {
		// Store the elements background-color so that we can recall it later
	    $(this).data('background-color', $(this).children('a').css('background-color'));
	})
	.bind('mouseenter focusin', function(e){
		var self = this;
		var classtext = "";
		classtext = $(this).children("div").attr('class');
		if (classtext != undefined){
			if (classtext.indexOf('drop-down') == 0){
				// Set the element data flag to signify that the user is hovering
				$(self).data('hovering', true);
				// Set the element colors to a mouseover state - no idea why CSS is not used here
				$(self).children('a').css({'background': 'none repeat scroll 0 0 #efefef','color': '#333'});
				
				setTimeout(function(){
					// If the user is no longer hovering then don't show the drop down
					if ($(self).data('hovering') === false){
						return;
					}
				    $(".extra-content-area").hide();
				    $("div.existingCustomerArea").hide();

				    // We need to make sure the first (n)<=6 columns are equal heights to ensure correct wrapping
				    var n = $(self).find('.drop-down').attr("class").match(/cols-(.*)/)[1];
					
					//$(self).find('.drop-down >ul >li:lt('+(n>6?6:n)+')').equalHeights();
					
				    if(n<=6){$(self).find('.drop-down >ul >li').equalHeights();}
					else{
						var rowcols = 6; // default value
						
						if($(self).find('.drop-down > ul').attr("class").match(/eachrow-(.*)/) != null){
							rowcols = $(self).find('.drop-down > ul').attr("class").match(/eachrow-(.*)/)[1];
						}

						var nmode = Math.ceil(n/rowcols);
						
						for(xx=1; xx<=nmode; xx++){
							if(xx == 1){
								// first li is on index 0 and we cannot use gt(-1), so we just use lt here.
								$(self).find('.drop-down >ul >li:lt('+rowcols+')').equalHeights();
							}
							else{
								// gt determines the first element of the row, and lt determines the number of li on which we are applying the change
								$(self).find('.drop-down > ul > li:gt('+(((xx-1)*rowcols)-1)+'):lt('+rowcols+')').equalHeights();
							}
						}
					}
				    
				    // Show the drop down
					$(self).children('.drop-down').stop(true,true).slideDown("fast"); 
				}, 500); // 500ms delay before opening drop-down
			}
		}
	})
	.bind('mouseleave focusout' ,function(e){
		var self = this;
		var classtext = "";
		classtext = $(this).children("div").attr('class'); 
		if (classtext != undefined){
			if (classtext.indexOf('drop-down') == 0){
				setTimeout(function(){
					// If the activeElement has a parent of class .drop-down then don't close the flyout - assume we are tabbing through the children
					if ($(document.activeElement).parents('.drop-down').length == 0 || e.type == "mouseleave"){
						// Set the element data flag to signify that the user is no longer hovering
						$(self).data('hovering', false);
						// Restore the background color
						$(self).children('a').css({'background-color': $(self).data('background-color'), 'color': '#fff'});
						// Hide the drop-down
						$(self).children('.drop-down').stop(true,true).slideUp("fast"); 
					}
				}, 50);
			}
		}
	});
});

/*Mega flyout function*/
FC.dropdown = function(){
	$(".close-menu, a.close-alt, .close-flyout").remove(); // Cleans up any close-menu links that may have been missed.
};

/* This function handles the  main page rollover */
FC.feature = function(){
	$(".default").addClass("selected");
	var opts = $(".landing-feature .options>ul>li");
	// Handle the bindings
	opts
	.append("<div class='option-indicator'></div>") 	// Inject the option indicator
	.bind("mouseenter focusin",	function(){
		var self 	= this;
		var el 		= $("div."+ $(this).find("a").attr("class"));
		$(this).data('hovering', true);
		/* 
		 * If the panel exists elsewhere in our document we need to append it 
		 * to this element for the sake of mouseover and tabbing 
		 */
		if ( el.parent().attr("class").indexOf('info') == 0){ 
			el.appendTo(this);
		} 

		setTimeout(function(){
			// If the user is no longer hovering then don't show the fly out
			if ($(self).data('hovering') === false){
				return;
			}
			el.css({"left":"272px"}).addClass("selected");
			$(self).addClass("selected");		
		},500);
	})
	.bind('mouseleave focusout', function(e){
		var self = this;
		setTimeout(function(){
			// If the active element is within the container then we don't hide  
			if ($(document.activeElement).parents('.info-panel').length == 0 || e.type == "mouseleave"){
				$(self).data('hovering', false);
				$(self).find('.info-panel.selected').css({"left":"-40000px"}).removeClass("selected");
				$(self).removeClass("selected");
				$(".info .default").css({"left":"0", "display":"block"});
			} 
		}, 50);
	});
};

/* Creates the alternative area drop downs (quote and apply / client servicing etc)
 * Resizes the width of the dropdown based on the current selection
 * */
FC.extraContent = function(){

	/* 
	 * Since we have changed the HTML structure using JS - moved alt-area to solve DDA issues
	 * We need to change the position of the extra content dropdown.
	*/
	var extraContentCount = $('DIV.navigation [id^="extra-content"]').size(); // 1 or 2
	if (extraContentCount == 2){
		rightPosTemp = -1 - $('.navigation #extra-content-2').width();
		$('#alt-area-1').css({"right":rightPosTemp+"px"});
	}
	
	$('DIV.navigation [id^="extra-content"]')
	.bind('mouseenter focusin', function(e){
		var self = this;
		// Set the element data flag to signify that the user is hovering
		$(self).data('hovering', true);
		$(this).children("a").css({"background":"#000"});
		
		/* If the alt-area is not contained within the parent div we must move it.
		 * Moving it into the container enables us to handle mouse leave events correctly and solves DDA tabbing issues
		 */
		var selection 	= $(this).attr("id");
		var targetArea 	= "alt-area-"+Right(selection,1);
		if ($("div#"+targetArea).parent().attr('id') != $(this).attr('id')){
			$("div#"+targetArea).appendTo(this);
			$(this).data('firstRun', true);
		}

		setTimeout(function(){
			// If the user is no longer hovering then don't show the drop down
			if ($(self).data('hovering') === false || $(self).data('selecting') === true){
				return;
			}
			
			$("div#"+targetArea).show();
			$(window).resize(function(){resizeContainer($("div#"+targetArea));}); //Instead of calling this function on every focus, just call it when the browser is resized.
			
			/* Adjust the content areas depending on the selection */
			if ($(self).data('firstRun') === true) {
				hideShowColumns($(self).find(".extra-content-area form select option:selected"));
				$(self).data('firstRun', false);
			}
			// Prevent the SELECT element from firing a mouseleave
			$(self).find("select").unbind("click").bind("click", function(){
				$(self).data('selecting', $(self).data('selecting')?false:true); // Toggle - true if dropdown is open, false if closed
				// In IE the change event is not fired properly so we do it here
				if ($.browser.msie){
					$(self).find(".extra-content-area form select").trigger("change");
				}
			});
			
			$(self).find("select").focusout(function(x){
				x.stopPropagation();
			});
			
		}, 500);
	})
	.bind('mouseleave focusout' ,function(e){
		var self = this;
		if ($(this).data('selecting') != true){
			$(this).data('hovering', false);
			setTimeout(function(){
				// If the active element is within the container then we don't hide
				if ($(document.activeElement).parents('.extra-content-area').length == 0 || e.type == "mouseleave"){
					$(self).find('.extra-content-area').hide();
				}
			}, 50);
			$(".navigation ul li.alt>a").css({"background":"#333"});
		}
	});
	
	// This is fired when a user changes the selected option on a extra content area (quote and apply etc)
	$(".extra-content-area form select").change(function(){  	    	   
		hideShowColumns(this);    
	});

	/* Hide/Show columns depending on drop down selection */
	function hideShowColumns(element){
		if (element.length == 0) return;
		var selection = $(element).val();
		var parent = $(element).parents(".extra-content-area");
	    if (selection != '') { 
	    	parent.find(".col").hide();
	    	parent.find(".extra-content-footer ul").removeClass("cols-4 cols-3 cols-2").css({'width':'160px'});
	    	parent.css({'width':'350px'});
			parent.find(".extra-content-footer ul li.left").removeClass('left').addClass('leftTemp');
			parent.find(".extra-content-footer ul li.right").removeClass('right').addClass('rightTemp');
	    	parent.find("form select").val(selection);
	    	parent.find("."+selection).show();        	 
	    } else {
	        parent.css({'width':'826px'});
	        parent.find(".extra-content-footer ul").css({'width':'100%'}).addClass("cols-4");
			
			parent.find(".extra-content-footer ul li.leftTemp").removeClass('leftTemp').addClass('left');
			parent.find(".extra-content-footer ul li.rightTemp").removeClass('rightTemp').addClass('right');
	    	parent.find(".col").show();
	    } 
		/* ensure the container fits within the window */
		resizeContainer(parent);
	};

	/* Adjusts the height of the container so that it always fits within the viewport */
	function resizeContainer(element){
		if (element.length == 0) return;
		try {
			$(element).css({'overflow':'visible'});
			$(element).css('height', 'auto');
			
			var elementOffset 	= $(element).offset();
			var elementHeight 	= $(element).outerHeight();
			var realHeight		= elementHeight + elementOffset.top;
			var diff 			= $(window).height() - realHeight;
			
			if (diff < 0){
				var newHeight = realHeight + (diff) - 200;
				$(element).css('height', newHeight+"px");//, 'width':$(element).css('width')+20});
			} else {
				$(element).css('height', 'auto');
			}
			$(element).css({'overflow':'auto'});
		} catch (e){}
	};
};



	/* This function will enable keyboard users to have proper focus on elements
	 * When the mouse is clicked the focus "class" is removed
	 * Added by Tim Fisher
	 */
	(function(){
		var isFocus = false;
		
		$(document).keydown(function(e){
			var keyCode = e.keyCode ? e.keyCode : e.which;
			if(keyCode == 9 && isFocus == false){
				/* Apply the style to all focus elements */
				$('a, input, img, button').toggleClass('focusOutline');
				isFocus = true;
			}
		});
		
		$(document).click(function(e){
			if (isFocus){
				/* Remove the style from all focus elements */
				$('a, input, img, button').toggleClass('focusOutline');
				isFocus = false;
			}
		})
		
	})();



/*
 * jquery.qtip. The jQuery tooltip plugin
 *
 * Copyright (c) 2009 Craig Thompson
 * http://craigsworks.com
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Launch  : February 2009
 * Version : 1.0.0-rc3
 * Released: Tuesday 12th May, 2009 - 00:00
 * Debug: jquery.qtip.debug.js
 */
(function(f){f.fn.qtip=function(B,u){var y,t,A,s,x,w,v,z;if(typeof B=="string"){if(typeof f(this).data("qtip")!=="object"){f.fn.qtip.log.error.call(self,1,f.fn.qtip.constants.NO_TOOLTIP_PRESENT,false)}if(B=="api"){return f(this).data("qtip").interfaces[f(this).data("qtip").current]}else{if(B=="interfaces"){return f(this).data("qtip").interfaces}}}else{if(!B){B={}}if(typeof B.content!=="object"||(B.content.jquery&&B.content.length>0)){B.content={text:B.content}}if(typeof B.content.title!=="object"){B.content.title={text:B.content.title}}if(typeof B.position!=="object"){B.position={corner:B.position}}if(typeof B.position.corner!=="object"){B.position.corner={target:B.position.corner,tooltip:B.position.corner}}if(typeof B.show!=="object"){B.show={when:B.show}}if(typeof B.show.when!=="object"){B.show.when={event:B.show.when}}if(typeof B.show.effect!=="object"){B.show.effect={type:B.show.effect}}if(typeof B.hide!=="object"){B.hide={when:B.hide}}if(typeof B.hide.when!=="object"){B.hide.when={event:B.hide.when}}if(typeof B.hide.effect!=="object"){B.hide.effect={type:B.hide.effect}}if(typeof B.style!=="object"){B.style={name:B.style}}B.style=c(B.style);s=f.extend(true,{},f.fn.qtip.defaults,B);s.style=a.call({options:s},s.style);s.user=f.extend(true,{},B)}return f(this).each(function(){if(typeof B=="string"){w=B.toLowerCase();A=f(this).qtip("interfaces");if(typeof A=="object"){if(u===true&&w=="destroy"){while(A.length>0){A[A.length-1].destroy()}}else{if(u!==true){A=[f(this).qtip("api")]}for(y=0;y<A.length;y++){if(w=="destroy"){A[y].destroy()}else{if(A[y].status.rendered===true){if(w=="show"){A[y].show()}else{if(w=="hide"){A[y].hide()}else{if(w=="focus"){A[y].focus()}else{if(w=="disable"){A[y].disable(true)}else{if(w=="enable"){A[y].disable(false)}}}}}}}}}}}else{v=f.extend(true,{},s);v.hide.effect.length=s.hide.effect.length;v.show.effect.length=s.show.effect.length;if(v.position.container===false){v.position.container=f(document.body)}if(v.position.target===false){v.position.target=f(this)}if(v.show.when.target===false){v.show.when.target=f(this)}if(v.hide.when.target===false){v.hide.when.target=f(this)}t=f.fn.qtip.interfaces.length;for(y=0;y<t;y++){if(typeof f.fn.qtip.interfaces[y]=="undefined"){t=y;break}}x=new d(f(this),v,t);f.fn.qtip.interfaces[t]=x;if(typeof f(this).data("qtip")=="object"){if(typeof f(this).attr("qtip")==="undefined"){f(this).data("qtip").current=f(this).data("qtip").interfaces.length}f(this).data("qtip").interfaces.push(x)}else{f(this).data("qtip",{current:0,interfaces:[x]})}if(v.content.prerender===false&&v.show.when.event!==false&&v.show.ready!==true){v.show.when.target.bind(v.show.when.event+".qtip-"+t+"-create",{qtip:t},function(C){z=f.fn.qtip.interfaces[C.data.qtip];z.options.show.when.target.unbind(z.options.show.when.event+".qtip-"+C.data.qtip+"-create");z.cache.mouse={x:C.pageX,y:C.pageY};p.call(z);z.options.show.when.target.trigger(z.options.show.when.event)})}else{x.cache.mouse={x:v.show.when.target.offset().left,y:v.show.when.target.offset().top};p.call(x)}}})};function d(u,t,v){var s=this;s.id=v;s.options=t;s.status={animated:false,rendered:false,disabled:false,focused:false};s.elements={target:u.addClass(s.options.style.classes.target),tooltip:null,wrapper:null,content:null,contentWrapper:null,title:null,button:null,tip:null,bgiframe:null};s.cache={mouse:{},position:{},toggle:0};s.timers={};f.extend(s,s.options.api,{show:function(y){var x,z;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"show")}if(s.elements.tooltip.css("display")!=="none"){return s}s.elements.tooltip.stop(true,false);x=s.beforeShow.call(s,y);if(x===false){return s}function w(){if(s.options.position.type!=="static"){s.focus()}s.onShow.call(s,y);if(f.browser.msie){s.elements.tooltip.get(0).style.removeAttribute("filter")}}s.cache.toggle=1;if(s.options.position.type!=="static"){s.updatePosition(y,(s.options.show.effect.length>0))}if(typeof s.options.show.solo=="object"){z=f(s.options.show.solo)}else{if(s.options.show.solo===true){z=f("div.qtip").not(s.elements.tooltip)}}if(z){z.each(function(){if(f(this).qtip("api").status.rendered===true){f(this).qtip("api").hide()}})}if(typeof s.options.show.effect.type=="function"){s.options.show.effect.type.call(s.elements.tooltip,s.options.show.effect.length);s.elements.tooltip.queue(function(){w();f(this).dequeue()})}else{switch(s.options.show.effect.type.toLowerCase()){case"fade":s.elements.tooltip.fadeIn(s.options.show.effect.length,w);break;case"slide":s.elements.tooltip.slideDown(s.options.show.effect.length,function(){w();if(s.options.position.type!=="static"){s.updatePosition(y,true)}});break;case"grow":s.elements.tooltip.show(s.options.show.effect.length,w);break;default:s.elements.tooltip.show(null,w);break}s.elements.tooltip.addClass(s.options.style.classes.active)}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_SHOWN,"show")},hide:function(y){var x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"hide")}else{if(s.elements.tooltip.css("display")==="none"){return s}}clearTimeout(s.timers.show);s.elements.tooltip.stop(true,false);x=s.beforeHide.call(s,y);if(x===false){return s}function w(){s.onHide.call(s,y)}s.cache.toggle=0;if(typeof s.options.hide.effect.type=="function"){s.options.hide.effect.type.call(s.elements.tooltip,s.options.hide.effect.length);s.elements.tooltip.queue(function(){w();f(this).dequeue()})}else{switch(s.options.hide.effect.type.toLowerCase()){case"fade":s.elements.tooltip.fadeOut(s.options.hide.effect.length,w);break;case"slide":s.elements.tooltip.slideUp(s.options.hide.effect.length,w);break;case"grow":s.elements.tooltip.hide(s.options.hide.effect.length,w);break;default:s.elements.tooltip.hide(null,w);break}s.elements.tooltip.removeClass(s.options.style.classes.active)}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_HIDDEN,"hide")},updatePosition:function(w,x){var C,G,L,J,H,E,y,I,B,D,K,A,F,z;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updatePosition")}else{if(s.options.position.type=="static"){return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.CANNOT_POSITION_STATIC,"updatePosition")}}G={position:{left:0,top:0},dimensions:{height:0,width:0},corner:s.options.position.corner.target};L={position:s.getPosition(),dimensions:s.getDimensions(),corner:s.options.position.corner.tooltip};if(s.options.position.target!=="mouse"){if(s.options.position.target.get(0).nodeName.toLowerCase()=="area"){J=s.options.position.target.attr("coords").split(",");for(C=0;C<J.length;C++){J[C]=parseInt(J[C])}H=s.options.position.target.parent("map").attr("name");E=f('img[usemap="#'+H+'"]:first').offset();G.position={left:Math.floor(E.left+J[0]),top:Math.floor(E.top+J[1])};switch(s.options.position.target.attr("shape").toLowerCase()){case"rect":G.dimensions={width:Math.ceil(Math.abs(J[2]-J[0])),height:Math.ceil(Math.abs(J[3]-J[1]))};break;case"circle":G.dimensions={width:J[2]+1,height:J[2]+1};break;case"poly":G.dimensions={width:J[0],height:J[1]};for(C=0;C<J.length;C++){if(C%2==0){if(J[C]>G.dimensions.width){G.dimensions.width=J[C]}if(J[C]<J[0]){G.position.left=Math.floor(E.left+J[C])}}else{if(J[C]>G.dimensions.height){G.dimensions.height=J[C]}if(J[C]<J[1]){G.position.top=Math.floor(E.top+J[C])}}}G.dimensions.width=G.dimensions.width-(G.position.left-E.left);G.dimensions.height=G.dimensions.height-(G.position.top-E.top);break;default:return f.fn.qtip.log.error.call(s,4,f.fn.qtip.constants.INVALID_AREA_SHAPE,"updatePosition");break}G.dimensions.width-=2;G.dimensions.height-=2}else{if(s.options.position.target.add(document.body).length===1){G.position={left:f(document).scrollLeft(),top:f(document).scrollTop()};G.dimensions={height:f(window).height(),width:f(window).width()}}else{if(typeof s.options.position.target.attr("qtip")!=="undefined"){G.position=s.options.position.target.qtip("api").cache.position}else{G.position=s.options.position.target.offset()}G.dimensions={height:s.options.position.target.outerHeight(),width:s.options.position.target.outerWidth()}}}y=f.extend({},G.position);if(G.corner.search(/right/i)!==-1){y.left+=G.dimensions.width}if(G.corner.search(/bottom/i)!==-1){y.top+=G.dimensions.height}if(G.corner.search(/((top|bottom)Middle)|center/)!==-1){y.left+=(G.dimensions.width/2)}if(G.corner.search(/((left|right)Middle)|center/)!==-1){y.top+=(G.dimensions.height/2)}}else{G.position=y={left:s.cache.mouse.x,top:s.cache.mouse.y};G.dimensions={height:1,width:1}}if(L.corner.search(/right/i)!==-1){y.left-=L.dimensions.width}if(L.corner.search(/bottom/i)!==-1){y.top-=L.dimensions.height}if(L.corner.search(/((top|bottom)Middle)|center/)!==-1){y.left-=(L.dimensions.width/2)}if(L.corner.search(/((left|right)Middle)|center/)!==-1){y.top-=(L.dimensions.height/2)}I=(f.browser.msie)?1:0;B=(f.browser.msie&&parseInt(f.browser.version.charAt(0))===6)?1:0;if(s.options.style.border.radius>0){if(L.corner.search(/Left/)!==-1){y.left-=s.options.style.border.radius}else{if(L.corner.search(/Right/)!==-1){y.left+=s.options.style.border.radius}}if(L.corner.search(/Top/)!==-1){y.top-=s.options.style.border.radius}else{if(L.corner.search(/Bottom/)!==-1){y.top+=s.options.style.border.radius}}}if(I){if(L.corner.search(/top/)!==-1){y.top-=I}else{if(L.corner.search(/bottom/)!==-1){y.top+=I}}if(L.corner.search(/left/)!==-1){y.left-=I}else{if(L.corner.search(/right/)!==-1){y.left+=I}}if(L.corner.search(/leftMiddle|rightMiddle/)!==-1){y.top-=1}}if(s.options.position.adjust.screen===true){y=o.call(s,y,G,L)}if(s.options.position.target==="mouse"&&s.options.position.adjust.mouse===true){if(s.options.position.adjust.screen===true&&s.elements.tip){K=s.elements.tip.attr("rel")}else{K=s.options.position.corner.tooltip}y.left+=(K.search(/right/i)!==-1)?-6:6;y.top+=(K.search(/bottom/i)!==-1)?-6:6}if(!s.elements.bgiframe&&f.browser.msie&&parseInt(f.browser.version.charAt(0))==6){f("select, object").each(function(){A=f(this).offset();A.bottom=A.top+f(this).height();A.right=A.left+f(this).width();if(y.top+L.dimensions.height>=A.top&&y.left+L.dimensions.width>=A.left){k.call(s)}})}y.left+=s.options.position.adjust.x;y.top+=s.options.position.adjust.y;F=s.getPosition();if(y.left!=F.left||y.top!=F.top){z=s.beforePositionUpdate.call(s,w);if(z===false){return s}s.cache.position=y;if(x===true){s.status.animated=true;s.elements.tooltip.animate(y,200,"swing",function(){s.status.animated=false})}else{s.elements.tooltip.css(y)}s.onPositionUpdate.call(s,w);if(typeof w!=="undefined"&&w.type&&w.type!=="mousemove"){f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_POSITION_UPDATED,"updatePosition")}}return s},updateWidth:function(w){var x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateWidth")}else{if(w&&typeof w!=="number"){return f.fn.qtip.log.error.call(s,2,"newWidth must be of type number","updateWidth")}}x=s.elements.contentWrapper.siblings().add(s.elements.tip).add(s.elements.button);if(!w){if(typeof s.options.style.width.value=="number"){w=s.options.style.width.value}else{s.elements.tooltip.css({width:"auto"});x.hide();if(f.browser.msie){s.elements.wrapper.add(s.elements.contentWrapper.children()).css({zoom:"normal"})}w=s.getDimensions().width+1;if(!s.options.style.width.value){if(w>s.options.style.width.max){w=s.options.style.width.max}if(w<s.options.style.width.min){w=s.options.style.width.min}}}}if(w%2!==0){w-=1}s.elements.tooltip.width(w);x.show();if(s.options.style.border.radius){s.elements.tooltip.find(".qtip-betweenCorners").each(function(y){f(this).width(w-(s.options.style.border.radius*2))})}if(f.browser.msie){s.elements.wrapper.add(s.elements.contentWrapper.children()).css({zoom:"1"});s.elements.wrapper.width(w);if(s.elements.bgiframe){s.elements.bgiframe.width(w).height(s.getDimensions.height)}}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_WIDTH_UPDATED,"updateWidth")},updateStyle:function(w){var z,A,x,y,B;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateStyle")}else{if(typeof w!=="string"||!f.fn.qtip.styles[w]){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.STYLE_NOT_DEFINED,"updateStyle")}}s.options.style=a.call(s,f.fn.qtip.styles[w],s.options.user.style);s.elements.content.css(q(s.options.style));if(s.options.content.title.text!==false){s.elements.title.css(q(s.options.style.title,true))}s.elements.contentWrapper.css({borderColor:s.options.style.border.color});if(s.options.style.tip.corner!==false){if(f("<canvas>").get(0).getContext){z=s.elements.tooltip.find(".qtip-tip canvas:first");x=z.get(0).getContext("2d");x.clearRect(0,0,300,300);y=z.parent("div[rel]:first").attr("rel");B=b(y,s.options.style.tip.size.width,s.options.style.tip.size.height);h.call(s,z,B,s.options.style.tip.color||s.options.style.border.color)}else{if(f.browser.msie){z=s.elements.tooltip.find('.qtip-tip [nodeName="shape"]');z.attr("fillcolor",s.options.style.tip.color||s.options.style.border.color)}}}if(s.options.style.border.radius>0){s.elements.tooltip.find(".qtip-betweenCorners").css({backgroundColor:s.options.style.border.color});if(f("<canvas>").get(0).getContext){A=g(s.options.style.border.radius);s.elements.tooltip.find(".qtip-wrapper canvas").each(function(){x=f(this).get(0).getContext("2d");x.clearRect(0,0,300,300);y=f(this).parent("div[rel]:first").attr("rel");r.call(s,f(this),A[y],s.options.style.border.radius,s.options.style.border.color)})}else{if(f.browser.msie){s.elements.tooltip.find('.qtip-wrapper [nodeName="arc"]').each(function(){f(this).attr("fillcolor",s.options.style.border.color)})}}}return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_STYLE_UPDATED,"updateStyle")},updateContent:function(A,y){var z,x,w;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateContent")}else{if(!A){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.NO_CONTENT_PROVIDED,"updateContent")}}z=s.beforeContentUpdate.call(s,A);if(typeof z=="string"){A=z}else{if(z===false){return}}if(f.browser.msie){s.elements.contentWrapper.children().css({zoom:"normal"})}if(A.jquery&&A.length>0){A.clone(true).appendTo(s.elements.content).show()}else{s.elements.content.html(A)}x=s.elements.content.find("img[complete=false]");if(x.length>0){w=0;x.each(function(C){f('<img src="'+f(this).attr("src")+'" />').load(function(){if(++w==x.length){B()}})})}else{B()}function B(){s.updateWidth();if(y!==false){if(s.options.position.type!=="static"){s.updatePosition(s.elements.tooltip.is(":visible"),true)}if(s.options.style.tip.corner!==false){n.call(s)}}}s.onContentUpdate.call(s);return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_CONTENT_UPDATED,"loadContent")},loadContent:function(w,z,A){var y;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"loadContent")}y=s.beforeContentLoad.call(s);if(y===false){return s}if(A=="post"){f.post(w,z,x)}else{f.get(w,z,x)}function x(B){s.onContentLoad.call(s);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_CONTENT_LOADED,"loadContent");s.updateContent(B)}return s},updateTitle:function(w){if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"updateTitle")}else{if(!w){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.NO_CONTENT_PROVIDED,"updateTitle")}}returned=s.beforeTitleUpdate.call(s);if(returned===false){return s}if(s.elements.button){s.elements.button=s.elements.button.clone(true)}s.elements.title.html(w);if(s.elements.button){s.elements.title.prepend(s.elements.button)}s.onTitleUpdate.call(s);return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_TITLE_UPDATED,"updateTitle")},focus:function(A){var y,x,w,z;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"focus")}else{if(s.options.position.type=="static"){return f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.CANNOT_FOCUS_STATIC,"focus")}}y=parseInt(s.elements.tooltip.css("z-index"));x=6000+f("div.qtip[qtip]").length-1;if(!s.status.focused&&y!==x){z=s.beforeFocus.call(s,A);if(z===false){return s}f("div.qtip[qtip]").not(s.elements.tooltip).each(function(){if(f(this).qtip("api").status.rendered===true){w=parseInt(f(this).css("z-index"));if(typeof w=="number"&&w>-1){f(this).css({zIndex:parseInt(f(this).css("z-index"))-1})}f(this).qtip("api").status.focused=false}});s.elements.tooltip.css({zIndex:x});s.status.focused=true;s.onFocus.call(s,A);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_FOCUSED,"focus")}return s},disable:function(w){if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"disable")}if(w){if(!s.status.disabled){s.status.disabled=true;f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_DISABLED,"disable")}else{f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.TOOLTIP_ALREADY_DISABLED,"disable")}}else{if(s.status.disabled){s.status.disabled=false;f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_ENABLED,"disable")}else{f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.TOOLTIP_ALREADY_ENABLED,"disable")}}return s},destroy:function(){var w,x,y;x=s.beforeDestroy.call(s);if(x===false){return s}if(s.status.rendered){s.options.show.when.target.unbind("mousemove.qtip",s.updatePosition);s.options.show.when.target.unbind("mouseout.qtip",s.hide);s.options.show.when.target.unbind(s.options.show.when.event+".qtip");s.options.hide.when.target.unbind(s.options.hide.when.event+".qtip");s.elements.tooltip.unbind(s.options.hide.when.event+".qtip");s.elements.tooltip.unbind("mouseover.qtip",s.focus);s.elements.tooltip.remove()}else{s.options.show.when.target.unbind(s.options.show.when.event+".qtip-create")}if(typeof s.elements.target.data("qtip")=="object"){y=s.elements.target.data("qtip").interfaces;if(typeof y=="object"&&y.length>0){for(w=0;w<y.length-1;w++){if(y[w].id==s.id){y.splice(w,1)}}}}delete f.fn.qtip.interfaces[s.id];if(typeof y=="object"&&y.length>0){s.elements.target.data("qtip").current=y.length-1}else{s.elements.target.removeData("qtip")}s.onDestroy.call(s);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_DESTROYED,"destroy");return s.elements.target},getPosition:function(){var w,x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"getPosition")}w=(s.elements.tooltip.css("display")!=="none")?false:true;if(w){s.elements.tooltip.css({visiblity:"hidden"}).show()}x=s.elements.tooltip.offset();if(w){s.elements.tooltip.css({visiblity:"visible"}).hide()}return x},getDimensions:function(){var w,x;if(!s.status.rendered){return f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.TOOLTIP_NOT_RENDERED,"getDimensions")}w=(!s.elements.tooltip.is(":visible"))?true:false;if(w){s.elements.tooltip.css({visiblity:"hidden"}).show()}x={height:s.elements.tooltip.outerHeight(),width:s.elements.tooltip.outerWidth()};if(w){s.elements.tooltip.css({visiblity:"visible"}).hide()}return x}})}function p(){var s,w,u,t,v,y,x;s=this;s.beforeRender.call(s);s.status.rendered=true;s.elements.tooltip='<div qtip="'+s.id+'" class="qtip '+(s.options.style.classes.tooltip||s.options.style)+'"style="display:none; -moz-border-radius:0; -webkit-border-radius:0; border-radius:0;position:'+s.options.position.type+';">  <div class="qtip-wrapper" style="position:relative; overflow:hidden; text-align:left;">    <div class="qtip-contentWrapper" style="overflow:hidden;">       <div class="qtip-content '+s.options.style.classes.content+'"></div></div></div></div>';s.elements.tooltip=f(s.elements.tooltip);s.elements.tooltip.appendTo(s.options.position.container);s.elements.tooltip.data("qtip",{current:0,interfaces:[s]});s.elements.wrapper=s.elements.tooltip.children("div:first");s.elements.contentWrapper=s.elements.wrapper.children("div:first").css({background:s.options.style.background});s.elements.content=s.elements.contentWrapper.children("div:first").css(q(s.options.style));if(f.browser.msie){s.elements.wrapper.add(s.elements.content).css({zoom:1})}if(s.options.hide.when.event=="unfocus"){s.elements.tooltip.attr("unfocus",true)}if(typeof s.options.style.width.value=="number"){s.updateWidth()}if(f("<canvas>").get(0).getContext||f.browser.msie){if(s.options.style.border.radius>0){m.call(s)}else{s.elements.contentWrapper.css({border:s.options.style.border.width+"px solid "+s.options.style.border.color})}if(s.options.style.tip.corner!==false){e.call(s)}}else{s.elements.contentWrapper.css({border:s.options.style.border.width+"px solid "+s.options.style.border.color});s.options.style.border.radius=0;s.options.style.tip.corner=false;f.fn.qtip.log.error.call(s,2,f.fn.qtip.constants.CANVAS_VML_NOT_SUPPORTED,"render")}if((typeof s.options.content.text=="string"&&s.options.content.text.length>0)||(s.options.content.text.jquery&&s.options.content.text.length>0)){u=s.options.content.text}else{if(typeof s.elements.target.attr("title")=="string"&&s.elements.target.attr("title").length>0){u=s.elements.target.attr("title").replace("\\n","<br />");s.elements.target.attr("title","")}else{if(typeof s.elements.target.attr("alt")=="string"&&s.elements.target.attr("alt").length>0){u=s.elements.target.attr("alt").replace("\\n","<br />");s.elements.target.attr("alt","")}else{u=" ";f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.NO_VALID_CONTENT,"render")}}}if(s.options.content.title.text!==false){j.call(s)}s.updateContent(u);l.call(s);if(s.options.show.ready===true){s.show()}if(s.options.content.url!==false){t=s.options.content.url;v=s.options.content.data;y=s.options.content.method||"get";s.loadContent(t,v,y)}s.onRender.call(s);f.fn.qtip.log.error.call(s,1,f.fn.qtip.constants.EVENT_RENDERED,"render")}function m(){var F,z,t,B,x,E,u,G,D,y,w,C,A,s,v;F=this;F.elements.wrapper.find(".qtip-borderBottom, .qtip-borderTop").remove();t=F.options.style.border.width;B=F.options.style.border.radius;x=F.options.style.border.color||F.options.style.tip.color;E=g(B);u={};for(z in E){u[z]='<div rel="'+z+'" style="'+((z.search(/Left/)!==-1)?"left":"right")+":0; position:absolute; height:"+B+"px; width:"+B+'px; overflow:hidden; line-height:0.1px; font-size:1px">';if(f("<canvas>").get(0).getContext){u[z]+='<canvas height="'+B+'" width="'+B+'" style="vertical-align: top"></canvas>'}else{if(f.browser.msie){G=B*2+3;u[z]+='<v:arc stroked="false" fillcolor="'+x+'" startangle="'+E[z][0]+'" endangle="'+E[z][1]+'" style="width:'+G+"px; height:"+G+"px; margin-top:"+((z.search(/bottom/)!==-1)?-2:-1)+"px; margin-left:"+((z.search(/Right/)!==-1)?E[z][2]-3.5:-1)+'px; vertical-align:top; display:inline-block; behavior:url(#default#VML)"></v:arc>'}}u[z]+="</div>"}D=F.getDimensions().width-(Math.max(t,B)*2);y='<div class="qtip-betweenCorners" style="height:'+B+"px; width:"+D+"px; overflow:hidden; background-color:"+x+'; line-height:0.1px; font-size:1px;">';w='<div class="qtip-borderTop" dir="ltr" style="height:'+B+"px; margin-left:"+B+'px; line-height:0.1px; font-size:1px; padding:0;">'+u.topLeft+u.topRight+y;F.elements.wrapper.prepend(w);C='<div class="qtip-borderBottom" dir="ltr" style="height:'+B+"px; margin-left:"+B+'px; line-height:0.1px; font-size:1px; padding:0;">'+u.bottomLeft+u.bottomRight+y;F.elements.wrapper.append(C);if(f("<canvas>").get(0).getContext){F.elements.wrapper.find("canvas").each(function(){A=E[f(this).parent("[rel]:first").attr("rel")];r.call(F,f(this),A,B,x)})}else{if(f.browser.msie){F.elements.tooltip.append('<v:image style="behavior:url(#default#VML);"></v:image>')}}s=Math.max(B,(B+(t-B)));v=Math.max(t-B,0);F.elements.contentWrapper.css({border:"0px solid "+x,borderWidth:v+"px "+s+"px"})}function r(u,w,s,t){var v=u.get(0).getContext("2d");v.fillStyle=t;v.beginPath();v.arc(w[0],w[1],s,0,Math.PI*2,false);v.fill()}function e(v){var t,s,x,u,w;t=this;if(t.elements.tip!==null){t.elements.tip.remove()}s=t.options.style.tip.color||t.options.style.border.color;if(t.options.style.tip.corner===false){return}else{if(!v){v=t.options.style.tip.corner}}x=b(v,t.options.style.tip.size.width,t.options.style.tip.size.height);t.elements.tip='<div class="'+t.options.style.classes.tip+'" dir="ltr" rel="'+v+'" style="position:absolute; height:'+t.options.style.tip.size.height+"px; width:"+t.options.style.tip.size.width+'px; margin:0 auto; line-height:0.1px; font-size:1px;">';if(f("<canvas>").get(0).getContext){t.elements.tip+='<canvas height="'+t.options.style.tip.size.height+'" width="'+t.options.style.tip.size.width+'"></canvas>'}else{if(f.browser.msie){u=t.options.style.tip.size.width+","+t.options.style.tip.size.height;w="m"+x[0][0]+","+x[0][1];w+=" l"+x[1][0]+","+x[1][1];w+=" "+x[2][0]+","+x[2][1];w+=" xe";t.elements.tip+='<v:shape fillcolor="'+s+'" stroked="false" filled="true" path="'+w+'" coordsize="'+u+'" style="width:'+t.options.style.tip.size.width+"px; height:"+t.options.style.tip.size.height+"px; line-height:0.1px; display:inline-block; behavior:url(#default#VML); vertical-align:"+((v.search(/top/)!==-1)?"bottom":"top")+'"></v:shape>';t.elements.tip+='<v:image style="behavior:url(#default#VML);"></v:image>';t.elements.contentWrapper.css("position","relative")}}t.elements.tooltip.prepend(t.elements.tip+"</div>");t.elements.tip=t.elements.tooltip.find("."+t.options.style.classes.tip).eq(0);if(f("<canvas>").get(0).getContext){h.call(t,t.elements.tip.find("canvas:first"),x,s)}if(v.search(/top/)!==-1&&f.browser.msie&&parseInt(f.browser.version.charAt(0))===6){t.elements.tip.css({marginTop:-4})}n.call(t,v)}function h(t,v,s){var u=t.get(0).getContext("2d");u.fillStyle=s;u.beginPath();u.moveTo(v[0][0],v[0][1]);u.lineTo(v[1][0],v[1][1]);u.lineTo(v[2][0],v[2][1]);u.fill()}function n(u){var t,w,s,x,v;t=this;if(t.options.style.tip.corner===false||!t.elements.tip){return}if(!u){u=t.elements.tip.attr("rel")}w=positionAdjust=(f.browser.msie)?1:0;t.elements.tip.css(u.match(/left|right|top|bottom/)[0],0);if(u.search(/top|bottom/)!==-1){if(f.browser.msie){if(parseInt(f.browser.version.charAt(0))===6){positionAdjust=(u.search(/top/)!==-1)?-3:1}else{positionAdjust=(u.search(/top/)!==-1)?1:2}}if(u.search(/Middle/)!==-1){t.elements.tip.css({left:"50%",marginLeft:-(t.options.style.tip.size.width/2)})}else{if(u.search(/Left/)!==-1){t.elements.tip.css({left:t.options.style.border.radius-w})}else{if(u.search(/Right/)!==-1){t.elements.tip.css({right:t.options.style.border.radius+w})}}}if(u.search(/top/)!==-1){t.elements.tip.css({top:-positionAdjust})}else{t.elements.tip.css({bottom:positionAdjust})}}else{if(u.search(/left|right/)!==-1){if(f.browser.msie){positionAdjust=(parseInt(f.browser.version.charAt(0))===6)?1:((u.search(/left/)!==-1)?1:2)}if(u.search(/Middle/)!==-1){t.elements.tip.css({top:"50%",marginTop:-(t.options.style.tip.size.height/2)})}else{if(u.search(/Top/)!==-1){t.elements.tip.css({top:t.options.style.border.radius-w})}else{if(u.search(/Bottom/)!==-1){t.elements.tip.css({bottom:t.options.style.border.radius+w})}}}if(u.search(/left/)!==-1){t.elements.tip.css({left:-positionAdjust})}else{t.elements.tip.css({right:positionAdjust})}}}s="padding-"+u.match(/left|right|top|bottom/)[0];x=t.options.style.tip.size[(s.search(/left|right/)!==-1)?"width":"height"];t.elements.tooltip.css("padding",0);t.elements.tooltip.css(s,x);if(f.browser.msie&&parseInt(f.browser.version.charAt(0))==6){v=parseInt(t.elements.tip.css("margin-top"))||0;v+=parseInt(t.elements.content.css("margin-top"))||0;t.elements.tip.css({marginTop:v})}}function j(){var s=this;if(s.elements.title!==null){s.elements.title.remove()}s.elements.title=f('<div class="'+s.options.style.classes.title+'">').css(q(s.options.style.title,true)).css({zoom:(f.browser.msie)?1:0}).prependTo(s.elements.contentWrapper);if(s.options.content.title.text){s.updateTitle.call(s,s.options.content.title.text)}if(s.options.content.title.button!==false&&typeof s.options.content.title.button=="string"){s.elements.button=f('<a class="'+s.options.style.classes.button+'" style="float:right; position: relative"></a>').css(q(s.options.style.button,true)).html(s.options.content.title.button).prependTo(s.elements.title).click(function(t){if(!s.status.disabled){s.hide(t)}})}}function l(){var t,v,u,s;t=this;v=t.options.show.when.target;u=t.options.hide.when.target;if(t.options.hide.fixed){u=u.add(t.elements.tooltip)}if(t.options.hide.when.event=="inactive"){s=["click","dblclick","mousedown","mouseup","mousemove","mouseout","mouseenter","mouseleave","mouseover"];function y(z){if(t.status.disabled===true){return}clearTimeout(t.timers.inactive);t.timers.inactive=setTimeout(function(){f(s).each(function(){u.unbind(this+".qtip-inactive");t.elements.content.unbind(this+".qtip-inactive")});t.hide(z)},t.options.hide.delay)}}else{if(t.options.hide.fixed===true){t.elements.tooltip.bind("mouseover.qtip",function(){if(t.status.disabled===true){return}clearTimeout(t.timers.hide)})}}function x(z){if(t.status.disabled===true){return}if(t.options.hide.when.event=="inactive"){f(s).each(function(){u.bind(this+".qtip-inactive",y);t.elements.content.bind(this+".qtip-inactive",y)});y()}clearTimeout(t.timers.show);clearTimeout(t.timers.hide);t.timers.show=setTimeout(function(){t.show(z)},t.options.show.delay)}function w(z){if(t.status.disabled===true){return}if(t.options.hide.fixed===true&&t.options.hide.when.event.search(/mouse(out|leave)/i)!==-1&&f(z.relatedTarget).parents("div.qtip[qtip]").length>0){z.stopPropagation();z.preventDefault();clearTimeout(t.timers.hide);return false}clearTimeout(t.timers.show);clearTimeout(t.timers.hide);t.elements.tooltip.stop(true,true);t.timers.hide=setTimeout(function(){t.hide(z)},t.options.hide.delay)}if((t.options.show.when.target.add(t.options.hide.when.target).length===1&&t.options.show.when.event==t.options.hide.when.event&&t.options.hide.when.event!=="inactive")||t.options.hide.when.event=="unfocus"){t.cache.toggle=0;v.bind(t.options.show.when.event+".qtip",function(z){if(t.cache.toggle==0){x(z)}else{w(z)}})}else{v.bind(t.options.show.when.event+".qtip",x);if(t.options.hide.when.event!=="inactive"){u.bind(t.options.hide.when.event+".qtip",w)}}if(t.options.position.type.search(/(fixed|absolute)/)!==-1){t.elements.tooltip.bind("mouseover.qtip",t.focus)}if(t.options.position.target==="mouse"&&t.options.position.type!=="static"){v.bind("mousemove.qtip",function(z){t.cache.mouse={x:z.pageX,y:z.pageY};if(t.status.disabled===false&&t.options.position.adjust.mouse===true&&t.options.position.type!=="static"&&t.elements.tooltip.css("display")!=="none"){t.updatePosition(z)}})}}function o(u,v,A){var z,s,x,y,t,w;z=this;if(A.corner=="center"){return v.position}s=f.extend({},u);y={x:false,y:false};t={left:(s.left<f.fn.qtip.cache.screen.scroll.left),right:(s.left+A.dimensions.width+2>=f.fn.qtip.cache.screen.width+f.fn.qtip.cache.screen.scroll.left),top:(s.top<f.fn.qtip.cache.screen.scroll.top),bottom:(s.top+A.dimensions.height+2>=f.fn.qtip.cache.screen.height+f.fn.qtip.cache.screen.scroll.top)};x={left:(t.left&&(A.corner.search(/right/i)!=-1||(A.corner.search(/right/i)==-1&&!t.right))),right:(t.right&&(A.corner.search(/left/i)!=-1||(A.corner.search(/left/i)==-1&&!t.left))),top:(t.top&&A.corner.search(/top/i)==-1),bottom:(t.bottom&&A.corner.search(/bottom/i)==-1)};if(x.left){if(z.options.position.target!=="mouse"){s.left=v.position.left+v.dimensions.width}else{s.left=z.cache.mouse.x}y.x="Left"}else{if(x.right){if(z.options.position.target!=="mouse"){s.left=v.position.left-A.dimensions.width}else{s.left=z.cache.mouse.x-A.dimensions.width}y.x="Right"}}if(x.top){if(z.options.position.target!=="mouse"){s.top=v.position.top+v.dimensions.height}else{s.top=z.cache.mouse.y}y.y="top"}else{if(x.bottom){if(z.options.position.target!=="mouse"){s.top=v.position.top-A.dimensions.height}else{s.top=z.cache.mouse.y-A.dimensions.height}y.y="bottom"}}if(s.left<0){s.left=u.left;y.x=false}if(s.top<0){s.top=u.top;y.y=false}if(z.options.style.tip.corner!==false){s.corner=new String(A.corner);if(y.x!==false){s.corner=s.corner.replace(/Left|Right|Middle/,y.x)}if(y.y!==false){s.corner=s.corner.replace(/top|bottom/,y.y)}if(s.corner!==z.elements.tip.attr("rel")){e.call(z,s.corner)}}return s}function q(u,t){var v,s;v=f.extend(true,{},u);for(s in v){if(t===true&&s.search(/(tip|classes)/i)!==-1){delete v[s]}else{if(!t&&s.search(/(width|border|tip|title|classes|user)/i)!==-1){delete v[s]}}}return v}function c(s){if(typeof s.tip!=="object"){s.tip={corner:s.tip}}if(typeof s.tip.size!=="object"){s.tip.size={width:s.tip.size,height:s.tip.size}}if(typeof s.border!=="object"){s.border={width:s.border}}if(typeof s.width!=="object"){s.width={value:s.width}}if(typeof s.width.max=="string"){s.width.max=parseInt(s.width.max.replace(/([0-9]+)/i,"$1"))}if(typeof s.width.min=="string"){s.width.min=parseInt(s.width.min.replace(/([0-9]+)/i,"$1"))}if(typeof s.tip.size.x=="number"){s.tip.size.width=s.tip.size.x;delete s.tip.size.x}if(typeof s.tip.size.y=="number"){s.tip.size.height=s.tip.size.y;delete s.tip.size.y}return s}function a(){var s,t,u,x,v,w;s=this;u=[true,{}];for(t=0;t<arguments.length;t++){u.push(arguments[t])}x=[f.extend.apply(f,u)];while(typeof x[0].name=="string"){x.unshift(c(f.fn.qtip.styles[x[0].name]))}x.unshift(true,{classes:{tooltip:"qtip-"+(arguments[0].name||"defaults")}},f.fn.qtip.styles.defaults);v=f.extend.apply(f,x);w=(f.browser.msie)?1:0;v.tip.size.width+=w;v.tip.size.height+=w;if(v.tip.size.width%2>0){v.tip.size.width+=1}if(v.tip.size.height%2>0){v.tip.size.height+=1}if(v.tip.corner===true){v.tip.corner=(s.options.position.corner.tooltip==="center")?false:s.options.position.corner.tooltip}return v}function b(v,u,t){var s={bottomRight:[[0,0],[u,t],[u,0]],bottomLeft:[[0,0],[u,0],[0,t]],topRight:[[0,t],[u,0],[u,t]],topLeft:[[0,0],[0,t],[u,t]],topMiddle:[[0,t],[u/2,0],[u,t]],bottomMiddle:[[0,0],[u,0],[u/2,t]],rightMiddle:[[0,0],[u,t/2],[0,t]],leftMiddle:[[u,0],[u,t],[0,t/2]]};s.leftTop=s.bottomRight;s.rightTop=s.bottomLeft;s.leftBottom=s.topRight;s.rightBottom=s.topLeft;return s[v]}function g(s){var t;if(f("<canvas>").get(0).getContext){t={topLeft:[s,s],topRight:[0,s],bottomLeft:[s,0],bottomRight:[0,0]}}else{if(f.browser.msie){t={topLeft:[-90,90,0],topRight:[-90,90,-s],bottomLeft:[90,270,0],bottomRight:[90,270,-s]}}}return t}function k(){var s,t,u;s=this;u=s.getDimensions();t='<iframe class="qtip-bgiframe" frameborder="0" tabindex="-1" src="javascript:false" style="display:block; position:absolute; z-index:-1; filter:alpha(opacity=\'0\'); border: 1px solid red; height:'+u.height+"px; width:"+u.width+'px" />';s.elements.bgiframe=s.elements.wrapper.prepend(t).children(".qtip-bgiframe:first")}f(document).ready(function(){f.fn.qtip.cache={screen:{scroll:{left:f(window).scrollLeft(),top:f(window).scrollTop()},width:f(window).width(),height:f(window).height()}};var s;f(window).bind("resize scroll",function(t){clearTimeout(s);s=setTimeout(function(){if(t.type==="scroll"){f.fn.qtip.cache.screen.scroll={left:f(window).scrollLeft(),top:f(window).scrollTop()}}else{f.fn.qtip.cache.screen.width=f(window).width();f.fn.qtip.cache.screen.height=f(window).height()}for(i=0;i<f.fn.qtip.interfaces.length;i++){var u=f.fn.qtip.interfaces[i];if(u.status.rendered===true&&(u.options.position.type!=="static"||u.options.position.adjust.scroll&&t.type==="scroll"||u.options.position.adjust.resize&&t.type==="resize")){u.updatePosition(t,true)}}},100)});f(document).bind("mousedown.qtip",function(t){if(f(t.target).parents("div.qtip").length===0){f(".qtip[unfocus]").each(function(){var u=f(this).qtip("api");if(f(this).is(":visible")&&!u.status.disabled&&f(t.target).add(u.elements.target).length>1){u.hide(t)}})}})});f.fn.qtip.interfaces=[];f.fn.qtip.log={error:function(){return this}};f.fn.qtip.constants={};f.fn.qtip.defaults={content:{prerender:false,text:false,url:false,data:null,title:{text:false,button:false}},position:{target:false,corner:{target:"bottomRight",tooltip:"topLeft"},adjust:{x:0,y:0,mouse:true,screen:false,scroll:true,resize:true},type:"absolute",container:false},show:{when:{target:false,event:"mouseover"},effect:{type:"fade",length:100},delay:140,solo:false,ready:false},hide:{when:{target:false,event:"mouseout"},effect:{type:"fade",length:100},delay:0,fixed:false},api:{beforeRender:function(){},onRender:function(){},beforePositionUpdate:function(){},onPositionUpdate:function(){},beforeShow:function(){},onShow:function(){},beforeHide:function(){},onHide:function(){},beforeContentUpdate:function(){},onContentUpdate:function(){},beforeContentLoad:function(){},onContentLoad:function(){},beforeTitleUpdate:function(){},onTitleUpdate:function(){},beforeDestroy:function(){},onDestroy:function(){},beforeFocus:function(){},onFocus:function(){}}};f.fn.qtip.styles={defaults:{background:"white",color:"#111",overflow:"hidden",textAlign:"left",width:{min:0,max:250},padding:"5px 9px",border:{width:1,radius:0,color:"#d3d3d3"},tip:{corner:false,color:false,size:{width:13,height:13},opacity:1},title:{background:"#e1e1e1",fontWeight:"bold",padding:"7px 12px"},button:{cursor:"pointer"},classes:{target:"",tip:"qtip-tip",title:"qtip-title",button:"qtip-button",content:"qtip-content",active:"qtip-active"}},cream:{border:{width:3,radius:0,color:"#F9E98E"},title:{background:"#F0DE7D",color:"#A27D35"},background:"#FBF7AA",color:"#A27D35",classes:{tooltip:"qtip-cream"}},light:{border:{width:3,radius:0,color:"#E2E2E2"},title:{background:"#f1f1f1",color:"#454545"},background:"white",color:"#454545",classes:{tooltip:"qtip-light"}},dark:{border:{width:3,radius:0,color:"#303030"},title:{background:"#404040",color:"#f3f3f3"},background:"#505050",color:"#f3f3f3",classes:{tooltip:"qtip-dark"}},red:{border:{width:3,radius:0,color:"#CE6F6F"},title:{background:"#f28279",color:"#9C2F2F"},background:"#F79992",color:"#9C2F2F",classes:{tooltip:"qtip-red"}},green:{border:{width:3,radius:0,color:"#A9DB66"},title:{background:"#b9db8c",color:"#58792E"},background:"#CDE6AC",color:"#58792E",classes:{tooltip:"qtip-green"}},blue:{border:{width:3,radius:0,color:"#ADD9ED"},title:{background:"#D0E9F5",color:"#5E99BD"},background:"#E5F6FE",color:"#4D9FBF",classes:{tooltip:"qtip-blue"}}}})(jQuery);











































/* Actual Heights plugin
 * Copyright 2011, Ben Lin (http://dreamerslab.com/)
* Licensed under the MIT License (LICENSE.txt).
*
* Version: 1.0.5
*
* Requires: jQuery 1.2.3+
*/
;(function(a){a.fn.extend({actual:function(b,k){var c,d,h,g,f,j,e,i;if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}h=a.extend({absolute:false,clone:false,includeMargin:undefined},k);d=this;if(h.clone===true){e=function(){d=d.filter(":first").clone().css({position:"absolute",top:-1000}).appendTo("body");};i=function(){d.remove();};}else{e=function(){c=d.parents().andSelf().filter(":hidden");g=h.absolute===true?{position:"absolute",visibility:"hidden",display:"block"}:{visibility:"hidden",display:"block"};f=[];c.each(function(){var m={},l;for(l in g){m[l]=this.style[l];this.style[l]=g[l];}f.push(m);});};i=function(){c.each(function(m){var n=f[m],l;for(l in g){this.style[l]=n[l];}});};}e();j=d[b](h.includeMargin);i();return j;}});})(jQuery);

function mouseIsOverElement(elemId) { return elemId === $('#mouseTracker').val(); } 

(function($) {
	$.fn.equalHeights = function(minHeight, maxHeight) {
		var tallest = (minHeight) ? minHeight : 0;
		function addSize(elem,baseHeight,operation) {
			var border_top = parseInt(elem.css('border-top-width'));
			var border_bottom = parseInt(elem.css('border-bottom-width'));
			var padding_top = parseInt(elem.css('padding-top'));
			var padding_bottom = parseInt(elem.css('padding-bottom'));
			if (operation == 'subtract') {
			if (!isNaN(padding_top)) baseHeight -= padding_top;
			if (!isNaN(padding_bottom)) baseHeight -= padding_bottom;
			if (!isNaN(border_top)) baseHeight -= border_top;
			if (!isNaN(border_bottom)) baseHeight -= border_bottom;
			} else {
			if (!isNaN(padding_top)) baseHeight += padding_top;
			if (!isNaN(padding_bottom)) baseHeight += padding_bottom;
			if (!isNaN(border_top)) baseHeight += border_top;
			if (!isNaN(border_bottom)) baseHeight += border_bottom;
			}
			return baseHeight;
		}
		this.each(function() {
			var height = $(this).actual('height');
			height = addSize($(this),height);
			if (height > tallest) tallest = height;
		});
		if((maxHeight) && tallest > maxHeight) tallest = maxHeight;
			return this.each(function() {
			tallest2 = addSize($(this),tallest,'subtract')
			$(this).height(tallest2);
		});
	}
})(jQuery);



/*WPB homepage show hide of the advert features (large arrows)*/
FC.WPBHomeFeature = function(){
	$(".default").addClass("selected");
	var opts = $(".wpb-feature .options ul li");
	opts.hoverIntent(
		function(){
			opts.removeClass("selected");
			var targ = $(this).attr("class");
			$(".info .selected").css({"left":"-40000px"});
			$(".info .selected").removeClass("selected");
			$("div."+targ).css({"left":"0"});
			$(this).addClass("selected");		
			$("div."+targ).addClass("selected");			
		},
		function(){
		}
	);
};
/*WPB landing page show hide of the advert features (large arrows)*/
FC.WPBLandingFeature = function(){	
	$(".default").addClass("selected");
	var opts = $(".wpb-options ul li");
	opts.bind("mouseenter mouseover",
		function(){
			opts.removeClass("selected");
			var targ = $(this).attr("class");
			$(".info .selected").css({"left":"-40000px"});
			$(".info .selected").removeClass("selected");
			$("div."+targ).css({"left":"0"});
			$(this).addClass("selected");		
			$("div."+targ).addClass("selected");
		}
	);
};
/*the news tab feature box functionality*/
FC.NewsTab = function(){
	var opts = $(".news-menu ul li a");
	opts.bind("click mouseover mouseenter",	
		function(){
			var anc = $(this).attr("id");
			$(".news-menu ul li a.selected").removeClass("selected");
			$(this).addClass("selected");
			$(".news-content ul.selected").removeClass("selected");
			$("."+anc).addClass("selected");
			
			return false;
			});	
	
	};
/* The hover action on the homepage carousel items, marks the currently hovered item as selected
 * and applies styles accorddingly
*/
FC.Homefeature = function(){
	var length = $(".default-panel").length;
	var defaultitem = Math.floor(Math.random()*length) + 1;	
	$("div.info-panel, div.default-panel").removeClass("default");
	$("div.default-panel-"+defaultitem).addClass("default");
	
	Cufon.replace('.sifr');
	var opts = $("li.home-carousel-item");
		opts.hoverIntent(function(){
			var anc = $(this).attr("id");
			var targ = $(this).attr("id");
			var selection = $(this).attr("class");		
			$(".selected-item").removeClass("selected-item");
			$(this).addClass("selected-item");
			$("div.info-panel, div.default-panel").removeClass("default");
			$("div.panel-"+targ).addClass("default");
			}, 
	     function () { 
	
			}
		);	
		
	};
/* this is no longer used, as the fucntion after has replaced it, however it's been kept in for now
 * in case it is requred later or hasn't been fully removed from the cms*/		
FC.Customer = function(){
		var opts2 = $("li.existingCustomer");
		var opts3 = $("div.existingCustomerArea");
		opts2.bind("mouseenter",		
		function(){
			var topNav = $(".navigation li a span");
			var curr = $(".drop-down.active");
			curr.removeClass("active");
			curr.css({"display":"none"});
			topNav.parent().removeClass("active");
			
		$("div.existingCustomerArea").show();
		
		});
		opts3.bind("mouseleave",		
		function(){
		$("div.existingCustomerArea").hide();});
	};
	function Right(str, n){
		  if (n <= 0)
		    return "";
		  else if (n > String(str).length)
		    return str;
		  else {
		    var iLen = String(str).length;
		    return String(str).substring(iLen, iLen - n);
		  }
		}

/* This is for the FAQ item expand and contract functionality*/
FC.FAQ = function() {
  $(".faq-content").hide();
  $(".faq-heading-off").live("click", function(){	  
	  $(this).parent().addClass("faq-item-on");	  
	  $(this).addClass("faq-heading-on");	  
	  $(this).removeClass("faq-heading-off");	  
	  $(this).parent().removeClass("faq-item-off");	  
	  $(this).next(".faq-content").slideToggle(500);  
	});  
  $(".faq-heading-on").live("click", function(){  			  
	  $(this).parent().addClass("faq-item-off");	  
	  $(this).addClass("faq-heading-off");	  
	  $(this).removeClass("faq-heading-on");	  
	  $(this).parent().removeClass("faq-item-on");	  
	  $(this).next(".faq-content").slideToggle(500);  
	});    
  
  //check for an anchor in the url	
	//get url vars  	  
	  document.getVars = [];	  
	  var urlHalves = String(document.location).split('?');	  
	  if(urlHalves[1]){		  
		var urlVars = urlHalves[1].split('&');		  
		for(var i=0; i<=(urlVars.length); i++){			  
			if(urlVars[i]){				  
				var urlVarPair = urlVars[i].split('=');				  
				document.getVars[urlVarPair[0]] = urlVarPair[1];			  
			}		  
		}	  
	}	

//set open var value
	if (document.getVars.open != "undefined"){
	var open = document.getVars.open;
		}
	if (typeof(open) != "undefined") { // the url has an open variable
		open = open.substring(0,open.indexOf("#"));
	// Close all the groups, and open the one in the url
		open = '#' + open;
		$('.faq-heading-on').replaceWith($('.faq-heading-off'));
		$('.faq-item-on').replaceWith($('.faq-item-off'));
		$('.faq-content').hide();
		$(open).addClass("faq-item-on");
		$(open).removeClass("faq-item-off");
		$(open).children('.faq-heading-off').addClass("faq-heading-on");
		$(open).children('.faq-heading-off').removeClass("faq-heading-off");  
		$(open + ' .faq-content').slideToggle(500);
		scrollpage(open);
		}

//END NEW BLOCK
};
/* This is for the FAQ item expand and contract functionality*/
FC.categories = function() {
  jQuery(".cat-content").hide();
  $(".cat-heading-off").live("click", function(){
	  var _this =  $(this);
	  _this.parent().addClass("cat-item-on");
	  _this.addClass("cat-heading-on");
	  _this.removeClass("cat-heading-off");
	  _this.parent().removeClass("cat-item-off");
	  _this.next(".cat-content").slideToggle(500);
  });
  $(".cat-heading-on").live("click", function(){
	  var _this =  $(this);
	  _this.parent().addClass("cat-item-off");
	  _this.addClass("cat-heading-off");
	  _this.removeClass("cat-heading-on");
	  _this.parent().removeClass("cat-item-on");
	  _this.next(".cat-content").slideToggle(500);
  });
  
};
/*********************************************************************/
/* added by Sonal - to enable the FAQ Show Hide all functionality*/
FC.FAQGroup = function() {
	// display the show hide links
	$(".faq-group-shortcuts").css({'display':'block'});
	// faq-show-all items on click
	$(".faq-show-all").live("click", function(){
		  $('.faq-heading-off').addClass("faq-heading-on");
		  $('.faq-heading-on').removeClass("faq-heading-off");
		  $('.faq-item-off').addClass("faq-item-on");
		  $('.faq-item-on').removeClass("faq-item-off");
		  $(".faq-content").show();
	  });
	//hide-all items on click
	
	  $(".faq-hide-all").live("click", function(){
		  $('.faq-heading-on').addClass("faq-heading-off");
		  $('.faq-heading-off').removeClass("faq-heading-on");
		  $('.faq-item-on').addClass("faq-item-off");
		  $('.faq-item-off').removeClass("faq-item-on");
		  $(".faq-content").hide();
	  });
	  
}
/* end of what Sonal added for FAQ */
/*********************************************************************/
/* This is for generic expand and contract functionality (eg utes portfolio)*/
FC.utesExpandContract = function() {
  $(".child").hide();
  $(".plus").live("click", function(){
	  var thisItem = $(this).parent().parent().attr('id');
	  $('.'+thisItem).addClass("expanded");
	  $(this).addClass("minus").removeClass("plus");
	  $('.expanded').show();
	  return false;
  });
  $(".minus").live("click", function(){
	  var thisItem = $(this).parent().parent().attr('id');
	  $('.'+thisItem + '.expanded').hide();
	  $('.'+thisItem).removeClass("expanded");
	  $(this).addClass("plus").removeClass("minus");
	  return false;
	 
  });
  //check for an anchor in the url
	//get url vars  
	  document.getVars = [];
	  var urlHalves = String(document.location).split('?');
	  if(urlHalves[1]){
		  var urlVars = urlHalves[1].split('&');
		  for(var i=0; i<=(urlVars.length); i++){
			  if(urlVars[i]){
				  var urlVarPair = urlVars[i].split('=');
				  document.getVars[urlVarPair[0]] = urlVarPair[1];
			  }
		  }
	  }
	//set open var value
	var open = document.getVars.open;
	if (typeof(open) != "undefined") { // the url has an open variable
	  // Close all the children, and open the one in the url
	  
	  $(".child").hide();
	  $('.'+open).addClass("expanded");
	  $('#'+open+' td a').addClass("minus").removeClass("plus");
	  $('.'+open + '.expanded').show();
	  
	}
};
/* Accordian */
FC.HPAccordian = function () {
	var __accordian = $("ul.accordian");
	var __lis = __accordian.find("li a");
	var __items = __accordian.find("div.accordian-item");

	__lis.hoverIntent(function () {
		var __this = $(this).parent();
		var __current = __this.parent().find(".open");
		__current.find("div.accordian-item").css({ "display": "none" });
		__current.removeClass('open');
		__this.find("div.accordian-item").css({ "display": "block" });
		__this.addClass('open');
	},
	function () { });

	__accordian.mouseleave(function () { __items.css({ "display": "none" }); });

	__lis.focus(function () {
		var __this = $(this).parent();
		var __current = __this.parent().find(".open");
		__current.find("div.accordian-item").hide();
		__current.removeClass('open');
		__this.find("div.accordian-item").show();
		__this.addClass('open');
	});

	__accordian.blur(function () { __items.hide() });
}

FC.HPdate = function(){
	
	var __targ = $("span#date");
	
	var __date = new Date();
	var __month = __date.getMonth();
	var __year = __date.getFullYear();
	
	var __months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
	
	__targ.empty().append(__months[__month] + " " + __year);
	
}

/* name fund showhide*/
FC.trustNameExpandContract = function() {
	  $(".name-trust-details").hide();
	  $(".name-trust-title .plus-icon").live("click", function(){
		  $(this).addClass('minus-icon');
		  $(this).removeClass('plus-icon');
		  $(".name-trust-details").slideToggle();
		  $('.feat1-cols-2 .col').css({'height':'280px'});
		  return false;
	  });
	  $(".name-trust-title .minus-icon").live("click", function(){
		  $(this).addClass('plus-icon');
		  $(this).removeClass('minus-icon');
		  $(".name-trust-details").slideToggle();
		  $('.feat1-cols-2 .col').css({'height':'280px'});
		  return false;
	  });
	  
}
/* This is for the product group expand and contract functionality*/
FC.productGroup = function() {
	// display the show hide links
	$(".product-group-shortcuts").css({'display':'block'});
	// show-all items on click
	$(".show-all").live("click", function(){
		  $('.product-group-off').addClass("product-group-on");
		  $('.product-group-on').removeClass("product-group-off");
		  $('.product-group-title-off').addClass("product-group-title-on");
		  $('.product-group-title-on').removeClass("product-group-title-off");  
		  $(".product-group").show();
	  });
	//hide-all items on click
	
	  $(".hide-all").live("click", function(){
		  $('.product-group-on').addClass("product-group-off");
		  $('.product-group-off').removeClass("product-group-on");
		  $('.product-group-title-on').addClass("product-group-title-off");
		  $('.product-group-title-off').removeClass("product-group-title-on");	 
		  $(".product-group").hide();  
	  });
	//check for an anchor in the url
	//get url vars  
	  document.getVars = [];
	  var urlHalves = String(document.location).split('?');
	  if(urlHalves[1]){
		  var urlVars = urlHalves[1].split('&');
		  for(var i=0; i<=(urlVars.length); i++){
			  if(urlVars[i]){
				  var urlVarPair = urlVars[i].split('=');
				  document.getVars[urlVarPair[0]] = urlVarPair[1];
			  }
		  }
	  }
	//set open var value
	
	var open = document.getVars.open;
	
	if (typeof(open) != "undefined") { // the url has an open variable
	  // Close all the groups, and open the one in the url
	  var open = '#' + open;
	  $('.hide-all').click();
	  $(open).addClass("product-group-on");
	  $(open).removeClass("product-group-off");
	  $(open + ' .product-group-title-off').addClass("product-group-title-on");
	  $(open + ' .product-group-title-on').removeClass("product-group-title-off");  
	  $(open + ' .product-group').show();
	}
  $(".product-group-shortcuts").css({'display':'block'});
  
  
  $(".product-group-title-off").live("click", function(){
	  $(this).parent().addClass("product-group-on");
	  $(this).parent().removeClass("product-group-off");
	  $(this).addClass("product-group-title-on");
	  $(this).removeClass("product-group-title-off");
	  $(this).next(".product-group").show();
	  
  });
  $(".product-group-title-on").live("click", function(){
	  $(this).parent().addClass("product-group-off");
	  $(this).parent().removeClass("product-group-on");
	  $(this).addClass("product-group-title-off");
	  $(this).removeClass("product-group-title-on");
	  $(this).next(".product-group").hide();
	  
  });
  
};
highlightRow = function() {
	$('.portfolio td :checkbox:checked').each(
	  function() {
		  $(this).parent().parent().addClass("tint-17");
	  }
	);
	$(".portfolio td :checkbox").live("click", function(){
		$(this).parent().parent().toggleClass("tint-17");
	  });
	
}
/* for the print button functiuonality of the before buy popup */
function printBeforeBuy(){
	var divToPrint=document.getElementById('before-buy-content-ajax');
	newWin= window.open("");
	newWin.document.write(divToPrint.innerHTML);
	newWin.print();
	newWin.close();
};
/* creates tooltips on a page
function simple_tooltip(target_items, name){
	 $(target_items).each(function(i){
			$("body").append("<div class='"+name+"' id='"+name+i+"'><p>"+$(this).attr('title')+"</p></div>");
			var my_tooltip = $("#"+name+i);
			
			$(this).removeAttr("title").mouseover(function(){
					my_tooltip.css({opacity:0.9, display:"none"}).fadeIn(400);
			}).mousemove(function(kmouse){
					my_tooltip.css({left:kmouse.pageX-100, top:kmouse.pageY+15});
			}).mouseout(function(){
					my_tooltip.fadeOut(400);				  
			});
		});
	}; */

	
/* Photo gallery thumbnail overlay show hide function*/ 
FC.GalleryThumb = function() {
	opts = $('.gallery-item'); 
	opts.bind("mouseenter",
			function(){
				$(this).find(".gallery-image-full-overlay").css('display','block');
		   });
	opts.bind("mouseleave",
			function(){
				$(this).find(".gallery-image-full-overlay").css('display','none');
		   });
	 
}
/*The actual gallery functionality*/
function ImageGallery() {
	//<!-- Begin
		$('.gallery-image-dialog').dialog({
					bgiframe: true,
					autoOpen: false,
					resizable: false,
					width:550,
					modal: true
				})
		var opts = null;		
		var opts = $('.gallery-item'); 
		opts.bind('click',		
			function(){
					var htmlStr = $(this).next().html(); //set var to content of item
					$('.gallery-image-dialog').html(htmlStr); //load content into dialog
					$('.gallery-image-dialog').dialog("open"); //open dialog		
		   });
	 //-->
};	
sfActive = function() {
	var sfEls = $(".isButton");
	for (var i=0; i<sfEls.length; i++) {
		sfEls[i].onmousedown=function() {
			this.className+=" sfactive";
		}
		sfEls[i].onmouseup=function() {
			this.className=this.className.replace(new RegExp(" sfactive\\b"), "");
		}
	}
}
//outerhtml function
jQuery.fn.outerHTML = function(s) {
	return (s)
	? this.before(s).remove()
	: jQuery("<p>").append(this.eq(0).clone()).html();
	}
//get stock quote details
function getStockQuote(){
	if( typeof irxmlstockquote != 'undefined' && irxmlstockquote.length > 0 ){
	  // irxml times are in ET
	  var irxmlrows = [ {"name":'Company', "field":'ticker.companyname'},
	               {"name":'Last Trade', "field":'irxmlfunctions.formatDate(ticker.lastdatetime, "dd MMM yyyy @ HH:mm\\\\G\\\\M\\\\T")'},
	               {"name":'Price', "field":'irxmlfunctions.numberFormat(ticker.lastprice, 2)'},
	               {"name":'Change', "field":'irxmlfunctions.numberFormat(ticker.change, 2)'},
	               {"name":'Volume', "field":'irxmlfunctions.numberFormat(ticker.volume)'},
	               {"name":'Trades', "field":'irxmlfunctions.numberFormat(ticker.trades)'},
	               {"name":'Day Low', "field":'irxmlfunctions.numberFormat(ticker.low, 2)'},
	               {"name":'Day High', "field":'irxmlfunctions.numberFormat(ticker.high, 2)'},
	               {"name":'52 Week Low', "field":'irxmlfunctions.numberFormat(ticker.yearlow, 2)'},
	               {"name":'52 Week High', "field":'irxmlfunctions.numberFormat(ticker.yearhigh, 2)'}
	              ];
	  	var notLoaded = 0;
	} else {
		$('.share-updated').html('Stock quote is not available at this time.');
		var notLoaded = 1;
	  
	}
		$(document).ready(function(){
			if (notLoaded == 0) {
			var ticker = irxmlstockquote[0];
		  	var priceChange = eval(irxmlrows[3].field);
		  	if (priceChange >= 0){
				//down arrow span added
		  		$('span.price-up, span.price-down').outerHTML('<span class="price-up">&nbsp;</span>');
			}
			else{
				// up arrow span added
				$('span.price-up, span.price-down').outerHTML('<span class="price-down">&nbsp;</span>');
			};
			// update stock price
			$('.share-price').html(eval(irxmlrows[2].field)+'p');
			// update date updated
			$('.share-updated').html(eval(irxmlrows[1].field)+' (20mins delay)');
			};
	});
	};
function genericGallery(){
	//init dialog
		$('.generic-image-gallery-dialog').dialog({
					bgiframe: true,
					autoOpen: false,
					resizable: false,
					width:'auto',
					height:'auto',
					modal: true
				})
	//first content load
		var opts = null;		
		var opts = $('.gallery-item .generic-image-left a'); 
		opts.bind('click',		
			function(){
			
			$('.generic-image-gallery-dialog').dialog("close"); //close dialog
				var opts2 = null;
				var opts2 = $(this).attr('href');	
				var fullImg = $("<img>");
				fullImg.attr({
			         src: opts2,
			         alt: $(this).attr('alt')
				});
				var caption = ($(this).siblings('div.generic-image-caption').html());
				$('.generic-image-gallery-dialog .main-img').html(fullImg); //load content into dialog
				$('.generic-image-gallery-dialog .main-caption').html(caption); //load content into dialog
				$('.generic-image-gallery-dialog').dialog("open"); //open dialog
				
				
				
				var current = $('.generic-image-gallery-dialog .main-img img').attr('src');
				var imageCounter = 0;
				$('.gallery-item .generic-image-left a').each(function(index) {
					if  ($(this).attr('href') == current){
						currentIndex = index;
						prevIndex = index - 1;
						nextIndex = index + 1;	
					};
					imageCounter = index;
				});		
				
				if (currentIndex==0){
					$('a.prev').css({'display':'none'});
				}
				else {$('a.prev').css({'display':'block'});};
				
				if (currentIndex==imageCounter){
					$('a.next').css({'display':'none'});
				}
				else {$('a.next').css({'display':'block'});};
				
				return false;
		   });
		   	// Next image functionality
			var opts = null;		
			var opts = $('.generic-image-gallery-dialog a.next'); 
			opts.bind('click',		
			function(){
				var opts2 = null;
				var current = $('.generic-image-gallery-dialog .main-img img').attr('src');
				var imageCounter = 0;
				$('.gallery-item .generic-image-left a').each(function(index) {
					if  ($(this).attr('href') == current){
						currentIndex = index;
						prevIndex = index - 1;
						nextIndex = index + 1;	
					}
					imageCounter = index;
				});
				if (nextIndex<=imageCounter){
					$('a.prev').css({'display':'block'});
					var fullImg = $("<img>");			 
					fullImg.attr({
				        src: $('.gallery-item .generic-image-left a:eq('+nextIndex+')').attr('href'),
				        alt: $(this).attr('alt')
					});
					$('.generic-image-gallery-dialog .main-img').html(fullImg); //load content into dialog
					
					var caption = $('div.generic-image-caption:eq('+nextIndex+')').html();
					$('.generic-image-gallery-dialog .main-caption').html(caption); //load content into dialog
				};
				if (nextIndex == imageCounter){
					$('a.next').css({'display':'none'});
					}; 
				return false;
			});
			// Next image functionality
		   	// Prev image functionality
			var opts = null;		
			var opts = $('.generic-image-gallery-dialog a.prev'); 
			opts.bind('click',		
			function(){
				$('a.next').css({'display':'block'});
				var opts2 = null;
				
				var current = $('.generic-image-gallery-dialog .main-img img').attr('src');
				var imageCounter = 0;
				$('.gallery-item .generic-image-left a').each(function(index) {
					if  ($(this).attr('href') == current){
						currentIndex = index;
						prevIndex = index - 1;
						nextIndex = index + 1;	
					};
					imageCounter = index;
				});
				if (prevIndex>=0){
					$('a.prev').css({'display':'block'});
					var fullImg = $("<img>");			 
					fullImg.attr({
				        src: $('.gallery-item .generic-image-left a:eq('+prevIndex+')').attr('href'),
				        alt: $(this).attr('alt')
					});
					$('.generic-image-gallery-dialog .main-img').html(fullImg); //load content into dialog
					
					var caption = $('div.generic-image-caption:eq('+prevIndex+')').html();
					$('.generic-image-gallery-dialog .main-caption').html(caption); //load content into dialog
				}; 
				if (prevIndex == 0){
					$('a.prev').css({'display':'none'});
					};
				return false;
			});
};
function myCarousel(){
	  $(function() {
        var originalSizes = new Array();
        $('#pane1').jScrollHorizontalPane({showArrows:true});
        $('.scroll-to').bind('click',function(){
                        $('#pane1')[0].scrollTo(75);
                        return false;
        });
        var originalSizes = new Array();
        $('#pane2').jScrollHorizontalPane({showArrows:true});
        $('.scroll-to').bind('click',function(){
                        $('#pane2')[0].scrollTo(75);
                        return false;
        });
	  });
	 function mycarousel_initCallback(carousel){
	    carousel.buttonNext.bind('click', function() {
	        carousel.startAuto(0);
	    });
	    carousel.buttonPrev.bind('click', function() {
	        carousel.startAuto(0);
	    });
	    carousel.clip.hover(function() {
	        carousel.stopAuto();
	    }, function() {
	        carousel.startAuto();
	    });
	  };
   if($('#mycarousel').length>0){
   	    jQuery('#mycarousel').jcarousel({
   	        auto: 10,
   	        scroll:1,
   	        wrap: 'last',
   	        initCallback: mycarousel_initCallback
   	    });
   	   };
};			
 /* Open link with new-window class in a new window*/
function newWindowLink(){
  $('a.new-window').each(function() {
	  $(this).click(function(event) {
		  window.open(this.href, '_blank');
		  return false;
  	});
  	
  });
  
};

 /* Open link with new-window class in a new window*/
function newVideoWindowLink(){
  $('a.new-window-video').each(function() {
	  $(this).click(function(event) {
		  window.open(this.href, '_blank', 'left=20,top=20,width=300,height=300,toolbar=0,resizable=1,menubar=0,location=0');
		  return false;
  	});
  	
  });
  
};

/* ****************** START REDEYE MARKERS ****************************** */
function captureURLRedEye(){
	var counterName = document.location.pathname;
	var qs = document.location.search;
	var linkName;
	if (qs && qs.indexOf("link=")>=0) {
		//alert("link: " + qs.substring(qs.indexOf("link=")+5) );
		linkName = qs.substring(qs.indexOf("link=")+5);

		if (linkName.indexOf("&")>0) {
			var linkName = linkName.substring(0, linkName.indexOf("&"));
			//alert("t1: " + linkName);
		}
	}
	if(counterName.lastIndexOf(".")!=-1){
	var end = counterName.lastIndexOf(".");
	}
	else{
	var end = counterName.length;
	}
	counterName = counterName.substring(1,end);
	//counterName = counterName.replace(/[\/]/g, ".");
	if(counterName.substring(counterName.length-1)=="."){
	counterName = counterName.slice(0,counterName.length-1)
	}
	if (counterName=="") {
		counterName="homepage";
	}
	counterName = document.location.protocol+"//report.legalandgeneral.com/cgi-bin/rr.cgi/images/blank.gif?nourl=direct/"+counterName+"&norefer="+escape(window.document.referrer);
	if (linkName) {
		counterName += "\n&landg_link=" + linkName;
	}
	sitestatRedEye(counterName);
}
function sitestatRedEye(ns_l){
//ns_l+='&ns__t='+(new Date()).getTime();ns_pixelUrl=ns_l;
//ns_0=document.referrer;
//ns_0=(ns_0.lastIndexOf('/')==ns_0.length-1)?ns_0.substring(ns_0.lastIndexOf('/'),0):ns_0;
//if(ns_0.length>0)ns_l+='&ns_referrer='+escape(ns_0);
if(document.images){ns_1=new Image();ns_1.src=ns_l;}else
document.write('<img src="file:///C|/Documents and Settings/Richard/My Documents/wareabouts/htdocs/v2/resources/js/'+ns_l+'" width="1" height="1" alt="" border="0">');
//document.write("REDEYE LINK: " + ns_l);
//alert(ns_l);

}
function RedEyeTag(strTag){
	imgRedEye = new Image();
	imgRedEye.src = document.location.protocol+'//report.legalandgeneral.com/cgi-bin/rr.cgi/images/blank.gif?nourl=' + strTag;
}
/* ****************** END REDEYE MARKERS ****************************** */	 
$(document).ready(function(){
	captureURLRedEye();
	
/* Only build the survey if there is survey meta data present */

var metaCollection = document.getElementsByTagName("meta");

for (var i=0;i<metaCollection.length;i++) {
 	nameAttribute = metaCollection[i].name;
 	if (nameAttribute == 'survey') {
 		buildSurvey();
 		survey();
	}
}


	function printBeforeBuy(){
		var divToPrint=document.getElementById('before-buy-content-ajax');
		newWin= window.open("");
		newWin.document.write(divToPrint.innerHTML);
		newWin.print();
		newWin.close();
	};
	/*simple_tooltip("a.tt","tooltip");
	simple_tooltip("span.abbr","abbr-content");*/
	$("a.tt, span.abbr").qtip({
	content: {
		 text: false // Use each elements title attribute
	  },
		  position: { adjust: { screen: true } }           
	});
	
	if($(".navigation").length>0){
		FC.dropdown();
	}
	//if($('.home-feature .options, .wpb-feature .options, .landing-feature .wpb-options').length>0){	
	//	$('.options ul li,wpb-options ul li').equalHeights();
	//}
	if($('div.body-promos-3').length>0){	
		$('div.body-promos-3 div.body-promo').equalHeights();
	}
	
	if($('a.new-window').length>0){
		newWindowLink();
	}
	if($('a.new-window-video').length>0){
		newVideoWindowLink();
	}
	if($('.name-trust-details').length>0){
		FC.trustNameExpandContract();
	}
	if($('.portfolio td :checkbox').length>0){
		highlightRow();
	}
	if($('#mycarousel,#pane1,#pane2').length>0){
		myCarousel();
	}
	if($('.landing .cols-3-alt .col .panel').length>0){
		$('.landing .cols-3-alt .col .panel').equalHeights();
	}
	if($('.feat2-cols-2 .col').length>0){
		$('.feat2-cols-2 .col').equalHeights();
	}
	if($('.news-content ul').length>0){
		$('.news-content ul').equalHeights();
	}
	if($(".campaign .container .feat1-cols-2 .col").length>0){
		$('.campaign .container .feat1-cols-2 .col').equalHeights();
	}
	if($(".feat1-cols-2 .col").length>0){
		$('.feat1-cols-2 .col').equalHeights();
	}
	if($('.landing-feature .options ul li').length>0){
		$('.landing-feature .info .default').css({"margin-left":"28px"});
		$('.landing-feature .adviser-newsinfo .default').css({"margin-left":"28px"});
	}	 
	if($('.landing .feat1-cols-3 .col').length>0){
		$('.landing .feat1-cols-3 .col').equalHeights();
	}
	if($('.landing .feat1-cols-4 .col').length>0){
		$('.landing .feat1-cols-4 .col').equalHeights();
	}
	if($('.group .feat1-cols-3 .col .sub-col').length>0){
		$('.group .feat1-cols-3 .col .sub-col').equalHeights();
	}
	if($('.landing .feat2-cols-3 .col').length>0){
		$('.landing .feat2-cols-3 .col').equalHeights();
	}
	if($('.adviser-feature .feat1-cols-3 .cols-bg .col').length>0){
		$('.adviser-feature .feat1-cols-3 .cols-bg .col').equalHeights();
	}
	if($(".youraccountArea").length>0){
		var setTop = $(".youraccountArea").height() -20;
		$(".wpb-extra-options").css({"top":setTop});
	}
	if($(".search input.text").length>0){
		var searchTxt = $(".search input.text");
		searchTxt.bind("focus",function(){
			$(this).attr("value","");				
		})
	};
	$('#topsearchform').submit(function(){
		if (($('#q').val() == "" || $('#q').val() === undefined) && ($('#query').val() == "" || $('#query').val() === undefined)){ //check if it's empty
			alert('Search term can not be blank');
			return false;
		}
	});
	if($(".faq-content").length>0){
		FC.FAQ();
	}
	if($("a.plus").length>0){
		FC.utesExpandContract();
	}
	/*************************************************/
	/* added by Sonal - for FAQ show hide */
		
	if ($(".faq-item-on, .faq-item-off").length>0){
		FC.FAQGroup()
	}
	/*************************************************/
	
	if($(".product-group-title-off, .product-group-title-on").length>0){
		FC.productGroup();
	}
	if($(".news-menu").length>0){
		FC.NewsTab();
	}
	if($(".gallery-item").length>0){
		FC.GalleryThumb();
	};
	if($(".gallery-image-dialog").length>0){
		ImageGallery();
	};
	/*********** added by Sonal ************/
	$('ol[class^=numberlist-space] li').wrapInner('<span></span>')
	/***************************************/	
	if($("li.home-carousel-item").length>0){
		FC.Homefeature();
		Cufon.replace('.sifr', { fontFamily: 'univers' });
	}
	if($("li.existingCustomer").length>0){
		FC.Customer();
	}
	if($("div.extra-content-area").length>0){
		FC.extraContent();
	}
	if($(".landing-feature .options ul li").length>0){
		FC.feature();
	}
	if($(".margin .wpb-feature .options ul li").length>0){
		FC.WPBHomeFeature();
	}
	if($(".margin .landing-feature .wpb-options ul li").length>0){
		FC.WPBLandingFeature();
	}
	if($(".share-price-bar").length>0){
		getStockQuote();
	}
	if($(".generic-image-gallery-dialog").length>0){
		genericGallery();
	}
	if($(".categories").length>0){
		FC.categories();
	}
	
	if($("ul.accordian").length>0){
		FC.HPAccordian();
	}
	if($("span#date").length>0){
		FC.HPdate();
	}	
	
	// IE 6 and lower warning//
	/*$(function() { 
		if ($.browser.msie && $.browser.version.substr(0,1)<7)  {
			if ($.cookie('BrowserWarningShown')) {
			}
			else{
				var options = { path: '/', expires: 7 }; //expires in 7 days
				var BrowserWarningShown = 'BrowserWarningShown';
				$.cookie(BrowserWarningShown, 'yes', options); //set the cookie
				$("#browser-warning").dialog({ // display the dialog
					bgiframe: true,
					autoOpen: true,
					height: 350,
					width:550,
					modal: true
				});		
				$("div.button-close a").click(
					function(){
						$('#browser-warning').dialog('close');
								
					});
				return false;
			}
		}
	});*/
	$('.div.button-close a').live('click',function(){
		$('#before-buy-content').dialog('close');
        return false;
	});
	sfActive();
	Cufon.replace('.sifr, .sifrwhite, .wpb-feature ul li span, .highlight, .adviser-title, .cufon', { 
		fontFamily: 'univers'
	});
});




function scrollpage(open){
	var faqid = $("div[id^='faq']");
	var iepos;
	for (i = 0; i < faqid.length; i++) {
		if ( faqid[i].id == open.substring(1, open.length)){
			iepos = i * 10;
		}
	}
	if(navigator.appName == "Microsoft Internet Explorer") {
		if(navigator.appVersion.indexOf("8.0") > 0) {
			$('html, body').animate({scrollTop: $(open).offset().top + iepos}, 2000);
		}
		else{
			$('html, body').animate({scrollTop: $(open).offset().top}, 2000);
		}
	}
	else{
		$('html, body').animate({scrollTop: $(open).offset().top}, 2000);
	}
	$(".faq-group-shortcuts").css({'display':'block'});
}