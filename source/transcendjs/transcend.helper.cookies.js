//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core._("Helpers").register ("Cookies", (function () {
	var _type = Core._("Helpers.Type");
	var CookieHelpers;

	/**
	 * @namespace Description
	 */
	CookieHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf CookieHelpers
		 * @function
		 * @param {String} name Description
		 * @param {String} value Description
		 * @param {Number} exp_y Description
		 * @param {Number} exp_m Description
		 * @param {Number} exp_d Description
		 * @param {String} path Description
		 * @param {String} domain Description
		 * @param {String} secure Description
		 * @return Description
		 * @type boolean
		 */
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

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf CookieHelpers
		 * @function
		 * @param {String} cookie_name Description
		 * @return Description
		 * @type String
		 */
		get: function (cookie_name) {
			var results = document.cookie.match ('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

			if (results)
				return (unescape (results[2]));
			else
				return null;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf CookieHelpers
		 * @function
		 * @param {String} cookie_name Description
		 */
		remove: function (cookie_name) {
			var cookie_date = new Date ();  // current date & time
			cookie_date.setTime (cookie_date.getTime () - 1);
			document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString ();
		}
	};

	return CookieHelpers;
}) ());

