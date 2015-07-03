try{
    // Read cookie.
    function ck(param){
        var c = document.cookie;
		var s = param+"=";
		return (c.indexOf(s) == -1) ? "" : unescape(c.substring(c.indexOf(s)+s.length,c.indexOf("|",c.indexOf(s))));
	}
    
    // Create cookie.
    function createCk(val){
		var ckVals = [];
		for(var key in val){ ckVals.push(key +"="+ escape(val[key].replace(/^\s+|\s+$/g,""))) }
		document.cookie = ckVals.join("|") +"|; path=/";
	}
    
    // Delete cookie
	function deleteCk(name) {
		if(document.cookie.indexOf(name) > -1) document.cookie = name + "=; expires=" + new Date(0).toUTCString() + "; path=/;";
	}
}catch(err){(window.console) ? console.log("Error: " + err.message) : window.st_funcError = err.message}