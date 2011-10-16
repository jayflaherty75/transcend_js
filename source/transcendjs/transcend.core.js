//-----------------------------------------------------------------------------
/**
 * @fileoverview Tech Net RIA Framework architecture for organizing classes, 
 * 	singletons, helper functions and events.  Provides classes for basic data 
 * 	handling and event management as well as a contextual data-driven 
 * 	interpreter.<br /><br />
 * 
 * 	Date		2011-02-01<br />
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		Jason K. Flaherty coderx75@hotmail.com
 * @version		0.0.22
 */

//-----------------------------------------------------------------------------
/** Tech Net {@link Core} singleton */
Core = new (Class.create ( /** @lends Core# */ {
	/**
	 * @class Singleton maintaining all classes, interfaces and singletons and 
	 * 	provides an interface for registering events and listening for these 
	 * 	events without cluttering up the global environment (Core.globalize() 
	 * 	makes these globally accessible if preferred).  Initializes the Tech 
	 * 	Net framework.
	 * @constructs
	 */
	initialize: function () {
		var _toString = Object.prototype.toString;
		var _objects = {};
		var _events = { global: {}};
		var _instances = {};
		var _instance_count = 1;

		/**
		 * Version of Tech Net Client.
		 * @name Core#version
		 * @type Constant
		 */
		this.version = "0.0.22";

		//--------------------------------------------------------------------
		var save_instance = function (instance) {
			instance["instance_id"] = _instance_count;
			_instances[_instance_count] = instance;
			_instance_count++;

			return instance;
		};

		//--------------------------------------------------------------------
		/**
		 * Create a new class constructor that may be instantiated from Core
		 * interface.  This may be done by calling <b>Core._{"ClassName")</b>.
		 * @name Core#register
		 * @function
		 * @param {string} name Name of class
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Class constructor of the newly registered class
		 * @type object
		 */
		this.register = function (name, methods, statics) {
			var object;

			if (Object.isFunction (methods))
				object = methods;
			else
				object = Class.create (methods);

			if (statics) Object.extend (object, statics);

			object.className = Core._("Property", name);
			_objects[name] = object;

			return object;
		};

		//--------------------------------------------------------------------
		/**
		 * Create a new class constructor by extending a class that has
		 * been registered from the Core interface.
		 * @name Core#extend
		 * @function
		 * @param {string} name Name of class
		 * @param {string} parent Name of parent class
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Class constructor of the newly registered class
		 * @type object
		 */
		this.extend = function (name, parent, methods, statics) {
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
		};

		//--------------------------------------------------------------------
		/**
		 * Accepts either a constructor or object for its <i>methods</i>
		 * parameter and registers an interface object accessible via the
		 * <b>Core._()</b> method.
		 * @name Core#singleton
		 * @function
		 * @param {string} name Name of singleton
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Interface of the newly registered singleton
		 * @type object
		 */
		this.singleton = function (name, methods, statics) {
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
		};

		//--------------------------------------------------------------------
		/**
		 * Provides a quick and easy method of firing an event from an object.
		 * Typically, an object would check for the existance of a handler
		 * function and call it.  This carries little overhead and is the 
		 * prefered method.  Although this method carries a lot of overhead,
		 * however, it provides the option of brevity.
		 * @name Core#trigger
		 * @function
		 * @param {mixed} object The object triggering the event
		 * @param {string} event The name of the event, such as "click"
		 * @param {varargs} ... Listener function
		 * @return Anything returned from the handler or false if no handler
		 * 	was present.
		 * @type mixed|false
		 */
		this.trigger = function () {
			var args = $A(arguments);
			var object = args.shift ();
			var event = "on" + args.shift ();
			var handler = object[event];

			if (typeof (handler) != "undefined") {
				if (!Event.isEvent (args[0])) {
					args.unshift (window.event || { clientX: 0 });
				}

				return handler.apply (object, args);
			}

			return false;
		};

		//--------------------------------------------------------------------
		/**
		 * DEPRECATED.  Use Events core branch instead.<br/><br/>
		 * 
		 * Registers an event, allowing it to be accessed from the global
		 * environment.  The <i>namespace</i> parameter allows for events to 
		 * be grouped into categories to help avoid naming collisions.  The
		 * <i>name</i> parameter can be anything the caller wishes to name the
		 * event but will be stored by name and type.  A <i>click</i> event
		 * for an event named <i>foo</i> would be later accessible as
		 * <i>foo_click</i>.
		 * @name Core#event
		 * @function
		 * @param {string} namespace Identifier allowing events to be grouped
		 * @param {string} name Arbitrary event identifier
		 * @param {Eventcast} bcast Eventcast to be registered
		 */
		this.event = function (namespace, name, bcast) {
			var events = _events[namespace];

			if (Object.isUndefined (events)) {
				events = {};
				_events[namespace] = events;
			}

			if (bcast) {
				name = name + "_" + bcast.getType ();
				events[name] = bcast;
			}
			else
				delete events[name];
		};

		//--------------------------------------------------------------------
		/**
		 * Allows for a registered Eventcast to be listened to by a listener
		 * function.
		 * @name Core#listen
		 * @function
		 * @param {string} namespace Identifier of event group
		 * @param {string} name Event identifier
		 * @param {function} func Listener function
		 * @return Returns the Eventcast listened to
		 * @type Eventcast
		 */
		this.listen = function (namespace, name, func) {
			var bcast = null;

			if (_events[namespace]) {
				if (_events[namespace][name]) {
					bcast = _events[namespace][name];
					if (func) bcast.listen (func);
				}
			}

			return bcast;
		};

		//--------------------------------------------------------------------
		/**
		 * Adds a global reference to a registered class, singleton or 
		 * interface to the global namespace.  If no name is provided, all
		 * registrations are copied.
		 * @name Core#globalize
		 * @function
		 * @param {string} name Name of class, singleton or interface. Optional
		 * @param {boolean} overwrite Determines whether global values should
		 * 		be overwritten.  Default is <i>false</i>
		 */
		this.globalize = function (name, overwrite) {
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
		};

		//--------------------------------------------------------------------
		/**
		 * Uses "$" instead of Core for those that prefer a 
		 * Prototype-/jQuery-style shortcut.
		 * @name Core#dollarize
		 * @function
		 */
		this.dollarize = function () {
			window["$"] = window["Core"];
			delete window["Core"];
		};

		//--------------------------------------------------------------------
		/**
		 * Returns the class contructor of either a class previously registered
		 * or from the global namespace if not found.
		 * @name Core#getClass
		 * @function
		 * @param {string} name Name of class
		 * @return Class constructor
		 * @type function
		 */
		this.getClass = function (name) {
			var c = _objects[name];

			if (typeof (c) == "undefined") c = window[name];
			if (typeof (c) == "undefined") return null;

			return c;
		};

		//--------------------------------------------------------------------
		/**
		 * Returns an instance of the requested class.  If not a class, 
		 * returns the interface object.
		 * @name Core#getInstance
		 * @function
		 * @param {string} name Name of class, singleton or interface
		 * @return New instance
		 * @type object
		 */
		this.getInstance = function () {
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
		};

		//--------------------------------------------------------------------
		/**
		 * Calls uninitialize() method of instance if available and deletes
		 * the instance.
		 * @name Core#destroy
		 * @function
		 * @param {object} instance Object instance to be destructed.
		 */
		this.destroy = function (instance) {
			if (typeof (instance) == "object") {
				if (!Object.isUndefined (instance.uninitialize)) {
					instance.uninitialize ();
				}

				if (!Object.isUndefined (instance.instance_id)) {
					delete _instances[instance.instance_id];
				}
			}
		};

		//--------------------------------------------------------------------
		/**
		 * Returns the object's unique identifier.  If the ID is not set, a
		 * new one is created for it.
		 * @name Core#getID
		 * @function
		 * @param {Object} object Anything that can be used as an object.
		 * 	This includes Numbers.
		 * @return A hexidecimal string value representing the identifier
		 * @type String
		 */
		this.getID = function (object) {
			if (typeof (object) != "undefined" && object != null) {
				if (typeof (object._uid) == "undefined") {
					return this.setID (object);
				}

				return object._uid;
			}

			return false;
		};

		//--------------------------------------------------------------------
		/**
		 * 
		 * @name Core#getID
		 * @function
		 * @param {Object} object Anything that can be used as an object.
		 * 	This includes Numbers.
		 * @return A hexidecimal string value representing the identifier
		 * @type String
		 */
		this.setID = function (object, identifier) {
			if (typeof (object) != "undefined") {
				object._uid = identifier || this._("Helpers.Unique").hex ();

				return object._uid;
			}

			return false;
		};

		//--------------------------------------------------------------------
		/**
		 * Returns an instance of the requested class.  If not a class, 
		 * returns the interface object.  May automatically call the default
		 * methods (_) of interfaces by passing a period-delimited chain as
		 * the name parameter.  Rather than Core._("Helpers")._("Context")._("XML"),
		 * the simpler chained call can be used: Core._("Helpers.Context.XML").
		 * @name Core#_
		 * @function
		 * @param {string} name Name of class, singleton or interface.  Also
		 * 	accepts a period (.) delimited string of names, chaining through
		 * 	the Core heirarchy.
		 * @return New instance
		 * @type object
		 */
		this._ = function () {
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
		};

		//--------------------------------------------------------------------
		Object.extend (Event, 
			/** @lends Event */
			{
			/**
			 * IE workaround to read event type set by Tech Net
			 * @name Event#getType
			 * @function
			 * @param {Event} evt Any valid Event object
			 * @return Name of the event type
			 * @type string
			 */
			getType: function (evt) {
				if (evt) {
					if (evt.tn_type)
						return evt.tn_type;
					else if (evt.type)
						return evt.type;
				}

				return false;
			},

			/**
			 * IE workaround to read event target object set by Tech Net.
			 * Any object event (hook-in) may be Eventcast.
			 * @name Event#getTarget
			 * @function
			 * @param {Event} evt Any valid Event object
			 * @return Target object (not restricted to DOM elements)
			 * @type object
			 */
			getTarget: function (evt) {
				if (evt) {
					if (evt.tn_target)
						return evt.tn_target;
					else if (evt.target)
						return evt.target;
					else if (evt.srcElement)
						return evt.srcElement;
				}

				return false;
			},

			/**
			 * IE (instanceof) workaround to test that an object is an Event
			 * @name Event#isEvent
			 * @function
			 * @param {Event} evt Any valid Event object
			 * @return <i>True</i> if object is an instance of Event
			 * @type boolean
			 */
			isEvent: function (evt) {
				if (evt == null) return false;
				if (typeof (evt) != "object") return false; 
				if (Object.isUndefined (evt.clientX) &&
					Object.isUndefined (evt.defaultPrevented)) return false;

				return true;
			}
		});
	}
})) ();

//-----------------------------------------------------------------------------
Core.register ("CoreBranch", /** @lends CoreBranch */ {
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
Core.singleton ("Helpers", /** @lends Helpers */ Core._("CoreBranch"));

//-----------------------------------------------------------------------------
Core.singleton ("Events", /** @lends Events */ Core._("CoreBranch"));

