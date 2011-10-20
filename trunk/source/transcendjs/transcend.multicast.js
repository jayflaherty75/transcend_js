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
				//if (listener.multicast && listener.multicast != this) {
				//	listener.multicast.combine (pvt);
				//}
				//else {
					if (!Object.isFunction  (listener.ignore)) {
						listener.ignore = function () {
							this.ignore (listener);
						}.bind (this);
					}

					pvt.listeners.push (listener);
				//}
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

