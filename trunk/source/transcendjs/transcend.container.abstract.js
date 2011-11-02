//-----------------------------------------------------------------------------
/**
 * @fileoverview Defines a container class providing an interface for setting
 * 	arbitrary properies of objects.<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.register ("ContainerAbstract", (function () {
	var _type = Core._("Helpers.Type");
	var _find_key;
	var ContainerAbstract = /** @lends ContainerAbstract.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Basic container providing a generic interface for assigning 
		 * values to objects.<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link Container}.
		 * @constructs
		 */
		initialize: function () {
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
		},

		//---------------------------------------------------------------------
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
		assign: function (key, value) {
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
				var container = _find_key (this, key) || this;

				if (_type.isFunction (container.onset)) {
					container.onset (key, value);
				}
			}

			return this;
		},

		//---------------------------------------------------------------------
		/**
		 * Checks if a given key exists.  Triggers the <i>isset()</i> method of 
		 * the Interpreter instance.
		 * @name ContainerAbstract#exists
		 * @function
		 * @param {string} key 
		 * @return Return true if a value exists for the given key, false if 
		 * 	not and undefined if the isset method does not exists.
		 * @type boolean
		 */
		exists: function (key) {
			var result;

			if (_type.isFunction (this.isset))
				result = this.isset (key);
			if (result === false && !_type.isUndefined (this.link)) {
				var link = this.link ();
				result = link.exists (key);
			}

			return result;
		},

		//---------------------------------------------------------------------
		/**
		 * Gets the value from the given key.  Triggers the <i>onget()</i> 
		 * handler of the Interpreter instance.
		 * @name ContainerAbstract#get
		 * @function
		 * @param {string} key 
		 * @return Returns any value assign to the given key or undefined if
		 * 	not found.
		 * @type Any
		 */
		get: function (key) {
			var value;

			if (_type.isFunction (this.onget))
				value = this.onget (key);
			if (_type.isUndefined (value) && !_type.isUndefined (this.link)) {
				var link = this.link ();
				if (link) value = link.get (key);
			}

			return value;
		},

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name ContainerAbstract#keys
		 * @function
		 * @return Array containing set of local keys (does not include linkages) 
		 * @type Array|false
		 */
		keys: function () {
			if (_type.isFunction (this.onkeys))
				return this.onkeys ();

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * Deletes the value from the given key.  Triggers the <i>onunset()</i> 
		 * handler of the Interpreter instance
		 * @name ContainerAbstract#clear
		 * @function
		 * @param {string} key 
		 * @return Returns the deleted value from the given key or undefined if
		 * 	not found.
		 * @type Any
		 */
		clear: function (key) {
			var container = _find_key (this, key) || this;

			if (_type.isFunction (container.onunset))
				return container.onunset (key);
		},

		//---------------------------------------------------------------------
		/**
		 * 
		 * @name ContainerAbstract#copy
		 * @function
		 * @return 
		 * @type object
		 */
		copy: function () {
			if (_type.isFunction (this.oncopy))
				return this.oncopy ();
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Traverses a chain of containers and returns the container that contains
	 * the given key.
	 * @memberOf ContainerAbstract.prototype
	 * @function
	 * @private
	 * @param {Container} container
	 * @param {string} key
	 * @return Returns the container in which the key was found or false if
	 * 	not found
	 * @type Container or boolean
	 */
	_find_key = function (container, key) {
		if (_type.isFunction (container.isset)) {
			if (container.isset (key)) return container;
		}

		if (_type.isDefined (container.link)) {
			container = container.link ();

			if (container) return _find_key (container, key);
		}

		return false;
	};

	return ContainerAbstract;
}) ());

