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
