//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core.extend ("Controller", "Interpreter2", /** @lends Controller */ (function () {
	var _type = Core._("Helpers.Type");
	var _handler, _register, _get_listener, _immediate_mode_onchange, oninit;
	var _register_simple;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @constructs
	 * @param {Context} context Description
	 */
	oninit = function (context) {
		var _actions = new Array ();
		var _run;

		this.view = Core._("Property");
		this.immediateMode = Core._("Property", false);
		this.immediateMode.onchange = _immediate_mode_onchange.bind (this);

		this.context (context || Core._("NodeContext"));

		_run = this.run.bind (this);

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name Controller#action
		 * @function
		 * @param {String} action_name Description
		 * @param {Event} event Optional. Description
		 * @param {varargs} ... Description
		 */
		this.action = function () {
			var args = $A(arguments);
			var action_name = args.shift();
			var action = {
				action: action_name,
				arguments: args
			};

			if (!Event.isEvent (args[0])) {
				args.unshift (window.event || { clientX: 0 });
			}

			_actions.push (action);

			if (_type.isFunction (this.onaction)) 
				this.onaction (action_name, action);
		};

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name Controller#run
		 * @function
		 * @return Description
		 * @type mixed|false
		 */
		this.run = function () {
			var actions = _actions;
			var result;

			_actions = new Array ();
			result = _run (actions);

			return result;
		};

		this.handler (_handler);
		this.register = _register;
		this.registerSimple = _register_simple;
		this.getListener = _get_listener;

		this.register ("initialize", function () {
			if (_type.isFunction (this.onstartup)) return this.onstartup ();
		});

		this.register ("uninitialize", function () {
			if (_type.isFunction (this.onshutdown)) return this.onshutdown ();
		});

		this.action ("initialize");
	};

	//-------------------------------------------------------------------------
	/**
	 * Private. Description
	 * @name Controller#_handler
	 * @function
	 * @param {mixed} symbol Description
	 */
	_handler = function (symbol) {
		if (_type.isObject (symbol)) {
			symbol = $H(symbol);

			this.id = symbol.unset ("action");
			//this.nodes = symbol.unset ("_nodes");
			this.parameters = symbol.unset ("arguments");

			if (_type.isUndefined (this.id)) {
				this.parameters = { error: "Command identifier not found" };
			}
		}
		else {
			this.parameters = { error: "Symbol must be an object" };
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#register
	 * @function
	 * @param {String} action_name Description
	 * @param {Function} action_handler Description
	 */
	_register = function (action_name, action_handler) {
		var self = this;
		var name = "$" + action_name;

		if (_type.isUndefined (self[name])) {
			this.registerSimple (action_name, action_handler);
			//this.context ().register (action_name, function (action, params, nodes) {
			//	return action_handler.apply (this, params);
			//}.bind (this));
			self[name] = this.getListener (action_name);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#registerSimple
	 * @function
	 * @param {String} action_name Description
	 * @param {Function} action_handler Description
	 */
	_register_simple = function (action_name, action_handler) {
		var self = this;

		if (_type.isUndefined (self[name])) {
			this.context ().register (action_name, function (action, params, nodes) {
				return action_handler.apply (this, params);
			}.bind (this));
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#getListener
	 * @function
	 * @param {String} action_name Description
	 * @return Description
	 * @type Function
	 */
	_get_listener = function (action_name) {
		return function () {
			var args = $A(arguments);

			args.unshift (action_name);
			this.action.apply (this, args);
		}.bind (this);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#immediateMode
	 * @function
	 * @param {boolean} mode Description
	 */
	_immediate_mode_onchange = function (mode, oldmode) {
		if (_type.isBoolean (mode)) {
			if (mode) {
				if (_type.isFunction (this.onaction)) {
					var mcast = this.onaction.multicast || Core._(
						"Multicast", this.onaction
					);
					mcast.listen (this.run.bind (this));
				}
				else {
					this.onaction = this.run.bind (this);
				}

				this.run ();		//Flush action stack
			}
			else {
				if (_type.isFunction (this.onaction)) {
					delete this.onaction;
				}
				//TODO: If a multicast, this.run() must be removed from it.
				//Binding makes this a little difficult.
			}

			return mode;
		};

		return oldmode;
	};

	return {
		oninit: oninit
	};
}) ());



