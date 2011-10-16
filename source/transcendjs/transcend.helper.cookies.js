//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Cookies", {
	set: function (name, value, exp_y, exp_m, exp_d, path, domain, secure) {
		var cookie_string = name + "=" + escape (value);

		if (exp_y) {
			var expires = new Date (exp_y, exp_m, exp_d);
			cookie_string += "; expires=" + expires.toGMTString ();
		}

		if (path) cookie_string += "; path=" + escape (path);
		if (domain) cookie_string += "; domain=" + escape (domain);
		if (secure) cookie_string += "; secure";

		document.cookie = cookie_string;
	},

	get: function (cookie_name) {
		var results = document.cookie.match ('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

		if (results)
			return (unescape (results[2]));
		else
			return null;
	},

	remove: function (cookie_name) {
		var cookie_date = new Date ();  // current date & time
		cookie_date.setTime (cookie_date.getTime () - 1);
		document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString ();
	}
});

