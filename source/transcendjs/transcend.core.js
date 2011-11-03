// NOT FOR PRODUCTION USE!
/*!
 * TranscendJS JavaScript Application Framework v1.0.0
 * http://www.jasonkflaherty.com/
 *
 * Copyright 2011, Jason K. Flaherty
 * Licensed under the FreeBSD license.
 * http://www.jasonkflaherty.com/license
 */

//-----------------------------------------------------------------------------
/**
 * @fileoverview TranscendJS JavaScript framework Core for organizing classes, 
 * 	singletons, helper functions and events.<br /><br />
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
 	 * @namespace 
 	 * The Core class is, by default, the only globally defined class in the 
 	 * TranscendJS framework.  Core is a singleton which initializes the 
 	 * framework, maintains all class definitions and provides the following 
 	 * features:<br/>
 	 * 
 	 * <ul>
 	 * <li>Registering classes, objects and singletons</li>
 	 * <li>Creating instances, getting singletons and globalizing</li>
 	 * <li>Default methods and using Core hierarchies</li>
 	 * <li>Listening for events and triggering them</li>
 	 * <li>Uniquely identifying objects</li>
 	 * </ul>
 	 * <b>Registering classes, objects and singletons</b><br/>
 	 * <br/>
 	 * Classes are simply registered via the <i>register()</i> method which accepts 
 	 * a class name, prototype and static method sets.  An existing class 
 	 * may be extended using the <i>extend()</i> method.  To register an object, 
 	 * library or singleton, use the <i>singleton()</i> method.<br/>
 	 * <br/>
 	 * The class constructor is the <i>initialize()</i> method, similar to Prototype.  
 	 * However, there is also a special case constructor event method, 
 	 * <i>oninit()</i>.  When extending an existing class and the <i>oninit()</i> method is 
 	 * defined, it is "stacked" with any <i>oninit()</i> methods declared in ancestor 
 	 * classes.  Whether or not this feature is supported is up to the ancestor 
 	 * class(es) and <i>oninit()</i> must be called from the original constructor.  If 
 	 * a child class defines a new constructor, the original is overridden and 
 	 * so are the <i>oninit()</i> methods.  A child class may also define an 
 	 * <i>oninit_override()</i> method which will override all other <i>oninit()</i> 
 	 * declarations but keep the original <i>initialize()</i> constructor.<br/>
 	 * <pre>
 	 * Core.extend ("ButtonControl", "UIControlAbstract", {<br/>
 	 * 	oninit: function () {<br/>
 	 * 		//...<br/>
 	 * 	},<br/>
 	 * <br/>
 	 * 	onpostrender: function (parent, elements) {<br/>
 	 * 		//...<br/>
 	 * 	}<br/>
 	 * },<br/>
 	 * {<br/>
 	 * 	test: function () {<br/>
 	 * 		//...<br/>
 	 * 		return true;<br/>
 	 * 	}<br/>
 	 * });
 	 * </pre>
 	 * <b>Creating Instances, Getting Singletons and Globalizing</b><br/>
 	 * <br/>
 	 * A new object may be instantiated using the <i>getInstance()</i> method.  This 
 	 * method will also return the single instance of any singletons that have 
 	 * been registered.  In the next section, we will talk about the <i>_()</i> 
 	 * (underscore) method which is an alias for getInstance and how this can 
 	 * be used to organize code.  You may also access the class directly using 
 	 * <i>getClass()</i>.<br/>
 	 * <br/>
 	 * By default, all classes must be accessed through the Core namespace.  
 	 * However, you may use the <i>globalize()</i> method to make specific 
 	 * classes/singletons available in the global namespace or, if no class 
 	 * name is provided, all declarations are made available globally.  So, 
 	 * instead of using <i>Core.getInstance ("Controller")</i> or 
 	 * <i>Core._("Controller")</i>, calling <i>globalize()</i> will allow you to use the new 
 	 * operator: <i>new Controller()</i>.  The second parameter to <i>globalize()</i> allows 
 	 * you to control whether existing global names should be overwritten.<br/>
 	 * <br/>
 	 * Any instances created may be deleted by the <i>destroy()</i> method which 
 	 * will call the <i>uninitialize()</i> destructor method.<br/>
 	 * <br/>
 	 * <b>The Default Method and Using Core Hierarchies</b><br/>
 	 * <br/>
 	 * A powerful organizational tool of the TranscendJS framework is it's use 
 	 * of default methods to drill down into hierarchical structures.  Default 
 	 * methods are simply aliases to existing methods in a class.  Core 
 	 * recognizes these methods and uses them to chain calls to simplify 
 	 * drilling down into Core hierarchies defined using {@link CoreBranch} or 
 	 * one of it's varients, such as {@link ExceptionBranch}.  An instance of a 
 	 * branch may be registered as a singleton in the Core namespace.  A good 
 	 * example of this is the Helpers branch that allows us to organize 
 	 * "helper" libraries.  Let's say we want to read a value from the query 
 	 * string using the {@link QueryStringHelpers} library.  We would have to 
 	 * get the Helpers singleton, pass "QueryString" to the Helpers' <i>getValue()</i> 
 	 * method which would return the QueryString library and then pass the key 
 	 * to the value we need to the library's <i>get()</i> method.  This would look 
 	 * like this:<br/>
 	 * <pre>
 	 * var foo = Core.getInstance("Helpers").getValue("QueryString").get("foo");
 	 * </pre>
 	 * Each of these methods is a default method but, as you can see here, 
 	 * that's little consolation:<br/>
 	 * <pre>
 	 * var foo = Core._("Helpers")._("QueryString")._("foo");
 	 * </pre>
 	 * When calling the <i>Core._()</i> method, it allows any first parameters to be 
 	 * delimited by a period and makes all the calls for you:<br/>
 	 * <pre>
 	 * var foo = Core._("Helpers.QueryString.foo");
 	 * </pre>
 	 * This allows the TranscendJS framework to offer more features without 
 	 * cluttering up the Core namespace.  In many cases, you may want easy 
 	 * access to a specific library and call it's methods directory, which is 
 	 * the case in the Type library for checking the data types of variables:<br/>
 	 * <pre>
 	 * var _type = Core._("Helpers.Type");<br/>
 	 * //...<br/>
 	 * if (_type.isDefined (foo)) { ... };<br/>
 	 * if (_type.isFunction (foo.someMethod) { ... };<br/>
 	 * if (_type._(foo) == "String") { ... };
 	 * </pre>
 	 * TranscendJS uses this approach for storing helper libraries, Exception 
 	 * types, globally accessible {@link Eventcast} instances, {@link Template} 
 	 * data and configuration ({@link ConfigBranch}).  You can even create your own hierarchies.  See 
 	 * {@link CoreBranch} for more details.<br/>
 	 * <br/>
 	 * <b>The Difference Between "_" and <i>getInstance()</i></b><br/>
 	 * <br/>
 	 * You would think that there would be a lot of overhead in supporting 
 	 * default method traversal in <i>every</i> object instantiation and you 
 	 * would be absolutely right.  So, unlike other classes, the <i>Core._()</i> 
 	 * default method isn't just an alias, it is it's own method.  For 
 	 * performance, you can use the <i>getInstance()</i> method, which simply 
 	 * instantiates the object from a direct name.<br/>
 	 * <br/>
 	 * <b>Listening for Events and Triggering Them</b><br/>
 	 * <br/>
 	 * It's quite common to set a function to the event method of an object, 
 	 * such as the onclick event of an Image object.  However, what happens 
 	 * when two pieces of code want to set a handler to the same event?  
 	 * <i>Core.listen()</i> applies a handler for the given event and "stacks" these 
 	 * handlers automatically.  See {@link Multicast} for more information on 
 	 * how this is handled and how you can further manipulate it.  For more 
 	 * complex event handling, see {@link Eventcast}.  If you need to trigger or 
 	 * "fire" an event, use <i>Core.trigger()</i>.<br/>
 	 * <br/>
 	 * <b>Uniquely Identifying Objects</b><br/>
 	 * <br/>The <i>getID()</i> and <i>setID()</i> methods are commonly used throughout the 
 	 * framework to uniquely define objects.  Everything can be assumed to have 
 	 * an ID.  If you attempt to get an ID from an object that doesn't have 
 	 * one, a unique ID is generated for the object and it is forever tagged 
 	 * with that ID.  The ID may be set manually as well.  This is useful for 
 	 * serialization and deserialization.<br/>
 	 * <br/>
 	 * If you would like to continue with the tutorial, continue to {@link CoreBranch}.<br/>
 	 * <br/>
 	 * For Helper libraries, see {@link ArrayHelpers}, {@link CookieHelpers}, 
 	 * {@link CSSHelpers}, {@link EventHelpers}, {@link QueryStringHelpers}, 
 	 * {@link StringHelpers}, {@link TypeHelpers},  {@link UniqueHelpers}, 
 	 * {@link ViewHelpers}.<br/><br/>
	 */
	Core = {
		/**
		 * Version of TranscendJS.
		 * @name Core#version
		 * @type Constant
		 */
		version: "1.0.0",

		//--------------------------------------------------------------------
		/**
		 * Create a new class constructor that may be instantiated from Core
		 * interface.  This may be done by calling <i>Core._{"ClassName")</i>.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Class constructor of the newly registered class
		 * @type object
		 * @example
		 * Core.register ("MyClass", {<br/>
	 	 * 	initialize: function () {<br/>
	 	 * 		//...<br/>
	 	 * 	},<br/>
	 	 * <br/>
	 	 * 	method: function (param1, param2) {<br/>
	 	 * 		//...<br/>
	 	 * 	}<br/>
	 	 * },<br/>
	 	 * {<br/>
	 	 * 	staticMethod: function () {<br/>
	 	 * 		//...<br/>
	 	 * 	}<br/>
	 	 * });
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
		 * @example
		 * Core.extend ("ButtonControl", "UIControlAbstract", {<br/>
	 	 * 	oninit: function () {<br/>
	 	 * 		//...<br/>
	 	 * 	},<br/>
	 	 * <br/>
	 	 * 	onpostrender: function (parent, elements) {<br/>
	 	 * 		//...<br/>
	 	 * 	}<br/>
	 	 * },<br/>
	 	 * {<br/>
	 	 * 	test: function () {<br/>
	 	 * 		//...<br/>
	 	 * 		return true;<br/>
	 	 * 	}<br/>
	 	 * });
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
		 * <i>Core._()</i> method.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of singleton
		 * @param {object} methods Class prototype
		 * @param {object} statics Static methods added to class definition
		 * @return Interface of the newly registered singleton
		 * @type object
		 * @example
		 * Core.singleton ("Files", Core._("CoreBranch"));
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
		 * @example
		 * var foo = new Image ("images/foo.png");<br/>
		 * <br/>
		 * Core.listen (foo, "click", function () {<br/>
		 * 	alert ("Handler #1");<br/>
		 * });<br/>
		 * <br/>
		 * Core.listen (foo, "click", function () {<br/>
		 * 	alert ("Handler #2");<br/>
		 * });
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
		 * @example
		 * Core.globalize ();<br/>
		 * var ref1 = Core._("Reference");<br/>
		 * var ref2 = new Reference ();
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
		 * @example
		 * var eventcast = Core.getClass ("Eventcast");<br/>
		 * var target = eventcast.getTarget (event);	//call static method of class
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
		 * Calls <i>uninitialize()</i> method of instance if available and 
		 * deletes the instance.
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
		 * the name parameter.  Rather than <i>Core._("Helpers")._("Context")._("XML")</i>,
		 * the simpler chained call can be used: <i>Core._("Helpers.Context.XML")</i>.
		 * @memberOf Core
		 * @function
		 * @param {string} name Name of class, singleton or interface.  Also
		 * 	accepts a period (.) delimited string of names, chaining through
		 * 	the Core heirarchy.
		 * @return New instance
		 * @type object
		 * @example
		 * var foo = Core.getInstance("Helpers").getValue("QueryString").get("foo");<br/>
		 * <br/>
	 	 * var foo = Core._("Helpers")._("QueryString")._("foo");<br/>
	 	 * <br/>
	 	 * var foo = Core._("Helpers.QueryString.foo");	//Chain call
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
	 * Core framework.  These may be simply accessed using the Core default 
	 * method (_), using period-delimited names to traverse the hierarchy.<br/>
	 * <br/>
	 * The CoreBranch class provides the basic building block for organizing 
	 * code and data into hierarchical structures under the TranscendJS Core.  
	 * These are currently being used within the framework for storing 
	 * configuration data, "helper" libraries, exception classes and template 
	 * data.  You may even create your own tree structures by simply 
	 * registering a CoreBranch instance as a singleton (see {@link Core}).  
	 * If you would like to provide special functionality, you can extend 
	 * CoreBranch and use an instance of your own custom class instead.  See 
	 * the source for {@link ConfigBranch} and {@link ExceptionBranch} for 
	 * examples.<br/>
	 * <br/>
	 * <b>To build a branch off of the Core:</b><br/>
	 * <pre>
	 * Core.singleton ("MyBranch", Core._("CoreBranch"));
	 * </pre>
	 * <b>To register entries:</b><br/>
	 * <pre>
	 * Core._("MyBranch").register ("foo", some_function);<br/>
	 * Core._("MyBranch").register ("Baz");<br/>
	 * Core._("MyBranch.Baz").register ("bar", (function () {<br/>
	 * 	var Library = {<br/>
	 * 		method1: function (param1, param2) {<br/>
	 * 			//...<br/>
	 * 		},<br/>
	 * 		method2: function (param1, param2) {<br/>
	 * 			//...<br/>
	 * 		}<br/>
	 * 	}<br/>
	 * <br/>
	 * 	Library._ = Library.method1;	//method1 becomes the default method;<br/>
	 * <br/>
	 * 	return Library;<br/>
	 * }) ());
	 * </pre>
	 * <b>Traversing the hierarchy:</b><br/>
	 * <pre>
	 * var result1 = Core._("MyBranch.foo", param);<br/>
	 * //The following calls method1, the default method<br/>
	 * var result2 = Core._("MyBranch.Baz.bar", param1, param2);
	 * </pre>
	 * see "The Default Method and Using Core Hierarchies" in the {@link Core} 
	 * documentation for more information.<br/>
	 * <br/>
 	 * If you would like to continue with the tutorial, continue to {@link ConfigBranch}.
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
		 * @example
		 * Core._("MyBranch").register ("Baz");<br/>
		 * Core._("MyBranch.Baz").register ("bar", some_function);
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
		 * branch.  When accessed from <i>Core._()</i>, this function is
		 * implicitly called when using preiod-delimited names.
		 * @name CoreBranch#getValue
		 * @function
		 * @param {String} name Name of value or branch to be retrieved
		 * @param {Any} value If given, sets the value
		 * @example
		 * var value = Core._("MyBranch.foo");<br/>
		 * var result = Core._("MyBranch.Baz.bar", param1, param2);
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

