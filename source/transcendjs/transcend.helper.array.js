//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Array", (function () {
	var _type = Core._("Helpers.Type");
	var ArrayHelpers;

	/**
	 * @namespace Description
	 */
	ArrayHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf ArrayHelpers
		 * @function
		 * @param {Array} source Description
		 * @return Description
		 * @type Array
		 */
		flatten: function (source) {
			var result = [];

			for (var i = 0; i < source.length; i++) {
				result = result.concat (
					_type.isArray (source[i]) ? 
						ArrayHelpers.flatten (source[i]) : 
						source[i]
				);
			}

			return result;
		}
	};

	return ArrayHelpers;
}) ());

