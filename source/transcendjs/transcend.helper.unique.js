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
Core._("Helpers").register ("Unique", new (Class.create ({
	initialize: function () {
		var uid = Math.floor (Math.random () * 256);

		this.simple = function () {
			return ++uid;
		};

		this.hex = function () {
			return "h" + Core._("Helpers.View").formatHex (this.simple (), 8);
		};

		this.global = function () {
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
		}.bind (this);

		this._ = this.global;
	}
})) ());

