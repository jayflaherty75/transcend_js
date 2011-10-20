//-----------------------------------------------------------------------------
/**
 * @fileoverview Tech Net RIA Framework architecture for organizing classes, 
 * 	singletons, helper functions and events.  Provides classes for basic data 
 * 	handling and event management as well as a contextual data-driven 
 * 	interpreter.<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
(function () {
	var _toString = Object.prototype.toString;
	var _objects = {};
	var _events = { global: {}};
	var _instances = {};
	var _instance_count = 1;
	var save_instance;

	/**
	 * @namespace Singleton maintaining all classes, interfaces and singletons 
	 * and provides an interface for registering events and listening for these 
	 * events without cluttering up the global environment (Core.globalize() 
	 * makes these globally accessible if preferred).  Initializes the Tech 
	 * Net framework.
	 */
	Core = {
		/**
		 * Version of Tech Net Client.
		 * @name Core#version
		 * @type Constant
		 */
		version: "0.0.22",

		//--------------------------------------------------------------------
		/**
		 * Create a new class constructor that may be instantiated from Core
		 * interface.  This may be done by calling <b>Core._{"ClassName")</b>.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Class constructor of the newly registered class
		 * @type object
		 */
		register: function (name, methods, statics) {
			var object;

			if (Object.isFunction (methods))
				object = methods;
			else
				object = Class.create (methods);

			if (statics) Object.extend (object, statics);

			object.className = Core._("Property", name);
			_objects[name] = object;

			return object;
		},

		//--------------------------------------------------------------------
		/**
		 * Create a new class constructor by extending a class that has
		 * been registered from the Core interface.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class
		 * @param {string} parent Name of parent class
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Class constructor of the newly registered class
		 * @type object
		 */
		extend: function (name, parent, methods, statics) {
			var object;

			if (Object.isString (parent))
				parent = _objects[parent];

			//If a base class constructor calls an oninit() function, combine
			//it with the oninit() of the new class.
			if (typeof (methods.oninit_override) == "undefined") {
				if (typeof (methods.oninit) != "undefined") {
					if (typeof (parent) != "undefined" && 
						typeof (parent.prototype) != "undefined" &&
						typeof (parent.prototype.oninit) != "undefined") {
						var mcast = Core._("Multicast",
							parent.prototype.oninit, 
							methods.oninit
						);

						if (mcast) methods.oninit = mcast.call;
					}
				}
			}
			else {
				methods.oninit = methods.oninit_override;
				delete methods["oninit_override"];
			}

			object = Class.create (parent, methods);

			if (statics) Object.extend (object, statics);

			object.className = Core._("Property", name);
			_objects[name] = object;

			return object;
		},

		//--------------------------------------------------------------------
		/**
		 * Accepts either a constructor or object for its <i>methods</i>
		 * parameter and registers an interface object accessible via the
		 * <b>Core._()</b> method.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of singleton
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Interface of the newly registered singleton
		 * @type object
		 */
		singleton: function (name, methods, statics) {
			var object;

			if (Object.isFunction (methods.initialize)) {
				object = new (Class.create (methods)) ();
			}
			else
				object = methods;

			if (statics) Object.extend (object, statics);

			object.className = Core._("Property", name);
			_objects[name] = object;

			return object;
		},

		//--------------------------------------------------------------------
		/**
		 * Provides a quick and easy method of firing an event from an object.
		 * Typically, an object would check for the existance of a handler
		 * function and call it.  This carries little overhead and is the 
		 * prefered method.  Although this method carries a lot of overhead,
		 * however, it provides the option of brevity.
		 * @memberOf Core
		 * @function
		 * @param {mixed} object The object triggering the event
		 * @param {string} event The name of the event, such as "click"
		 * @param {varargs} ... Listener function
		 * @return Anything returned from the handler or false if no handler
		 * 	was present.
		 * @type mixed|false
		 */
		trigger: function () {
			var args = $A(arguments);
			var object = args.shift ();
			var event = "on" + args.shift ();
			var handler = object[event];

			if (typeof (handler) == "function") {
				if (!Core._("Helpers.Event").isEvent (args[0])) {
					args.unshift (window.event || { clientX: 0 });
				}

				return handler.apply (object, args);
			}

			return false;
		},

		//--------------------------------------------------------------------
		/**
		 * Adds a listener function to an object event.  Creates a Multicast
		 * object if there are more than one listener. 
		 * @memberOf Core
		 * @function
		 * @param {object} object Target object to listen to
		 * @param {string} name Event identifier
		 * @param {function} listener Listener function
		 */
		listen: function (object, name, listener) {
			name = "on" + name;

			if (typeof (object[name]) == "function") {
				var mcast = object[name].multicast || Core._("Multicast",
					object[name], 
					listener
				);

				if (mcast) object[name] = mcast.call;
			}
			else {
				object[name] = listener;
			}
		},

		//--------------------------------------------------------------------
		/**
		 * Adds a global reference to a registered class, singleton or 
		 * interface to the global namespace.  If no name is provided, all
		 * registrations are copied.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class, singleton or interface. Optional
		 * @param {boolean} overwrite Determines whether global values should
		 * 		be overwritten.  Default is <i>false</i>
		 */
		globalize: function (name, overwrite) {
			overwrite = (overwrite === false ? false : true);

			if (typeof (name) == "string") {
				if (overwrite || Object.isUndefined (window[name])) {
					window[name] = _objects[name];
				}
			}
			else {
				$H(_objects).each (function (pairs) {
					this.globalize (pairs.key, overwrite);
				}.bind (this));
			}
		},

		//--------------------------------------------------------------------
		/**
		 * Uses "$" instead of Core for those that prefer a 
		 * Prototype-/jQuery-style shortcut.
		 * @memberOf Core
		 * @function
		 */
		dollarize: function () {
			window["$"] = window["Core"];
			delete window["Core"];
		},

		//--------------------------------------------------------------------
		/**
		 * Returns the class contructor of either a class previously registered
		 * or from the global namespace if not found.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class
		 * @return Class constructor
		 * @type function
		 */
		getClass: function (name) {
			var c = _objects[name];

			if (typeof (c) == "undefined") c = window[name];
			if (typeof (c) == "undefined") return null;

			return c;
		},

		//--------------------------------------------------------------------
		/**
		 * Returns an instance of the requested class.  If not a class, 
		 * returns the interface object.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class, singleton or interface
		 * @return New instance
		 * @type object
		 */
		getInstance: function () {
			var args = $A(arguments);
			var name = args.shift ();
			var c = this.getClass (name);
			var object = null;

			if (Object.isFunction (c)) {
				//return object.prototype.constructor.apply (object, args);
				object = save_instance (new (c) (args[0], args[1], 
					args[2], args[3], args[4], args[5], args[6], args[7], 
					args[8], args[9]));

				object.classRef = c;
			}

			return object;
		},

		//--------------------------------------------------------------------
		/**
		 * Calls uninitialize() method of instance if available and deletes
		 * the instance.
		 * @memberOf Core
		 * @function
		 * @param {object} instance Object instance to be destructed.
		 */
		destroy: function (instance) {
			if (typeof (instance) == "object") {
				if (!Object.isUndefined (instance.uninitialize)) {
					instance.uninitialize ();
				}

				if (!Object.isUndefined (instance.instance_id)) {
					delete _instances[instance.instance_id];
				}
			}
		},

		//--------------------------------------------------------------------
		/**
		 * Returns the object's unique identifier.  If the ID is not set, a
		 * new one is created for it.
		 * @memberOf Core
		 * @function
		 * @param {Object} object Anything that can be used as an object.
		 * 	This includes Numbers.
		 * @return A hexidecimal string value representing the identifier
		 * @type String
		 */
		getID: function (object) {
			if (typeof (object) != "undefined" && object != null) {
				if (typeof (object._uid) == "undefined") {
					return this.setID (object);
				}

				return object._uid;
			}

			return false;
		},

		//--------------------------------------------------------------------
		/**
		 * 
		 * @memberOf Core
		 * @function
		 * @param {Object} object Anything that can be used as an object.
		 * 	This includes Numbers.
		 * @return A hexidecimal string value representing the identifier
		 * @type String
		 */
		setID: function (object, identifier) {
			if (typeof (object) != "undefined") {
				object._uid = identifier || this._("Helpers.Unique").hex ();

				return object._uid;
			}

			return false;
		},

		//--------------------------------------------------------------------
		/**
		 * Returns an instance of the requested class.  If not a class, 
		 * returns the interface object.  May automatically call the default
		 * methods (_) of interfaces by passing a period-delimited chain as
		 * the name parameter.  Rather than Core._("Helpers")._("Context")._("XML"),
		 * the simpler chained call can be used: Core._("Helpers.Context.XML").
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class, singleton or interface.  Also
		 * 	accepts a period (.) delimited string of names, chaining through
		 * 	the Core heirarchy.
		 * @return New instance
		 * @type object
		 */
		_: function () {
			var args = $A(arguments);
			var identifiers = args.shift ().split (".");
			var identifier = identifiers.shift ();
			var object = _objects[identifier];

			if (identifiers.length > 0) {
				while (identifier = identifiers.shift()) {
					if (Object.isFunction (object._)) {
						if (identifiers.length == 0) {
							object = object._.apply (object, [identifier].concat (args));
						}
						else {
							object = object._ (identifier);
						}
					}
				}
			}
			else {
				if (Object.isFunction (object)) {
					var c = object;
					//object = object.prototype.constructor.apply (object, args);
					object = save_instance (new (object) (args[0], args[1], 
						args[2], args[3], args[4], args[5], args[6], args[7], 
						args[8], args[9]));

					object.classRef = c;
				}
			}

			return object;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf Core
	 * @function
	 * @private
	 * @param {mixed} instance Description
	 * @return Description
	 * @type mixed
	 */
	save_instance = function (instance) {
		instance["instance_id"] = _instance_count;
		_instances[_instance_count] = instance;
		_instance_count++;

		return instance;
	};
}) ();

//-----------------------------------------------------------------------------
Core.register ("CoreBranch", /** @lends CoreBranch.prototype */ {
	/**
	 * @class Provides method of adding organized, "branched" systems to the
	 * 	Core framework.  These may be simply accessed using the Core default
	 * 	method (_), using period-delimited names to traverse the hierarchy.
	 * <br/><br/>
	 * @constructs
	 */
	initialize: function () {
		var _values = {};

		//--------------------------------------------------------------------
		/**
		 * Registers a value directly to the branch or, if no value is
		 * supplied, creates a new branch under the given name.
		 * @name CoreBranch#register
		 * @function
		 * @param {String} name Name of value or branch to be added.
		 * @param {Any} value Value stored under name
		 */
		this.register = function (name, value) {
			if (typeof (_values[name]) == "undefined") {
				if (typeof (value) == "undefined") {
					_values[name] = Core._("CoreBranch");
				}
				else {
					_values[name] = value;
				}

				return true;
			}

			return false;
		};

		//--------------------------------------------------------------------
		/**
		 * Retrieves the value or branch at the given name under the current 
		 * branch.
		 * @name CoreBranch#getValue
		 * @function
		 * @param {String} name Name of value or branch to be retrieved
		 * @param {Any} value If given, sets the value
		 */
		this.getValue = function (name) {
			if (typeof (name) != "undefined")
				return _values[name];
		};

		this._ = this.getValue;

		if (typeof (this.oninit) == "function") this.oninit ();
	}
});

//-----------------------------------------------------------------------------
Core.singleton ("Helpers", Core._("CoreBranch"));

//-----------------------------------------------------------------------------
Core.singleton ("Events", Core._("CoreBranch"));

