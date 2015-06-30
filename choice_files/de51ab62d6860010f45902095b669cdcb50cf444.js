(function(){
    try {
		if(typeof $().live != "undefined"){
			$("a").live("mousedown", function(){
				var choice = bt_cookie("LG_ST_Privacy");
				if(choice) choice = (/1|true/i.test(choice)) ? "false" : "true";
				else choice = "false";
	
				var href = this.href;
				if(/legalandgeneral\-over50|targetApp\=COLA|securelegalandgeneral/i.test(href)){
					if(/cookieOptOut=(true|false)/.test(href))
						this.href = href.replace(/cookieOptOut=(true|false)/, "cookieOptOut=" + choice);
					else
						this.href += ((/\?/.test(href)) ? "&" : "?") + "cookieOptOut=" + choice;
				}
			}); 
		}
	}
	catch(err){(window.console) ? console.log("Error: " + err.message) : window.st_funcError = err.message}
})();