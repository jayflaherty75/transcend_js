//-----------------------------------------------------------------------------
/**
 * @fileoverview Event casting system designed to bridge the gap between 
 * application and DOM events while allowing for complex interactions to be
 * easily implemented.  "Target" objects define their own hook-in functions
 * which may then be eventcast by the event system.  A Eventcast may be created
 * to handle a specific type of event but may receive these calls from multiple
 * targets.  Multiple Eventcasts may be assigned to the same target event.
 * Once created, other modules may then "listen" in on the Eventcast.<br /><br />
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		Jason K. Flaherty coderx75@hotmail.com
 */

//-----------------------------------------------------------------------------
Core.extend ("Eventcast", "Multicast", /** @lends Eventcast# */ {
	/**
	 * @class Manages a type of event for a group of target objects and allows 
	 * 	external code to "listen" for that event from any of the targets.  
	 * 	Eventcasts may multiple targets and multiple listeners, making it a 
	 * 	many-to-one-to-many design.  Targets may have separate Eventcasts for 
	 * 	each event but may also have multiple Eventcasts of the same event, 
	 * 	allowing for any configuration and for very complex interactions to be 
	 * 	easily implemented.<br /><br />
	 * 
	 * 	Hook-in function is only set if there are targets and listeners for the
	 * 	Eventcast.  No resources are wasted on empty calls.<br /><br />
	 * @extends Multicast
	 * @constructs
	 * @param {string} event_name Name of event to cast
	 * @param {any} memo Miscellaneous data to be passed along with event
	 * @param {object} targets Any number of target object parameters (optional)
	 * @return Eventcast
	 */
	initialize: function ($super, event_name, memo) {
		$super ();

		var _type = Core._("Helpers.Type");
		var pvt = {
			targets: {},
			mcast_listen: this.listen.bind (this),
			mcast_ignore: this.ignore.bind (this),
			self: this
		};

		//---------------------------------------------------------------------
		/**
		 * Handler function to be assigned to object's hook-in.  This calls
		 * <i>Multicast.call()</i> method along with event parameters sent
		 * by target object.
		 * @name Eventcast#multi_handler
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

		//---------------------------------------------------------------------
		/**
		 * Adds Eventcast function to target hook-in
		 * @name Eventcast#add_handler
		 * @function
		 * @param {object} target
		 * @return Function added to Eventcast hook-in.
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

		//---------------------------------------------------------------------
		/**
		 * Removes Eventcast function from target hook-in
		 * @name Eventcast#remove_handler
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

		//---------------------------------------------------------------------
		/**
		 * Returns the event type being Eventcast
		 * @name Eventcast#getType
		 * @function
		 * @return Name of event type
		 * @type string
		 */
		this.getType = function () {
			return event_name;
		};

		//---------------------------------------------------------------------
		/**
		 * Sets the memo to be passed along with events.
		 * @name Eventcast#setMemo
		 * @function
		 * @param {mixed} Any data to be passed along with the event.
		 * @return Returns "this" instance for use in chain calls.
		 * @type Eventcast
		 */
		this.setMemo = function (new_memo) {
			memo = new_memo;
			return this;
		};

		//---------------------------------------------------------------------
		/**
		 * Adds a target object to the Eventcast.  Events of the specified 
		 * type from thi target will be Eventcast from this point on.
		 * @name Eventcast#add
		 * @function
		 * @param {object} target
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns Eventcast object for chain calls
		 * @type Eventcast
		 */
		this.add = function () {
			var uid, events, func = null;

			for (i = 0; i < arguments.length; i++) {
				var target = arguments[i];

				if (Object.isArray (target))
					$A(target).each (function (t) {
						if (typeof (t) != "undefined") this.add (t);
					}.bind (this));
				else if (typeof (target) != "undefined") {
					if (typeof (target) == "object" || typeof (target) == "function") {
						uid = target["_bcast_id"];

						if (!uid) {
							uid = Core._("Helpers.Unique").simple();
							target["_bcast_id"] = uid;
						}

						events = target["_events"];

						if (!events) {
							events = {};
							target["_events"] = events;
						}

						if (_type.isUndefined (events[event_name]))
							events[event_name] = this;

						if (this.count () > 0) func = add_handler (target);

						pvt.targets[uid] = ({ "target": target, "func": func });
					}
				}
			}

			return this;
		};

		//---------------------------------------------------------------------
		/**
		 * Removes a target object from the Eventcast.
		 * @name Eventcast#remove
		 * @function
		 * @param {object} target
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns Eventcast object for chain calls
		 * @type Eventcast
		 */
		this.remove = function (target) {
			//TODO: allow multiple arguments and arrays of objects (see add())
			if (typeof (target) == "object") {
				remove_handler (target, pvt.targets[target._bcast_id].func);
				delete pvt.targets[target._bcast_id];
			}
			else {
				throw new TypeError ("Eventcast.remove(): Parameter 1 " +
					"must be an object");
			}

			return this;
		};

		//---------------------------------------------------------------------
		/**
		 * Adds a listener to the Eventcast.  Will be called any time one of
		 * the target objects fires off an event of the type specified to the
		 * constructor.
		 * @name Eventcast#listen
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

		//---------------------------------------------------------------------
		/**
		 * Removes listener function from the Eventcast.
		 * @name Eventcast#ignore
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

		//---------------------------------------------------------------------
		for (i = 3; i < arguments.length; i++) {
			var targets = arguments[i];

			if (typeof (targets) != "undefined")
				this.add (targets);
		}
	}
}, (function () {
	var _type = Core._("Helpers.Type");
	var _array = Core._("Helpers.Array");
	var _eventcast = Core.getClass ("Eventcast");
	var listen, get;

	//-------------------------------------------------------------------------
	/**
	 * Static. Adds a listener function to an object event.  Creates an 
	 * Eventcast object if none are present. 
	 * @name Eventcast#listen
	 * @function
	 * @param {object} object Target object or array of targets to listen to
	 * @param {string} event_name Event identifier
	 * @param {function} listener Listener function
	 * @return Returns Eventcast object for chain calls
	 * @type Eventcast
	 */
	listen = function (object, event_name, listener) {
		var objects = _type.isArray (object) ? _array.flatten (object) : [object];
		var events, ecast;

		object = objects[0];	//Base all actions on the first object passed.
		events = object["_events"];

		if (!events || _type.isUndefined (events[event_name])) {
			ecast = Core._("Eventcast", event_name).add (objects);
		}
		else {
			ecast = events[event_name].add (objects);
		}

		if (_type.isFunction (listener)) {
			ecast.listen (listener);
		}

		return ecast;
	};

	//-------------------------------------------------------------------------
	/**
	 * Static. Returns the Eventcast instance associated with a given
	 * object and event type
	 * @name Eventcast#get
	 * @function
	 * @param {object} object Target object or array of targets to listen to
	 * @param {string} event_name Event identifier
	 * @return Returns Eventcast object for chain calls or false if none found
	 * @type Eventcast|false
	 */
	get = function (object, event_name) {
		var events = object["_events"];

		if (_type.isDefined (events) && _type.isDefined (events[event_name])) {
			return events[event_name];
		}

		return false;
	};

	return {
		listen: listen,
		get: get
	};
}) ());

