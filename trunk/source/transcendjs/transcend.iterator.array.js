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
Core.extend ("ArrayIterator", "IteratorAbstract", (function () {
	var _class_name = "Array";

	var ArrayIterator = /** @lends ArrayIterator.prototype */ {
		/**
		 * @class Generic iterator for operating on common JavaScript Arrays.
		 * @extends IteratorAbstract
		 * @constructs
		 */
		oninit: function () {
			var _index = 0;
			var class_name = "array";

			this.className (_class_name);

			this.onfirst = function () {
				_index = 0;
				return this.data()[_index];
			};

			this.onnext = function () {
				_index++;
				return this.data()[_index];
			};

			this.onref = function () {
				return _index;
			};

			this.onindex = function (index) {
				_index = index;
				return this.data()[_index];
			};

			this.onend = function () {
				if (_index >= this.data().length)
					return true;
				else
					return false;
			};
		}
	};

	return ArrayIterator;
}) ());

