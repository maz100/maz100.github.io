(function(){
	//var closeHelpLink = '<a href="#" onclick="allHelps.hide(); return false;"><img src="../web_resources/secure/choice/images/btns/default-common-helpclose.png" alt="close"/></a>';
	var splitInputRegex = new RegExp('.*(SplitDD|SplitMM|SplitYY).*');
	
	var getHelpHeight = function(element) {
		var result;
		if (element.is(':visible')) {
			result = element.height();
		} else {
			element.show();
			result = element.height();
			element.hide();
		}
		return result;
	};
	
	window.allHelps = $('.questionhelp:parent');
	
	window.showHelp = function(name) {
		
		var HELP_DISTANCE = 10;
		
		$('.helpPointer').hide();
		
		allHelps.each(function() {
			var wording = $(this);
			if (splitInputRegex.exec(name)) {
				var nameLength = name.length;
				name = name.substring(0, nameLength - 7);
			}
			if (wording.hasClass(name) && wording.siblings('.questionhelptrigger').html().length != "") {
				var height = getHelpHeight(wording);
				var questionTop = $('#' + name + 'Container').offset().top;
				var footTop = $('#footer').offset().top;
				var top = -height + height;// + 7;
				var bottom = top - height;
				var absHelpTop = questionTop + top;
				var absHelpBottom = absHelpTop + height;
				if (absHelpBottom > footTop - HELP_DISTANCE) {
					top = -height + footTop - questionTop - HELP_DISTANCE;
				}
				var headerBottom = $('#header').height();
				if (absHelpTop < headerBottom + HELP_DISTANCE) {
					top = headerBottom - questionTop + HELP_DISTANCE;
				}
				//	wording.children('.closeHelp').html(closeHelpLink);
				var docViewTop = $(window).scrollTop();
				var docViewLeft = $(window).scrollLeft() + 'px';
				var docViewBottom = docViewTop + $(window).height();
				if (absHelpTop - HELP_DISTANCE < docViewTop) {
					var scrollToTop = absHelpTop - HELP_DISTANCE + 'px';
					$(document).scrollTo({
						top : scrollToTop,
						left : docViewLeft
					}, 800);
				} else if (absHelpBottom + HELP_DISTANCE > docViewBottom) {
					var scrollToTop = absHelpTop + HELP_DISTANCE + height - $(window).height() + 'px';
					$(document).scrollTo({
						top : scrollToTop,
						left : docViewLeft
					}, 800);
				}
				var helpPointerLeft = $('#' + name + 'Container').children('.questionhelptrigger').position().left+ $('#' + name + 'Container').children('.questionhelptrigger').width();
				var left = helpPointerLeft	+ $('#' + name + 'Container').children('.helpPointer').width();
				$('#' + name + 'Container').children('.helpPointer').css('left', helpPointerLeft);
				wording.css('top', top);
				wording.css('left', left);
				CdlUtils.show(wording);
				$('#' + name + 'Container .helpPointer').fadeIn('fast');
			} else {
				CdlUtils.hide(wording);
			}
		});
	};
	
	$(document).ready(function() {
	    $('.questionhelptrigger').after('<div class="helpPointer" />');
		$('input:[type="radio"]').mousedown(function() {
			this.focus();
		});
		var inputFocus = function() {
			var questionInput = $(this);
			if (questionInput) {
				if (questionInput.attr("type")) {
					if (!$.browser.msie	|| questionInput.attr("type").toUpperCase() != "RADIO") {
						questionInput.addClass("focus");
					}
					if (questionInput.attr("type").toUpperCase() == "RADIO") {
						questionInput.parent().parent().parent().parent().addClass("focus");
					} else {
						questionInput.parent().parent().addClass("focus");
					}
				} else {
					if (!$.browser.msie) {
						questionInput.addClass("focus");
					} else {
						questionInput.parent().parent().addClass("focus");
					}
				}
			}
			return true;
		};
		
		var inputBlur = function() {
			var questionInput = $(this);
			if (questionInput.attr("type")) {
				if (!$.browser.msie	|| questionInput.attr("type").toUpperCase() != "RADIO") {
					questionInput.removeClass("focus");
				}
				if (questionInput.attr("type").toUpperCase() == "RADIO") {
					questionInput.parent().parent().parent().parent().removeClass("focus");
				} else {
					questionInput.parent().parent().removeClass("focus");
				}
			} else {
				if (!$.browser.msie) {
					questionInput.removeClass("focus");
				} else {
					questionInput.parent().parent().removeClass("focus");
				}
			}
			return true;
		};
		
		var fields;
		
		if ($.browser.msie && $.browser.version < 8) {
			$("select").bind("focusin", inputFocus);
			$("input:text, input:radio, input:password").focus(inputFocus);
			fields = $("input:text,input:radio,select,input:password");
		} else {
			fields = $("input:text,input:password,input:radio,input:checkbox,select");
			fields.focus(inputFocus);
		}
		
		fields.blur(inputBlur);
		
		var containers = $(".questionhelptrigger:parent");
		containers.each(function(i) {
			var triggercontainer = $(this);
			var link = $("a", triggercontainer);
			var content = link.html();
			var questioncontainerid = this.parentNode.id;
			var index = questioncontainerid.lastIndexOf("Container");
			var helpId = questioncontainerid.substring(0, index);
			triggercontainer.html("<a href='#' onfocus='showHelp(\""+ helpId+ "\"); this.focused=true; return true;' onclick='if(!this.focused) $(this).focus(); return false;' onblur='this.focused=false;return false;'>"	+ content + "</a>");
		});
	});
	
	function CdlUtils() {
	}
	
	CdlUtils.show = function(element) {
		element.animate({"height" : "show", "opacity" : "show"}, "normal");
	};
	CdlUtils.hide = function(element) {
		if (element.is(':visible')) {
			element.animate({ "height" : "hide", "opacity" : "hide"}, "normal");
		} else {
			element.hide();
		}
	};
})();