
//-----------------------------------------------------------------------------
/**
 * @fileoverview Event casting system designed to bridge the gap between 
 * application and DOM events while allowing for complex interactions to be
 * easily implemented.  "Target" objects define their own hook-in functions
 * which may then be broadcast by the event system.  A Broadcast may be created
 * to handle a specific type of event but may receive these calls from multiple
 * targets.  Multiple broadcasts may be assigned to the same target event.
 * Once created, other modules may then "listen" in on the Broadcast.<br /><br />
 * 
 * 	Date		2011-02-01<br />
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		Jason K. Flaherty coderx75@hotmail.com
 * @version		0.0.22
 */

//-----------------------------------------------------------------------------
Core.register ("Multicast",  /** @lends Multicast# */ {
	/**
	 * @class Function container, allowing multiple functions to be called at 
	 * 	once, each receiving the original parameters passed.
	 * @constructs
	 * @param {function} listener Any number of listener functions parameters
	 */
	initialize: function () {
		var pvt = {
			listeners: new Array (),
			binding: false,
			self: this
		};

		/**
		 * For future use.  Some flexibility may be needed in how results from
		 * multicalls are handled.  Originally, if there were more than one
		 * listener, an array of results would be passed back.  This code is
		 * now commented out and replaced by logic to pass the result of each
		 * subsequent listener as an argument to the next.  This avoids the
		 * confusion of which result should be used and gives listeners much
		 * more power.  However, the array approach may be needed in some
		 * cases.  If so, resultMethod will allow a processing function to be
		 * selected.  Furthermore, it may be possible to add new methods if
		 * the existing ones are not sufficient.
		 * @name Multicast#resultMethod
		 * @type Property (string)
		 */
		this.resultMethod = new Core._ ("Property", "chain");
		this.resultMethod.onchange = function (value) {
			return (value | "chain").toString ().toLowerCase ();
		};

		//--------------------------------------------------------------------
		/**
		 * Adds a listener function to Multicast container.
		 * @name Multicast#listen
		 * @function
		 * @param {function} listener Function to be added to listen for call
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns the Multicast object, allowing for call chains
		 * @type Multicast
		 */
		this.listen = function (listener) {
			if (Object.isFunction (listener)) {
				if (listener.multicast && listener.multicast != this) {
					listener.multicast.combine (pvt);
				}
				else {
					if (!Object.isFunction  (listener.ignore)) {
						listener.ignore = function () {
							this.ignore (listener);
						}.bind (this);
					}

					pvt.listeners.push (listener);
				}
			}
			else {
				throw new TypeError ("Multicast.listen(): Parameter 1 " +
					"must be a function");
			}

			return this;
		};

		//--------------------------------------------------------------------
		/**
		 * Removes listener function from Multicast container
		 * @name Multicast#ignore
		 * @function
		 * @param {function} listener Function to be removed
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns the Multicast object, allowing for call chains
		 * @type Multicast
		 */
		this.ignore = function (listener) {
			var index = false;

			if (Object.isFunction (listener)) {
				for (var i = 0; i < pvt.listeners.length; i++) {
					if (pvt.listeners[i] == listener) index = i;
				}

				if (index !== false) pvt.listeners.splice (index, 1);
			}
			else {
				throw new TypeError ("Multicast.ignore(): Parameter 1 " +
					"must be a function");
			}

			return this;
		};

		//--------------------------------------------------------------------
		/**
		 * Combines two multicasts, allowing each to control the same container.
		 * @name Multicast#combine
		 * @function
		 * @param {object} mcast_private Private members of target Multicast
		 * @private
		 */
		this.combine = function (mcast_private) {
			for (var i = 0; i < mcast_private.listeners.length; i++) {
				pvt.listeners.push (mcast_private.listeners[i]);
			}

			mcast_private.listeners = pvt.listeners;
		};

		//--------------------------------------------------------------------
		/**
		 * Returns the number of listener functions in Multicast container.
		 * @name Multicast#count
		 * @function
		 * @return Length of container
		 * @type int
		 */
		this.count = function () {
			return pvt.listeners.length;
		};

		//--------------------------------------------------------------------
		/**
		 * Binds an object to all calls in Multicast.
		 * @name Multicast#bind
		 * @function
		 * @param {object} Object to bind to all function calls in Multicast
		 * @return Returns the Multicast object, allowing for call chains
		 * @type Multicast
		 */
		this.bind = function (object) {
			pvt.binding = object;

			return this;
		};

		//--------------------------------------------------------------------
		/**
		 * Calls all contained functions.  Any parameters passed are propagated
		 * to all functions.
		 * @name Multicast#call
		 * @function
		 * @param {...}
		 * @return Array containing the return values of all function.  If
		 * there is only one function contained, only that return value is
		 * returned.  If empty, returns undefined.
		 */
		this.call = function () {
			/*if (pvt.listeners.length == 1) {
				return pvt.listeners[0].apply (this, arguments);
			}
			else if (pvt.listeners.length > 1) {
				var result = new Array ();

				for (var i = 0; i < pvt.listeners.length; i++) {
					result.push (pvt.listeners[i].apply (this, arguments));
				}

				return result;
			}*/

			var args, result;

			for (var i = 0; i < pvt.listeners.length; i++) {
				args = $A(arguments);
				if (typeof (result) != "undefined") args.push (result);

				if (pvt.binding === false) {
					result = pvt.listeners[i].apply (this, args);
				}
				else {
					result = pvt.listeners[i].apply (pvt.binding, args);
				}
			}

			return result;
		};
		Object.extend (this.call, { multicast: this });

		//--------------------------------------------------------------------
		$A(arguments).each (function (listener) {
			if (!Object.isUndefined (listener))
				this.listen (listener);
		}.bind (this));
	}
});

//-----------------------------------------------------------------------------
Core.extend ("Broadcast", "Multicast", /** @lends Broadcast# */ {
	/**
	 * @class Manages a type of event for a group of target objects and allows 
	 * 	external code to "listen" for that event from any of the targets.  
	 * 	Broadcasts may multiple targets and multiple listeners, making it a 
	 * 	many-to-one-to-many design.  Targets may have separate broadcasts for 
	 * 	each event but may also have multiple broadcasts of the same event, 
	 * 	allowing for any configuration and for very complex interactions to be 
	 * 	easily implemented.<br /><br />
	 * 
	 * 	Hook-in function is only set if there are targets and listeners for the
	 * 	broadcast.  No resources are wasted on empty calls.<br /><br />
	 * @extends Multicast
	 * @constructs
	 * @param {string} event_name Name of event to broadcast
	 * @param {any} memo Miscellaneous data to be passed along with event
	 * @param {object} targets Any number of target object parameters (optional)
	 * @return Broadcast
	 */
	initialize: function ($super, event_name, memo) {
		$super ();

		var pvt = {
			targets: {},
			mcast_listen: this.listen.bind (this),
			mcast_ignore: this.ignore.bind (this),
			self: this
		};

		//--------------------------------------------------------------------
		/**
		 * Handler function to be assigned to object's hook-in.  This calls
		 * <i>Multicast.call()</i> method along with event parameters sent
		 * by target object.
		 * @name Broadcast-multi_handler
		 * @function
		 * @param {...} Anything the original object sent
		 * @return Any value passed back to target by the listener (or Array 
		 * 		of values)
		 * @type object
		 * @private
		 */
		var multi_handler = function () {
			var args = $A(arguments);

			if (!Event.isEvent (args[0])) args.unshift (window.event || { clientX: 0 });

			args[0]["memo"] = memo;
			args[0]["tn_type"] = event_name;
			args[0]["tn_target"] = this;

			return (pvt.self.call.apply (pvt.self, args));
		};

		//--------------------------------------------------------------------
		/**
		 * Adds Broadcast function to target hook-in
		 * @name Broadcast-add_handler
		 * @function
		 * @param {object} target
		 * @return Function added to Broadcast hook-in.
		 * @type function
		 * @private
		 */
		var add_handler = function (target) {
			var mcast_func = multi_handler.bind (target);
			var funcname = "on" + event_name;
			var func = null;
			var mcast;

			if (Object.isFunction  (target[funcname])) {
				mcast = Core._("Multicast", mcast_func, target[funcname]);
				func = mcast.call.bind (mcast);
			}
			else {
				func = mcast_func;
			}

			target[funcname] = Object.extend (func, { multicast: mcast });

			return mcast_func;
		};

		//--------------------------------------------------------------------
		/**
		 * Removes Broadcast function from target hook-in
		 * @name Broadcast-remove_handler
		 * @function
		 * @param {object} target
		 * @param {function} func
		 * @private
		 */
		var remove_handler = function (target, func) {
			var funcname = "on" + event_name;

			if (Object.isFunction  (target[funcname])) {
				if (target[funcname].multicast)
					if (func) func.ignore ();
				else
					if (target[funcname] == func) delete target[funcname];
			}
		};

		//--------------------------------------------------------------------
		/**
		 * Returns the event type being broadcast
		 * @name Broadcast#getType
		 * @function
		 * @return Name of event type
		 * @type string
		 */
		this.getType = function () {
			return event_name;
		};

		//--------------------------------------------------------------------
		/**
		 * Adds a target object to the broadcast.  Events of the specified 
		 * type from thi target will be broadcast from this point on.
		 * @name Broadcast#add
		 * @function
		 * @param {object} target
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns Broadcast object for chain calls
		 * @type Broadcast
		 */
		this.add = function (target) {
			var uid;
			var func = null;

			if (typeof (target) == "object" || typeof (target) == "function") {
				uid = target["_bcast_id"];

				if (!uid) {
					uid = Core._("Helpers.Unique").simple();
					target["_bcast_id"] = uid;
				}

				if (this.count () > 0) func = add_handler (target);

				pvt.targets[uid] = ({ "target": target, "func": func });
			}
			else {
				throw new TypeError ("Broadcast.add(): Parameter 1 " +
					"must be an object");
			}

			return this;
		};

		//--------------------------------------------------------------------
		/**
		 * Removes a target object from the broadcast.
		 * @name Broadcast#remove
		 * @function
		 * @param {object} target
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns Broadcast object for chain calls
		 * @type Broadcast
		 */
		this.remove = function (target) {
			if (typeof (target) == "object") {
				remove_handler (target, pvt.targets[target._bcast_id].func);
				delete pvt.targets[target._bcast_id];
			}
			else {
				throw new TypeError ("Broadcast.remove(): Parameter 1 " +
					"must be an object");
			}

			return this;
		};

		//--------------------------------------------------------------------
		/**
		 * Adds a listener to the broadcast.  Will be called any time one of
		 * the target objects fires off an event of the type specified to the
		 * constructor.
		 * @name Broadcast#listen
		 * @function
		 * @param {function} listener
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Same as <i>Multicast.listen()</i>
		 * @type object
		 */
		this.listen = function (listener) {
			var _add_handler = add_handler;

			if (this.count () == 0 && Object.isFunction (listener)) {
				$H(pvt.targets).each (function (pairs) {
					pairs.value.func = _add_handler (pairs.value.target);
				}.bind (this));
			}

			return pvt.mcast_listen (listener);
		};

		//--------------------------------------------------------------------
		/**
		 * Removes listener function from the broadcast.
		 * @name Broadcast#ignore
		 * @function
		 * @param {function} listener
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Same as <i>@see Multicast#listen()</i>
		 * @type object
		 */
		this.ignore = function (listener) {
			var _remove_handler = remove_handler;	//Carry over upvalues to Hash.each()
			var _event_name = "on" + event_name;

			//Last listener, remove handler from targets
			if (this.count () == 1 && Object.isFunction (listener)) {
				$H(pvt.targets).each (function (pairs) {
					var target = pairs.value.target;
					var func = pairs.value.func;

					_remove_handler (target, func);

					if (Object.isFunction  (target[_event_name])) {
						if (target[_event_name].multicast) {
							if (target[_event_name].multicast.count() == 0) {
								delete target[_event_name];
							}
						}
					}
				}.bind (this));
			}

			return pvt.mcast_ignore (listener);
		};

		//--------------------------------------------------------------------
		for (i = 3; i < arguments.length; i++) {
			var targets = arguments[i];

			if (Object.isArray (targets))
				$A(targets).each (function (target) {
					if (typeof (target) != "undefined") 
						this.add (target);
				}.bind (this));
			else if (typeof (targets) != "undefined")
				this.add (targets);
		}
	}
});

