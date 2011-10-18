//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Array", (function () {
	var _type = Core._("Helpers.Type");
	var flatten;

	flatten = function (source) {
		var result = [];

		for (var i = 0; i < source.length; i++) {
			result = result.concat (
				_type.isArray (source[i]) ? flatten (source[i]) : source[i]
			);
		}

		return result;
	};

	return {
		flatten: flatten
	};
}) ());

