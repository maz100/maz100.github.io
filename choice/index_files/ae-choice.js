jQuery().ready(
		function() {

			/* Tooltips for div tt */
			$("div.tt").qtip({
				content : {
					text : false
				// Use each elements title attribute
				},
				position : {
					adjust : {
						screen : true
					},
					corner : {
						target : 'center',
						tooltip : 'bottomLeft'
					}
				}
			});

			/* Allow buttons to have tool tips */
			$("button.tt").qtip({
				content : {
					text : false
				// Use each elements title attribute
				},
				position : {
					adjust : {
						screen : true
					}
				}
			});

			/* Create configurable Qtips */
			$('.qtipt').each(function(idx, elem) {
				$(this).qtip({
					position : {
						corner : {
							target : $(this).attr('target'),
							tooltip : $(this).attr('tooltip')
						}
					}
				});
			});

			/* Undo some stuff we dont need anymore */
			$('.normal-links a').css({
				"background" : "none",
				"color" : "#333"
			});

			/* Close Chevron functionality */
			$(".left .close-flyout").unbind("click").click(
					function() {
						$(".info .default").removeClass("default");
						$("li.selected").removeClass("selected");
						$('.portfolio-options .selected-item').removeClass(
								"selected-item");
						$(".info .default-panel").addClass("default");
						return false;
					});

			/* uncheck all checkboxes */
			/* $(":checkbox").attr('checked', false); */

			/*
			 * allow checkbox in header or footer to select or deselect all
			 * checkboxes
			 */
			$(".portfolio th :checkbox, .portfolio tfoot td :checkbox").bind(
					"click", function() {
						$(".checkbox").attr('checked', $(this).is(':checked'));
					});

			/* Fix IE7 z-Index issues */
			if ($.browser.msie) {
				var zIndexNumber = 1000;
				$('div').each(function() {
					$(this).css('zIndex', zIndexNumber);
					zIndexNumber -= 10;
				});
			}

			$('.tabbed_selectors li').bind('click', function() {
				$('.tabbed_selectors li').removeClass("selected");
				$(this).addClass("selected");
				$('.tabbed_table table').addClass("hidden");
				$('.' + $(this).attr('id')).removeClass("hidden");
			});

			$.fn.focusNextInputField = function() {
				return this.each(function() {
					var fields = $(this).parents('form:eq(0),body').find(
							'button,input,textarea,select');
					var index = fields.index(this);
					if (index > -1 && (index + 1) < fields.length) {
						fields.eq(index + 1).focus();
					}
					return false;
				});
			};
		});
