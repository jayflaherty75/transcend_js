//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

/*---------------------------------------------------------------------------*/
Core.extend ("Controller", "Interpreter", (function () {
	var _type = Core._("Helpers.Type");
	var _ref_class = Core.getClass ("Reference");
	var _default_handler, _immediate_mode_onchange, oninit;
	var _initialize, _uninitialize, _batch_start, _batch_end;

	var Controller = /** @lends Controller.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends Interpreter
		 * @constructs
		 * @param {Context} context Description
		 */
		oninit: function (context) {
			var _event = Core._("Helpers.Event");
			//var _actions = new Array ();
			var _run;

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Controller#view
			 * @type Property
			 */
			this.view = Core._("Property");

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Controller#immediateMode
			 * @type Property
			 */
			this.immediateMode = Core._("Property", false);
			this.immediateMode.onchange = _immediate_mode_onchange.bind (this);

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Controller#_actions
			 * @private
			 * @type Array
			 */
			this._actions = new Array ();

			this.context (context || Core._("NodeContext"));

			this.assign ("_controllers", {});
			this.assign ("_models", {});

			_run = this.run.bind (this);

			//-----------------------------------------------------------------
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

					if (!_event.isEvent (args[0])) {
						args.unshift (window.event || { clientX: 0 });
					}

					this._actions.push (action);

					if (_type.isFunction (this.onaction)) 
						this.onaction (action_name, action);
				}
			};

			//-----------------------------------------------------------------
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

			this.handler (_default_handler);

			this.register ("initialize", _initialize);
			this.register ("uninitialize", _uninitialize);
			this.register ("batch_start", _batch_start);
			this.register ("batch_end", _batch_end);

			this.action ("initialize");
		},

		//-------------------------------------------------------------------------
		/**
		 * Description
		 * @name Controller#register
		 * @function
		 * @param {String} action_name Description
		 * @param {Function} action_handler Description
		 */
		register: function (action_name, action_handler) {
			var self = this;
			var name = "$" + action_name;

			this.registerSimple (action_name, action_handler);
			self[name.replace (/[\.]/g, "_")] = this.getListener (action_name);
		},

		//-------------------------------------------------------------------------
		/**
		 * Description
		 * @name Controller#registerSimple
		 * @function
		 * @param {String} action_name Description
		 * @param {Function} action_handler Description
		 */
		registerSimple: function (action_name, action_handler) {
			var self = this;

			this.context ().register (action_name, function (action, params, nodes) {
				return action_handler.apply (this, params);
			});
		},

		//-------------------------------------------------------------------------
		/**
		 * Description
		 * @name Controller#getListener
		 * @function
		 * @param {String} action_name Description
		 * @return Description
		 * @type Function
		 */
		getListener: function (action_name) {
			return function () {
				var args = $A(arguments);

				args.unshift (action_name);
				this.action.apply (this, args);
			}.bind (this);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @memberOf Controller.prototype
	 * @function
	 * @private
	 */
	_initialize = function () {
		if (_type.isFunction (this.onstartup)) return this.onstartup ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @memberOf Controller.prototype
	 * @function
	 * @private
	 */
	_uninitialize = function () {
		if (_type.isFunction (this.onshutdown)) return this.onshutdown ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @memberOf Controller.prototype
	 * @function
	 * @private
	 */
	_batch_start = function () {
		if (_type.isFunction (this.onbatchstart)) this.onbatchstart ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @memberOf Controller.prototype
	 * @function
	 * @private
	 */
	_batch_end = function () {
		if (_type.isFunction (this.onbatchend)) this.onbatchend ();
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @memberOf Controller.prototype
	 * @private
	 * @function
	 * @param {mixed} symbol Description
	 */
	_default_handler = function (symbol) {
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
	 * @memberOf Controller.prototype
	 * @private
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

					this.onaction = mcast.call.bind (mcast);
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

	return Controller;
}) (), 
(function () {
	var _type = Core._("Helpers.Type");

	//--------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @static
	 * @memberOf Controller
	 * @return true on pass, false on fail
	 * @type boolean
	 */
	var test = function () {
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
	};

	return {
		test: test
	};
}) ());

