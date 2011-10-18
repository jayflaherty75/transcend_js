//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("ObjectIterator", "IteratorAbstract", /** @lends HashIterator */ (function () {
	var _class_name = "Object";

	/**
	 * @class Generic iterator for operating on common associative arrays/objects.
	 * @extends IteratorAbstract
	 * @constructs
	 */
	var oninit = function () {
		var _index = 0;
		var _keys = new Array (); // = $H(this.data ()).keys ();
		var _is_value = function (value) {
			if (typeof (value) != "function" && !(value instanceof Core.getClass ("ModelAbstract"))) {
				return true;
			}
			return false;
		};

		$H(this.data ()).each (function (pair) {
			if (_is_value (pair.value)) _keys.push (pair.key);
		});

		this.className (_class_name);

		this.onfirst = function () {
			_index = 0;
			return this.data()[_keys[_index]];
		};

		this.onnext = function () {
			_index++;
			return this.data()[_keys[_index]];
		};

		this.onref = function () {
			return _keys[_index];
		};

		this.onindex = function (index) {
			_index = index;
			return this.data()[_keys[_index]];
		};

		this.onend = function () {
			if (_index >= _keys.length) {
				return true;
			}
			else {
				return false;
			}
		};
	};

	return {
		oninit: oninit
	};
}) ());

