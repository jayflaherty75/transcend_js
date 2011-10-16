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
Core._("Helpers").register ("String", new (Class.create ({
	initialize: function () {
		this.capitalize = function (str) {
			return str.replace (/(^|\s)([a-z])/g, function (m, p1, p2) {
				return p1 + p2.toUpperCase ();
			});
		};

		this.isEmail = function (str) {
		    var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

    		if (pattern.test (str)) return true;

    		return false; 
		};

		this.trim = function (str) {
			if (str.trim)
				return str.trim();
			else
				return str.replace(/(^\s*)|(\s*$)/g, "");
		};
	}
})) ());

