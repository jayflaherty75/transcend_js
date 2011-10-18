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
Core._("Helpers").register ("CSS", new (Class.create ({
	initialize: function () {
		this.getStyle = function (selector, file_index) {
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
		};

		this._ = this.getStyle;
	}
})) ());

