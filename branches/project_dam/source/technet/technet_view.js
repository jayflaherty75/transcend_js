
//-----------------------------------------------------------------------------
/**
 * @fileoverview View class that may be extended to a child class containing
 * 	logic for rendering a module.  This class may directly render the page or
 * 	make use of {@link Template} objects.  Implements a default TemplateView
 * 	for this purpose as well as ViewHelpers for miscellaneous formatting
 *  functions.
 * 	<br /><br />
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("View", "Container", /** @lends View */ (function () {
	/**
	 * @class View class that may be extended to a child class containing
	 * 	logic for rendering a module.
	 * @constructs
	 */
	var oninit =  function () {
		this.engine = Core._("Property");
	};

	//-------------------------------------------------------------------------
	/**
	 * For views utilizing templates, returns the template.
	 * @name View#getEngine
	 * @function
	 * @return Returns the Template object being used by the View
	 * @type Template
	 */
	//var get_engine = function () {
	//	if (Object.isFunction (this.onengine))
	//		return this.onengine ();
	//	else
	//		return null;
	//};

	//-------------------------------------------------------------------------
	/**
	 * Calls <i>onprerender()</i>, <i>onrender()</i> and <i>onpostrender()</i>
	 * of the View instance.
	 * @name View#render
	 * @function
	 * @return Returns any data returned by the <i>onrender()</i> handler.
	 * @type Any
	 */
	var render = function (parent) {
		var result;
		if (Object.isFunction (this.onprerender)) this.onprerender (parent);
		if (Object.isFunction (this.onrender))
			result = this.onrender (parent);
		if (Object.isFunction (this.onpostrender))
			result = this.onpostrender (result);

		return result;
	};

	return {
		oninit: oninit,
		//getEngine: get_engine,
		render: render
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("TemplateView", "View", /** @lends TemplateView# */ (function () {
	/**
	 * @class Default view providing integration with {@link Template} 
	 * 	instances.
	 * @extends View
	 * @constructs
	 * @param {object} template Template data
	 * @param {object} parent Target location of data.  For templates using the
	 *  DOM Context, this would be the Element containing the output.
	 * @param {Context} context Context object describing the method of
	 * 	interpretation of the template data.
	 * @return TemplateView
	 */
	var oninit = function (template, _parent, context) {
		var _context = Core._("NodeContext");
		var _model = Core._("DomModel");
		var _engine = Core._("Template", _context);

		_engine.model (_model);

		this.engine (_engine);

		//---------------------------------------------------------------------
		/**
		 * Once rendered, accesses the element with the given id.  If more than
		 * one element is found, an array of elements is passed.
		 * @name TemplateView#getElement
		 * @function
		 * @param {string} id 
		 * @return Returns the element for this given id.  Returns an array of
		 * 	elements if there is more than one result.
		 * @type Element
		 */
		this.getElement = function (id) { return _engine._(id); };

		//---------------------------------------------------------------------
		/**
		 * Handles requests for the tample from the base class.
		 * @name TemplateView#ontemplate
		 * @function
		 * @return Returns the Template being used by the current View
		 * @type Template
		 */
		//this.ontemplate = function () { return _engine; };

		//---------------------------------------------------------------------
		/**
		 * Handles assigned values for the base class.
		 * @name TemplateView#onset
		 * @function
		 * @param {string} key 
		 * @param {string} value 
		 */
		this.onset = _engine.onset.bind (_engine);

		//---------------------------------------------------------------------
		/**
		 * Handles requests for values from the base class.
		 * @name TemplateView#onget
		 * @function
		 * @param {string} key 
		 * @return Returns the value from the given key.
		 * @type Any
		 */
		this.onget = _engine.onget.bind (_engine);

		//---------------------------------------------------------------------
		this.isset = _engine.isset.bind (_engine);

		//---------------------------------------------------------------------
		/**
		 * Handles requests to delete values from the base class.
		 * @name TemplateView#onunset
		 * @function
		 * @param {string} key 
		 * @return Returns the deleted value from the given key.
		 * @type Any
		 */
		this.onunset = _engine.onunset.bind (_engine);

		//---------------------------------------------------------------------
		/**
		 * Handles call to render the template.
		 * @name TemplateView#onrender
		 * @function
		 * @return Returns an array of elements generated by the template
		 * @type Array
		 */
		this.onrender = function (parent) {
			_result = _engine.apply (template, parent || _parent);

			return _result;
		};

		this._ = this.getElement;
	};

	//-------------------------------------------------------------------------
	/*
	 * Once rendered, accesses the element with the given id.  If more than
	 * one element is found, an array of elements is passed.
	 * @name TemplateView#getElement
	 * @function
	 * @param {string} id 
	 */
	//getElement: function (id) { this.getTemplate()._(id); }
	return {
		oninit: oninit
	};
}) ());

//-----------------------------------------------------------------------------
Core._("Helpers").register ("View", /** @lends ViewHelpers# */ {
	/**
	 * @class Helper functions for support for View implementations
	 */
	//-------------------------------------------------------------------------
	/**
	 * Generates iterator function to cycle through a given array.  Useful for
	 * alternating row colors in tables or repearing patterns of data.
	 * @name ViewHelpers#cycle
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

	//-------------------------------------------------------------------------
	/**
	 * Accepts an integer value and splits each placement into an array and
	 * returns the array.  Ex: the number 4096 would become [ 4, 0, 9, 6 ].
	 * @name ViewHelpers#splitInteger
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

	//-------------------------------------------------------------------------
	/**
	 * Given a decimal value and a string length, generates a string containing
	 * the hexadecimal representation of the value, padding the remaining length
	 * with zeroes.
	 * @name ViewHelpers#formatHex
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

	//-------------------------------------------------------------------------
	/**
	 * 
	 * @name ViewHelpers#stringRepeat
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

	//-------------------------------------------------------------------------
	/**
	 * Converts an RGB-based string (format: rgb (255, 255, 255)) into a
	 * hexadecimal color value (format: #FFFFFF).
	 * @name ViewHelpers#rgbToHex
	 * @function
	 * @param {string} color RGB String
	 * @return Returns a string containing the hexadecimal color representation
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

	//-------------------------------------------------------------------------
	/**
	 * Recursively builds the position of an element relative to the document
	 * root or, if an element ID is provided, to the respective element.
	 * @name ViewHelpers#findPosition
	 * @function
	 * @param {Element} Element object for the position request
	 * @param {string} Optional.  The ID of a root element for a relative position. 
	 * @return Returns an array [x, y] containing the position of the element.
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
});

