//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("Container", "ContainerAbstract", (
/**
 * @class Basic container providing a generic interface for assigning
 * 	values to objects.
 * @constructs
 */
function () {
	var _type = Core._("Helpers.Type");

	//---------------------------------------------------------------------
	/**
	 * Description.
	 * @name Container#oninit
	 * @function
	 */
	var oninit = function () {
		this.parameters = {};
	};

	//---------------------------------------------------------------------
	/**
	 * Handles assigned values for the base class.
	 * @name Container#onset
	 * @function
	 * @param {string} key 
	 * @param {string} value 
	 */
	var onset = function (key, value) { this.parameters[key] = value; };

	//---------------------------------------------------------------------
	/**
	 * Description.
	 * @name Container#isset
	 * @function
	 * @param {string} key 
	 */
	var isset = function (key) {
		return _type.isDefined (this.parameters[key]);
	}; 

	//---------------------------------------------------------------------
	/**
	 * Handles requests for values from the base class.
	 * @name Container#onget
	 * @function
	 * @param {string} key 
	 * @return Returns the value from the given key.
	 * @type Any
	 */
	var onget = function (key) {
		if (!_type.isUndefined (key))
			return this.parameters[key];
		else
			return false;
	};

	//---------------------------------------------------------------------
	/**
	 * Description
	 * @name Container#onkeys
	 * @function
	 * @return Returns an array of existing keys from the local container.
	 * @type Array|false
	 */
	var onkeys = function () {
		var set = new Array ();

		for (key in this.parameters) {
			set.push (key);
		}

		return set;
	};

	//---------------------------------------------------------------------
	/**
	 * Handles requests to delete values.  If no key is passed, all values
	 * are cleared.
	 * @name Container#onunset
	 * @function
	 * @param {string} key 
	 * @return Returns the deleted value from the given key.
	 * @type Any
	 */
	var onunset = function (key) {
		if (!_type.isUndefined (key))
			delete this.parameters[key];
	};

	//---------------------------------------------------------------------
	/**
	 * 
	 * @name Container#oncopy
	 * @function
	 * @param {Container} dest 
	 */
	var oncopy = function (dest) {
		dest.assign (this.parameters);
	};

	return {
		parameters:		false,
		oninit:			oninit,
		onset:			onset,
		isset:			isset,
		onget:			onget,
		onunset:		onunset,
		oncopy:			oncopy
	};
}) (),
{
	//--------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Container#test
	 * @function
	 * @return true on pass, false on fail
	 * @type boolean
	 */
	test: function () {
		var _type = Core._("Helpers.Type");
		var c1 = Core._("Container");
		var c2 = Core._("Container");
		var c3 = Core._("Container");
		var test1, test2, test3, message;
		var result = true;

		c2.link (c1);

		c1.assign ({ a: 1, b: 2, c: 3, d: 4 });
		c2.assign ({ b: 5, d: 6, e: 7, f: 8 });
		c3.assign ({ a: 9, b: 10, g: 11, h: 12 });

		c3.link (c2);

		test1 = "Result: " + c1.get ("a") + c1.get ("b") + c1.get ("c") + 
			c1.get ("d") + c1.get ("e") + c1.get ("f");
		test2 = "Result: " + c2.get ("a") + c2.get ("b") + c2.get ("c") + 
			c2.get ("d") + c2.get ("e") + c2.get ("f");
		test3 = "Result: " + c3.get ("a") + c3.get ("b") + c3.get ("c") + 
			c3.get ("d") + c3.get ("e") + c3.get ("f") + c3.get ("g") + 
			c3.get ("h");

		if (test1 != "Result: 1536undefinedundefined") {
			if (console && _type.isDefined (console.log)) {
				console.log ("Regression test #1 failed: " + test1);
			}
			result = false;
		}

		if (test2 != "Result: 153678") {
			if (console && _type.isDefined (console.log)) {
				console.log ("Regression test #2 failed: " + test2);
			}
			result = false;
		}

		if (test3 != "Result: 91036781112") {
			if (console && _type.isDefined (console.log)) {
				console.log ("Regression test #3 failed: " + test3);
			}
			result = false;
		}

		return result;
	}
});



