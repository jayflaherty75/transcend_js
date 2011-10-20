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
Core._("Helpers").register ("String", (function () {
	var _type = Core._("Helpers.Type");
	var StringHelpers;

	/**
	 * @namespace Description
	 */
	StringHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf StringHelpers
		 * @function
		 * @param {String} str Description
		 * @return Description
		 * @type String
		 */
		capitalize: function (str) {
			return str.replace (/(^|\s)([a-z])/g, function (m, p1, p2) {
				return p1 + p2.toUpperCase ();
			});
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf StringHelpers
		 * @function
		 * @param {String} str Description
		 * @return Description
		 * @type boolean
		 */
		isEmail: function (str) {
		    var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

    		if (pattern.test (str)) return true;

    		return false; 
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf StringHelpers
		 * @function
		 * @param {String} str Description
		 * @return Description
		 * @type String
		 */
		trim: function (str) {
			if (str.trim)
				return str.trim();
			else
				return str.replace(/(^\s*)|(\s*$)/g, "");
		}
	};

	//StringHelpers._ = StringHelpers.method;

	return StringHelpers;
}) ());

