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
Core.extend ("Controller", "Interpreter", /** @lends Controller */ (function () {
	var _type = Core._("Helpers.Type");
	var _ref_class = Core.getClass ("Reference");
	var _handler, _register, _get_listener, _immediate_mode_onchange, oninit;
	var _initialize, _uninitialize, _batch_start, _batch_end;
	var create_batch, batch;
	var _register_simple;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @constructs
	 * @param {Context} context Description
	 */
	oninit = function (context) {
		//var _actions = new Array ();
		var _run;

		this.view = Core._("Property");
		this.immediateMode = Core._("Property", false);
		this.immediateMode.onchange = _immediate_mode_onchange.bind (this);
		this.context (context || Core._("NodeContext"));

		this._actions = new Array ();

		this.assign ("_controllers", {});
		this.assign ("_models", {});
		this.assign ("_events", {});

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
			if (_type.isArray (arguments[0])) {
				var batch = arguments[0];
				var i, args;

				for (i = 0, args=batch[0]; i < batch.length; args=batch[++i]) {
					if (_type.isArray (args)) {
						this.action.apply (this, args);
					}
				}
			}
			else {
				var args = new Array ();
				var action_name = arguments[0];
				var action;
				var arg_val;

				if (action_name instanceof _ref_class)
					action_name = action_name.getValue ();

				for (var i = 1; i < arguments.length; i++) {
					arg_val = arguments[i];

					if (arg_val instanceof _ref_class)
						args.push (arg_val.getValue ());
					else
						args.push (arg_val);
				}

				action = {
					action: action_name,
					arguments: args
				};

				if (!Event.isEvent (args[0])) {
					args.unshift (window.event || { clientX: 0 });
				}

				this._actions.push (action);

				if (_type.isFunction (this.onaction)) 
					this.onaction (action_name, action);
			}
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
			var actions = this._actions;
			var result;

			this._actions = new Array ();
			result = _run (actions);

			return result;
		};

		this.handler (_handler);
		this.register = _register;
		this.registerSimple = _register_simple;
		this.getListener = _get_listener;

		this.register ("initialize", _initialize);
		this.register ("uninitialize", _uninitialize);
		this.register ("batch_start", _batch_start);
		this.register ("batch_end", _batch_end);

		this.action ("initialize");
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#$initialize
	 * @function
	 */
	_initialize = function () {
		if (_type.isFunction (this.onstartup)) return this.onstartup ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#$uninitialize
	 * @function
	 */
	_uninitialize = function () {
		if (_type.isFunction (this.onshutdown)) return this.onshutdown ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#$batch_start
	 * @function
	 */
	_batch_start = function () {
		if (_type.isFunction (this.onbatchstart)) this.onbatchstart ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Controller#$batch_end
	 * @function
	 */
	_batch_end = function () {
		if (_type.isFunction (this.onbatchend)) this.onbatchend ();
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

		this.registerSimple (action_name, action_handler);
		self[name.replace (/[\.]/g, "_")] = this.getListener (action_name);
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

		this.context ().register (action_name, function (action, params, nodes) {
			return action_handler.apply (this, params);
		});
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
		oninit: oninit,
		createBatch: create_batch,
		batch: batch
	};
}) (), {
	test: function () {
		var _output = "";
		var batch_ctrl = Core._ ("Controller");

		batch_ctrl.register ("test1", function (event, arg1, arg2) {
			_output += "test1 " + arg1 + " " + arg2 + " ";
		});
		batch_ctrl.register ("test2", function (event, arg1, arg2) {
			_output += "test2 " + arg1 + " " + arg2 + " ";
		});
		batch_ctrl.register ("test3", function (event, arg1, arg2) {
			_output += "test3 " + arg1 + " " + arg2 + " ";
		});
		batch_ctrl.onstartup = function () {
			this.immediateMode (true);
		};
		batch_ctrl.onbatchstart = function () {
			_output += "Batch starting ";
		};
		batch_ctrl.onbatchend = function () {
			_output += "Batch ended";
		};

		var batch = Core._("Batch", batch_ctrl, "arg1", "arg2");
		var batch_func = batch.getFunction ();
		var batch_data = {
			this_value: 100,
			that_value: 200
		};

		batch_ctrl.run ();

		batch.action ("test1", 1, Core._("Reference", batch_data, "this_value"));
		batch.action ("test2", Core._("Reference", batch, "get", "arg1"), Core._("Reference", batch, "get", "arg2"));
		batch.action ("test3", 5, Core._("Reference", batch_data, "that_value"));

		//batch.assign ({ arg1: 37, arg2: "Jason Flaherty" });
		//batch.run ();

		batch_func (37, "Jason Flaherty");

		if (_output == "Batch starting test1 1 100 test2 37 Jason Flaherty test3 5 200 Batch ended")
			return true;

		return false;
	}
});

/*---------------------------------------------------------------------------*/
Core.extend ("Batch", "Container", /** @lends Batch */ (function () {
	var _type = Core._("Helpers.Type");
	var _ref_class = Core.getClass ("Reference");
	var oninit, action, run, map, get_function;
	var _default_value = false;

	//-------------------------------------------------------------------------
	/**
	 * @class Batch handles automated controller actions
	 * @constructs
	 * @param {Controller} controller Description
	 */
	oninit = function (controller) {
		this._controller = Core._ ("Property", controller);
		this._mappings = _default_value;
		this._actions = new Array (new Array ("batch_start"));
		this._is_closed = false;

		for (var i = 1; i < arguments.length; i++) {
			this.map (arguments[i]);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#action
	 * @function
	 * @param {mixed} ... Description
	 * @return Description
	 * @type Batch
	 */
	action = function () {
		var action_name = arguments[0];

		if (!this._is_closed) {
			if (_type.isString (action_name) || action_name instanceof _ref_class)
				this._actions.push ($A(arguments));
		}

		return this;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#run
	 * @function
	 */
	run = function (controller) {
		controller = controller || this._controller ();

		if (!this._is_closed) {
			this._actions.push (new Array ("batch_end"));
			this._is_closed = true;
		}

		if (controller) controller.action (this._actions);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#map
	 * @function
	 * @param {String} arg_name Description
	 * @return Description
	 * @type Batch
	 */
	map = function (arg_name) {
		if (_type.isString (arg_name)) {
			if (this._mappings === false)
				this._mappings = new Array ();

			this._mappings.push (arg_name);
		}

		return this;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#getFunction
	 * @function
	 * @param {mixed} ... Description
	 * @return Description
	 * @type Function
	 */
	get_function = function (controller) {
		return function () {
			for (var i = 0; i < this._mappings.length; i++) {
				this.assign (this._mappings[i], arguments[i]);
			}

			this.run (controller);
		}.bind (this);
	};

	return {
		oninit: oninit,
		action: action,
		run: run,
		map: map,
		getFunction: get_function
	};
}) ());


