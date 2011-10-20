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
Core._("Helpers").register ("QueryString", (function () {
	var _type = Core._("Helpers.Type");
	var QueryStringHelpers;
	var qstr = window.location.search.substring (1);
	var entries = qstr.split ("&");
	var entry, key;
	var pairs = {};

	for (var i = 0; i < entries.length; i++) {
		entry = entries[i].split ("=");
		key = entry[0];

		if (Object.isUndefined (pairs[key]))
			pairs[key] = entry[1];
		else if (Object.isArray (pairs[key]))
			pairs[key].push (entry[1]);
		else
			pairs[key] = new Array (pairs[key], entry[1]);
	}

	//-------------------------------------------------------------------------
	/**
	 * @namespace Description
	 */
	QueryStringHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf QueryStringHelpers
		 * @function
		 * @param {String} key Description
		 * @return Description
		 * @type String
		 */
		getAll: function (key) {
			return Object.clone (pairs);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf QueryStringHelpers
		 * @function
		 * @param {String} key Description
		 * @return Description
		 * @type String
		 */
		get: function (key) {
			return pairs[key];
		}
	};

	QueryStringHelpers._ = QueryStringHelpers.get;

	return QueryStringHelpers;
}) ());

