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
Core.extend ("Interpreter", "Container", (function () {
	var _type = Core._("Helpers.Type");
	var _default_handler;

	var Interpreter = /** @lends Interpreter.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Constructor takes a context and an optional handler, creates 
		 * a command state for building the current command and assigns the 
		 * handler method for processing symbols.<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link Context}.
		 * @extends Container
		 * @constructs
		 * @param {Context} context Description
		 * @param {function} handler Description
		 */
		oninit: function (context, handler) {
			var default_state = null;
			var _unbinded_handler;
			var _type_reup = _type;

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Interpreter#_command_state
			 * @private
			 * @type Object
			 */
			var _command_state = new (function () {
				return {
					id: default_state,
					parameters: default_state,
					nodes: default_state
				};
			}) ();

			//if (_type.isFunction (handler))
			//	_unbinded_handler = handler;
			//else
			//	_unbinded_handler = _default_handler;

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Interpreter#model
			 * @type Property
			 */
			this.model = Core._("Property");

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Interpreter#code
			 * @type Property
			 */
			this.code = Core._("Property");

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Interpreter#context
			 * @type Property
			 */
			this.context = Core._("Property");
			this.context.onchange = function (context, oldvalue) {
				if (context instanceof Core.getClass ("Context")) {
					context.interpreter (this);
					return context;
				}
				return oldvalue;
			}.bind (this);

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Interpreter#handler
			 * @type Property
			 */
			this.handler = Core._("Property");
			this.handler.onchange = function (newhandler, oldhandler) {
				if (_type_reup.isFunction (newhandler)) {
					_unbinded_handler = newhandler;
	
					return newhandler.bind (_command_state);
				}

				return oldhandler;
			}.bind (this);

			//-----------------------------------------------------------------
			/**
			 * Description, events, exceptions, example
			 * @name Interpreter#getState
			 * @function
			 * @return Description
			 * @type Object
			 */
			this.getState = function () {
				return _command_state;
			};

			//-----------------------------------------------------------------
			/**
			 * Description, events, exceptions, example
			 * @name Interpreter#resetState
			 * @function
			 */
			this.resetState = function () {
				_command_state["id"] = default_state;
				_command_state["nodes"] = default_state;
				_command_state["parameters"] = default_state;
			};

			//-----------------------------------------------------------------
			/**
			 * Description, events, exceptions, example
			 * @name Interpreter#spawn
			 * @function
			 * @return Description
			 * @type Interpreter
			 */
			this.spawn = function () {
				var instance = Core._("Interpreter", this.context(), _unbinded_handler);

				instance.link (this);
				instance.model (this.model ());

				return instance;
			};

			if (context) this.context (context);

			//this.handler = _unbinded_handler.bind (_command_state);
			this.handler (_type.isFunction (handler) ? handler : _default_handler);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name Interpreter#run
		 * @function
		 * @param {Iterator} iterator Description
		 * @return Description
		 * @type mixed|false
		 */
		run: function (code) {
			var context = this.context ();
			var state = this.get ("_state");
			var iterator, command, result = true;

			code = code || this.code ();

			if (_type.isDefined (code)) {
				if (_type.isFunction (this.onstart))
					result = this.onstart (code);

				if (result) {
					//TODO: Iterator must be retreived from context mapping first
					//and then fall back the the default iterator if not provided.
					//Either that or simply provide the default iterator in the
					//given model and do away with the context mappings.
					code = Core._("Model").modelize (code);
					iterator = code.getIterator ();

					this.iterator = iterator;
					this.symbol = iterator.first ();

					do {
						this.resetState ();
						this.handler () (Object.clone (this.symbol));
						command = this.getState ();
						result = _type.isDefined (command.id) ? context.execute (this, command.id, command.parameters, command.nodes) : false;
						if (_type.isFunction (this.onresult))
							result = this.onresult (command, result);

						this.symbol = this.iterator.next ();
					} while (!this.iterator.isEnd() && result);

					if (_type.isFunction (this.oncomplete))
						result = this.oncomplete (code);
				}

				if (result === false && _type.isFunction (this.onfailure))
					this.onfailure (code);

				return result;
			}
			else {
				return false;
			}
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Default handler function for processing symbols and setting their ID,
	 * parameters and, if any, child nodes.  This function is used as the symbol
	 * handler if no handler function is passed to the interpreter instance.
	 * The handler function acts as a method of the current command state and
	 * sets it's own id, parameters and nodes properties, taking the form:<br/>
	 * <i>function (mixed symbol)</i>
	 * @memberOf Interpreter.prototype
	 * @function
	 * @private
	 * @param {mixed} symbol Any symbol data that may be accessed via a model
	 */
	_default_handler = function (symbol) {
		if (_type.isObject (symbol)) {
			symbol = $H(symbol);

			this.id = symbol.unset ("action");
			this.nodes = symbol.unset ("_nodes");
			this.parameters = symbol.toObject ();

			if (_type.isUndefined (this.id)) {
				this.parameters = { error: "Command identifier not found" };
			}
		}
		else {
			this.parameters = { error: "Symbol must be an object" };
		}
	};

	return Interpreter;
}) (), 
(function () {
	var _type = Core._("Helpers.Type");

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @static
	 * @memberOf Interpreter
	 * @return true on pass, false on fail
	 * @type boolean
	 */
	var test = function () {
		var _type = Core._("Helpers.Type");
		var context = Core._("Context");
		var interpreter = Core._("Interpreter", context);
		var hw = [
			{ action: "foreach", data: "message", _nodes: [
				{ action: "print" },
				{ action: "print", text: "..." }
			]}
		];
		var tests = new Array (
			["Hello", "World"], 
			["Hello", "_World"]
		);
		var results = new Array (
			"Hello...World...",
			"Hello...Error: Invalid input ['print ()', 'foreach (data = \\'message\\')']"
		);
		var _output;
		var result = true;

		context.register ("foreach", function (id, params, nodes) {
			var name = params["data"];
			var data = Model.modelize (this.get (name));
			var iterator = data.getIterator ();
			var interpreter = this.spawn ();
			var element = iterator.first ();
			var state = interpreter.get ("_state");
			var result = true;

			while (!iterator.isEnd () && result) {
				state["d"] = element;
				result = interpreter.run (nodes);
				element = iterator.next ();
			};

			return result;
		});

		context.register ("print", function (id, params) {
			var text = params["text"] || this.get ("_state")["d"];

			if (text != "_World") {
				_output += text;
				return true;
			}

			this.get ("_state").e.message = "Invalid input";

			return false;
		});

		for (var i = 0; i < tests.length; i++) {
			_output = "";
			interpreter.assign ("message", tests[i]);

			if (!interpreter.run (hw)) {
				_output += "Error: ";
				_output += interpreter.get ("_state").e.message + " ";
				_output += $A(interpreter.get ("_state").e.trace).inspect ();
			}

			if (_output != results[i]) {
				if (console && _type.isDefined (console.log)) 
					console.log ("Interpreter Failed", _output);
				result = false;
			}
		}

		return result;
	};

	return {
		test: test
	};
}) ());

