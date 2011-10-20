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
Core._("Helpers").register ("Unique", (function () {
	var _type = Core._("Helpers.Type");
	var uid = Math.floor (Math.random () * 256);
	var UniqueHelpers;

	/**
	 * @namespace Description
	 */
	UniqueHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf UniqueHelpers
		 * @function
		 * @return Description
		 * @type number
		 */
		simple: function () {
			return ++uid;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf UniqueHelpers
		 * @function
		 * @return Description
		 * @type String
		 */
		hex: function () {
			return "h" + Core._("Helpers.View").formatHex (this.simple (), 8);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf UniqueHelpers
		 * @function
		 * @return Description
		 * @type String
		 */
		global: function () {
			if (__SYSTEM_USERADDRESS__) {
				var format_hex = Core._("Helpers.View").formatHex;
				var d = new Date ();
				var ipaddress = __SYSTEM_USERADDRESS__.split (".");
				var output = [
					format_hex (parseInt (ipaddress[0]), 2),
					format_hex (parseInt (ipaddress[1]), 2),
					format_hex (parseInt (ipaddress[2]), 2),
					format_hex (parseInt (ipaddress[3]), 2),
					format_hex (d.getFullYear (), 3),
					format_hex (d.getMonth (), 1),
					format_hex (d.getDate (), 2),
					format_hex (d.getHours (), 2),
					format_hex (d.getMinutes (), 2),
					format_hex (d.getSeconds (), 2),
					format_hex (d.getMilliseconds (), 3),
					format_hex (Math.floor (Math.random () * 65536), 4),
					format_hex (this.simple(), 4)
				];

				return output.join ("");
			}
			else {
				return false;
			}
		}
	};

	UniqueHelpers._ = UniqueHelpers.global;

	return UniqueHelpers;
}) ());

