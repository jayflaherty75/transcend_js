
//-----------------------------------------------------------------------------
/**
 * @fileoverview Defines a container class providing an interface for setting
 * 	arbitrary properies of objects.<br /><br />
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		Jason K. Flaherty coderx75@hotmail.com
 */

//-----------------------------------------------------------------------------
Core.register ("ContainerAbstract",  /** @lends Container */ (function () {
	/**
	 * @class Basic container providing a generic interface for assigning
	 * 	values to objects.
	 * @constructs
	 */
	var _type = Core._("Helpers.Type");

	var initialize = function () {
		var result;

		this.link = Core._ ("Property");

		if (_type.isFunction (this.onpreinit))
			this.onpreinit.apply (this, arguments);

		if (_type.isFunction (this.oninit)) {
			result = this.oninit.apply (this, arguments);

			if (_type.isFunction (this.onpostinit))
				result = this.onpostinit (result);

			if (_type.isDefined (result)) return result;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Traverses a chain of containers and returns the container that contains
	 * the given key.
	 * @name ContainerAbstract#find_key
	 * @function
	 * @private
	 * @param {Container} container
	 * @param {string} key
	 * @return Returns the container in which the key was found or false if
	 * 	not found
	 * @type Container or boolean
	 */
	var find_key = function (container, key) {
		if (_type.isFunction (container.isset)) {
			if (container.isset (key)) return container;
		}

		if (_type.isDefined (container.link)) {
			container = container.link ();

			if (container) return find_key (container, key);
		}

		return false;
	};

	//-------------------------------------------------------------------------
	/**
	 * Assigns a value to a given key.  This is handled by the <i>onset()</i>
	 * handler of the Interpreter instance.  If linked to another container,
	 * will check each container in the chain for the existence of the key
	 * and set that key if it exists.  If it does not exist, creates the key
	 * in the current container.  Multiple keys may be set at once by passing
	 * an object (as a hash containing key/value pairs) on the first parameter.
	 * Rules for linked containers applies to each individually.
	 * @name ContainerAbstract#assign
	 * @function
	 * @param {string} key
	 * @param {any} value
	 * @return Returns this object for use in chain calls
	 * @type Container
	 */
	var assign = function (key, value) {
		if (_type.getType (key) == "Object") {
			//First parameter is a set of key value pairs so recursively
			//call assign() for each
			$H(key).each (function (pair) {
				this.assign (pair.key, pair.value);
			}.bind (this));
		}
		else {
			//Check for linked containers and traverse entire chain to
			//find if key exists and assign it if it does
			var container = find_key (this, key) || this;

			if (_type.isFunction (container.onset)) {
				container.onset (key, value);
			}
		}

		return this;
	};

	//-------------------------------------------------------------------------
	/**
	 * Checks if a given key exists.  Triggers the <i>isset()</i> method of the
	 * Interpreter instance.
	 * @name ContainerAbstract#exists
	 * @function
	 * @param {string} key 
	 * @return Return true if a value exists for the given key, false if not
	 * 	and undefined if the isset method does not exists.
	 * @type boolean
	 */
	var exists = function (key) {
		var result;

		if (_type.isFunction (this.isset))
			result = this.isset (key);
		if (result === false && !_type.isUndefined (this.link)) {
			var link = this.link ();
			result = link.exists (key);
		}

		return result;
	};

	//-------------------------------------------------------------------------
	/**
	 * Gets the value from the given key.  Triggers the <i>onget()</i> handler of the
	 * Interpreter instance.
	 * @name ContainerAbstract#get
	 * @function
	 * @param {string} key 
	 * @return Returns any value assign to the given key or undefined if
	 * 	not found.
	 * @type Any
	 */
	var get = function (key) {
		var value;

		if (_type.isFunction (this.onget))
			value = this.onget (key);
		if (_type.isUndefined (value) && !_type.isUndefined (this.link)) {
			var link = this.link ();
			if (link) value = link.get (key);
		}

		return value;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name ContainerAbstract#keys
	 * @function
	 * @return Array containing set of local keys (does not include linkages) 
	 * @type Array|false
	 */
	var keys = function () {
		if (_type.isFunction (this.onkeys))
			return this.onkeys ();

		return false;
	};

	//-------------------------------------------------------------------------
	/**
	 * Deletes the value from the given key.  Triggers the <i>onunset()</i> handler
	 * of the Interpreter instance
	 * @name ContainerAbstract#clear
	 * @function
	 * @param {string} key 
	 * @return Returns the deleted value from the given key or undefined if
	 * 	not found.
	 * @type Any
	 */
	var clear = function (key) {
		var container = find_key (this, key) || this;

		if (_type.isFunction (container.onunset))
			return container.onunset (key);
	};

	//-------------------------------------------------------------------------
	/**
	 * 
	 * @name ContainerAbstract#copy
	 * @function
	 * @return 
	 * @type object
	 */
	var copy = function () {
		if (_type.isFunction (this.oncopy))
			return this.oncopy ();
	};

	return {
		initialize:		initialize,
		assign:			assign,
		exists:			exists,
		get:			get,
		keys:			keys,
		clear:			clear,
		copy:			copy
	};
}) ());

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



