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
Core.extend ("DomIterator", "IteratorAbstract", (function () {
	var _class_name = "Array";

	var DomIterator = /** @lends DomIterator.prototype */ {
		/**
		 * @class Generic iterator for operating on child nodes of DOM Elements.
		 * @extends IteratorAbstract
		 * @constructs
		 */
		oninit: function () {
			var _index = 0;
			var _data = this.data().childNodes;
			var class_name = "Element";

			this.className (_class_name);

			this.onfirst = function () {
				_index = 0;
				return _data[_index];
			};

			this.onnext = function () {
				_index++;
				return _data[_index];
			};

			this.onref = function () {
				return _index;
			};

			this.onindex = function (index) {
				_index = index;
				return _data[_index];
			};

			this.onend = function () {
				if (_index >= _data.length)
					return true;
				else
					return false;
			};
		}
	};

	return DomIterator;
}) ());

