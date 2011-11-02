//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.register ("Multicast",  (function () {
	var _resultmethod_onchange;

	var Multicast = /** @lends Multicast.prototype */ {
		/**
		 * @class Function container, allowing multiple functions to be called at 
		 * 	once, each receiving the original parameters passed.<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link Eventcast}.
		 * @constructs
		 * @param {function} listener Any number of listener functions parameters
		 */
		initialize: function () {
			var _self = this;

			this._listeners = new Array ();
			this._binding = false;

			//-----------------------------------------------------------------
			/**
			 * For future use.  Some flexibility may be needed in how results 
			 * from multicalls are handled.  Originally, if there were more 
			 * than one listener, an array of results would be passed back.  
			 * This code is now commented out and replaced by logic to pass the 
			 * result of each subsequent listener as an argument to the next.  
			 * This avoids the confusion of which result should be used and 
			 * gives listeners much more power.  However, the array approach 
			 * may be needed in some cases.  If so, resultMethod will allow a 
			 * processing function to be selected.  Furthermore, it may be 
			 * possible to add new methods if the existing ones are not 
			 * sufficient.
			 * @name Multicast#resultMethod
			 * @type Property (string)
			 */
			this.resultMethod = new Core._ ("Property", "chain");
			this.resultMethod.onchange = _resultmethod_onchange;

			//-----------------------------------------------------------------
			/**
			 * Calls all contained functions.  Any parameters passed are 
			 * propagated to all functions.  This method never needs to be
			 * binded since it references itself through an upvalue.
			 * @name Multicast#call
			 * @function
			 * @param {...}
			 * @return Array containing the return values of all function.  If
			 * there is only one function contained, only that return value is
			 * returned.  If empty, returns undefined.
			 */
			this.call = function () {
				/*if (this._listeners.length == 1) {
					return this._listeners[0].apply (this, arguments);
				}
				else if (this._listeners.length > 1) {
					var result = new Array ();
	
					for (var i = 0; i < this._listeners.length; i++) {
						result.push (this._listeners[i].apply (this, arguments));
					}
	
					return result;
				}*/

				var args, result;

				for (var i = 0; i < _self._listeners.length; i++) {
					args = $A(arguments);
					if (typeof (result) != "undefined") args.push (result);

					if (_self._binding === false) {
						result = _self._listeners[i].apply (this, args);
					}
					else {
						result = _self._listeners[i].apply (_self._binding, args);
					}
				}

				return result;
			};

			this.call.multicast = this;

			//-----------------------------------------------------------------
			$A(arguments).each (function (listener) {
				if (!Object.isUndefined (listener))
					this.listen (listener);
			}.bind (this));
		},

		//---------------------------------------------------------------------
		/**
		 * Adds a listener function to Multicast container.
		 * @name Multicast#listen
		 * @function
		 * @param {function} listener Function to be added to listen for call
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns the Multicast object, allowing for call chains
		 * @type Multicast
		 */
		listen: function (listener) {
			if (Object.isFunction (listener)) {
				//if (listener.multicast && listener.multicast != this) {
				//	listener.multicast.combine (pvt);
				//}
				//else {
					if (!Object.isFunction  (listener.ignore)) {
						listener.ignore = function () {
							this.ignore (listener);
						}.bind (this);
					}

					this._listeners.push (listener);
				//}
			}
			else {
				throw new TypeError ("Multicast.listen(): Parameter 1 " +
					"must be a function");
			}

			return this;
		},

		//---------------------------------------------------------------------
		/**
		 * Removes listener function from Multicast container
		 * @name Multicast#ignore
		 * @function
		 * @param {function} listener Function to be removed
		 * @throws {TypeError} Parameter 1 must be a function
		 * @return Returns the Multicast object, allowing for call chains
		 * @type Multicast
		 */
		ignore: function (listener) {
			var index = false;

			if (Object.isFunction (listener)) {
				for (var i = 0; i < this._listeners.length; i++) {
					if (this._listeners[i] == listener) index = i;
				}

				if (index !== false) this._listeners.splice (index, 1);
			}
			else {
				throw new TypeError ("Multicast.ignore(): Parameter 1 " +
					"must be a function");
			}

			return this;
		},

		//---------------------------------------------------------------------
		/**
		 * Combines two multicasts, allowing each to control the same container.
		 * @name Multicast#combine
		 * @function
		 * @param {object} mcast_private Private members of target Multicast
		 * @private
		 */
		combine: function (mcast_private) {
			for (var i = 0; i < mcast_private._listeners.length; i++) {
				this._listeners.push (mcast_private._listeners[i]);
			}

			mcast_private._listeners = this._listeners;
		},

		//---------------------------------------------------------------------
		/**
		 * Returns the number of listener functions in Multicast container.
		 * @name Multicast#count
		 * @function
		 * @return Length of container
		 * @type int
		 */
		count: function () {
			return this._listeners.length;
		},

		//---------------------------------------------------------------------
		/**
		 * Binds an object to all calls in Multicast.
		 * @name Multicast#bind
		 * @function
		 * @param {object} Object to bind to all function calls in Multicast
		 * @return Returns the Multicast object, allowing for call chains
		 * @type Multicast
		 */
		bind: function (object) {
			this._binding = object;

			return this;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Selects a result handler method when resultMethod property is set.
	 * @memberOf Multicast.prototype
	 * @function
	 * @private
	 * @param {String} value Name of method
	 * @return Formatted name of method
	 * @type String
	 */
	_resultmethod_onchange = function (value) {
		return (value | "chain").toString ().toLowerCase ();
	};

	return Multicast;
}) ());

