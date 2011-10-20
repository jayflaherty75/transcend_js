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
Core._("Helpers").register ("CSS", (function () {
	var _type = Core._("Helpers.Type");
	var CSSHelpers;

	/**
	 * @namespace Description
	 */
	CSSHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf CSSHelpers
		 * @function
		 * @param {String} selector Description
		 * @param {Number} file_index Description
		 * @return Description
		 * @type Style
		 */
		getStyle: function (selector, file_index) {
			var result = false;

			if (typeof (file_index) != "undefined") {
				var rules;

				if (document.styleSheets[file_index].cssRules)
					rules = document.styleSheets[file_index].cssRules;
				else if (document.styleSheets[file_index].rules)
					rules = document.styleSheets[file_index].rules;
				else
					rules = new Array();

	 			for (n in rules) {
	 				if (rules[n].selectorText == selector) {
						if (!rules[n].style) rules[n].style = {};

						result = rules[n].style;
					}
				}
			}
			else {
				file_index = 0;

				while (document.styleSheets[file_index] && result === false) {
					result = this.getStyle (selector, file_index++);
				}
			}

 			return result;
		}
	};

	CSSHelpers._ = CSSHelpers.getStyle;

	return CSSHelpers;
}) ());

