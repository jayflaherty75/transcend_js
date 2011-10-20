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
Core._("Helpers").register ("View", (function () {
	var _type = Core._("Helpers.Type");
	var ViewHelpers;

	/**
	 * @namespace Helper functions for support for View implementations
	 */
	ViewHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Generates iterator function to cycle through a given array.  Useful 
		 * for alternating row colors in tables or repearing patterns of data.
		 * @memberOf ViewHelpers
		 * @function
		 * @param {string} _values 
		 * @param {string} start 
		 * @param {function} func Listener function
		 * @return Returns an iterator function for the given array
		 * @type Function
		 */
		cycle: function (_values, start) {
			var _index = -1 + (start || 0);

			return function () {
				return (_values[++_index] || _values[_index = 0]);
			};
		},

		//---------------------------------------------------------------------
		/**
		 * Accepts an integer value and splits each placement into an array and
		 * returns the array.  Ex: the number 4096 would become [ 4, 0, 9, 6 ].
		 * @memberOf ViewHelpers
		 * @function
		 * @param {number} value 
		 * @return Returns an array containing values of 0-9 representing each
		 * 	placement: ones, tens, hundreds, thousands, etc.
		 * @type Array
		 */
		splitInteger: function (value) {
			var result = new Array ();

			if (value == 0)
				result.push (0);
			else
				while (value != 0) {
					result.push (value % 10);
					value = Math.floor (value / 10);
				}

			return result;
		},

		//---------------------------------------------------------------------
		/**
		 * Given a decimal value and a string length, generates a string 
		 * containing the hexadecimal representation of the value, padding the 
		 * remaining length with zeroes.
		 * @memberOf ViewHelpers
		 * @function
		 * @param {string} value 
		 * @param {string} length 
		 * @param {function} func Listener function
		 * @return Returns a formatted hexidecimal representation of the given
		 * 	decimal value.
		 * @type String
		 */
		formatHex: function (value, length) {
			var output = value.toString (16);

			while (output.length < length) {
				output = "0" + output;
			}

			return output;
		},

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @memberOf ViewHelpers
		 * @function
		 * @param {string} value The string to be repeated
		 * @param {string} count Number of times to repeat the string
		 * @return Returns a string containing the repeated first argument
		 * @type string
		 */
		stringRepeat: function (value, count) {
			var values = new Array ();

			for (var i = 0; i < count; i++) values.push(value);

			return values.join ("");
		},

		//---------------------------------------------------------------------
		/**
		 * Converts an RGB-based string (format: rgb (255, 255, 255)) into a
		 * hexadecimal color value (format: #FFFFFF).
		 * @memberOf ViewHelpers
		 * @function
		 * @param {string} color RGB String
		 * @return Returns a string containing the hexadecimal color 
		 * 	representation
		 * @type string
		 */
		rgbToHex: function (color) {
			if (color.substr(0, 1) != '#') {
				var padding = "";
				var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

				var red = parseInt(digits[2]);
				var green = parseInt(digits[3]);
				var blue = parseInt(digits[4]);
				var rgb = blue | (green << 8) | (red << 16);

				color = digits[1] + rgb.toString(16);
				for (var i = 0; i < 6 - color.length; i++) {
					padding += "0";
				}
				color = "#" + padding + color;
			}

			return color;
		},

		//---------------------------------------------------------------------
		/**
		 * Recursively builds the position of an element relative to the 
		 * document root or, if an element ID is provided, to the respective 
		 * element.
		 * @memberOf ViewHelpers
		 * @function
		 * @param {Element} Element object for the position request
		 * @param {string} Optional.  The ID of a root element for a relative 
		 * 	position. 
		 * @return Returns an array [x, y] containing the position of the 
		 * 	element.
		 * @type Array
		 */
		findPosition: function (obj, root) {
			var curleft = 0, curtop = 0;

			if (obj.offsetParent) {
				root = root || "app_frame";

				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
					obj = obj.offsetParent;
				} while (obj && obj.id != root);
			}

			return [curleft,curtop];
		}
	};

	//ViewHelpers._ = ViewHelpers.method;

	return ViewHelpers;
}) ());

