//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.register ("Context2", /** @lends Context2 */ (function () {
	/**
	 * @class A collection of rules and iterator mappings defining functionality 
	 * for an Interpreter instance.  Symbols are arbitrarily processed by the 
	 * interpreter's handler to produce an ID, parameters and possibly a set of 
	 * child symbols.  The ID is used to look up the rule registered to it and 
	 * passes the parameters to that rule.  Child nodes, if any, are also passed 
	 * to the rule as any type of data structure.  If a model is associated to 
	 * this structure, the default iterator for that model may be used by the 
	 * rule to traverse the data.  This may be overridden by mapping the data 
	 * type (model or basic type) to another iterator name, allowing finite 
	 * control of the interpretation of any data.
	 */
	var _type = Core._("Helpers.Type");

	var _interpreter_onchange = function (interpreter, oldval) {
		if (_type.isUndefined (oldval) && (interpreter instanceof Core.getClass ("Interpreter2"))) {
			//Though the global state should logically be created in the 
			//interpreter, creating in the context allows the interpreter to be
			//"linked".
			var state = interpreter.get ("_state");

			if (_type.isUndefined (state)) {
				state = {
					a: 0,						//Accumulator
					e: {
						message: false,			//Error message
						trace: new Array (),	//Stack trace
						warnings: new Array()	//Non-critical messages
					}
				};

				interpreter.assign ("_state", state);
			}

			if (_type.isFunction (this.onstart)) 
				interpreter.onstart = this.onstart;

			if (_type.isFunction (this.onresult))
				interpreter.onresult = this.onresult;

			if (_type.isFunction (this.oncomplete))
				interpreter.oncomplete = this.oncomplete;

			return interpreter;
		}

		return oldval;
	};

	//--------------------------------------------------------------------------
	/**
	 * Initializes collections of rules, iterator mappings and interpreter
	 * instance.
	 * @name Context#initialize
	 * @constructs
	 * @param {Interpreter} interpreter Interpreter instance to associate with
	 * 	context.
	 */
	var initialize = function () {
		this.rules = {};
		this.interpreter = Core._("Property");
		this.interpreter.onchange = _interpreter_onchange.bind (this);

		if (_type.isFunction (this.oninit)) this.oninit.apply (this, arguments);
	};

	//--------------------------------------------------------------------------
	/**
	 * Registers a rule to the given identifier.  The parameters and child nodes
	 * of any symbol with this identifier will be passed to the given rule.  The
	 * rule is an anonymous function of the following type:<br/>
	 * <i>boolean function (string id, object parameters, mixed nodes)</i>
	 * @name Context#register
	 * @function
	 * @param {string} id Description
	 * @param {function} func Description
	 * @param {type} index Description
	 * @return Description
	 * @type boolean
	 */
	var register = function (id, rule) {
		if (_type.isFunction (rule)) {
			id = _type.toString (id);
			this.rules[id] = rule;

			return true;
		}

		return false;
	};

	//--------------------------------------------------------------------------
	/**
	 * Accepts the ID, parameters and child nodes of a processed symbol and
	 * executes it's associated rule.  On error, the rule may place a message
	 * describing the event in the global state ("e.message") and return false.
	 * This method will then dump the symbol information into a string in an
	 * array ("e.trace"), causing a cascading effect and generating a stack
	 * trace. 
	 * @name Context#execute
	 * @function
	 * @param {Interpreter} interpreter Description
	 * @param {string} id Description
	 * @param {object} parameters Description
	 * @param {mixed} nodes Description
	 * @return Description
	 * @type type
	 */
	var execute = function (interpreter, id, parameters, nodes) {
		var rule = this.rules[id], result = false;
		var _type_reup = _type;

		if (!_type.isFunction (rule)) {
			rule = this.rules["_default"];
			if (Event.isEvent (parameters[0])) parameters[0] = id;
		}

		if (_type.isFunction (rule)) {
			result = rule.bind (interpreter) (id, parameters, nodes);

			if (!result) {
				var interpreter = this.interpreter();
				var state = interpreter.get ("_state");
				var is_first = true;
				var trace = id + " (";

				$H(parameters).each (function (pair) {
					var value_type = _type_reup._(pair.value);

					if (!is_first) trace += ", ";

					trace += pair.key + " = ";

					switch (value_type) {
					case "Number":
						trace += _type_reup.toString (pair.value);
						break;
					case "String":
						trace += "'" + pair.value + "'";
						break;
					default:
						trace += "'" + _type_reup.toString (pair.value) + "'";
					}

					is_first = false;
				});

				trace += ")";

				state.e.trace.push (trace);
			}
		}

		return result;
	};

	return {
		initialize: initialize,
		register: register,
		execute: execute
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("Interpreter2", "Container", /** @lends Interpreter2 */ (function () {
	/**
	 * @class Description
	 */
	var _type = Core._("Helpers.Type");

	//--------------------------------------------------------------------------
	/**
	 * Default handler function for processing symbols and setting their ID,
	 * parameters and, if any, child nodes.  This function is used as the symbol
	 * handler if no handler function is passed to the interpreter instance.
	 * The handler function acts as a method of the current command state and
	 * sets it's own id, parameters and nodes properties, taking the form:<br/>
	 * <i>function (mixed symbol)</i>
	 * @name Interpreter2#_handler
	 * @function
	 * @param {mixed} symbol Any symbol data that may be accessed via a model
	 */
	var _handler = function (symbol) {
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

	//--------------------------------------------------------------------------
	/**
	 * Constructor takes a context and an optional handler, creates a command
	 * state for building the current command and assigns the handler method
	 * for processing symbols.
	 * @name Interpreter2#oninit
	 * @constructs
	 * @param {Context} context Description
	 * @param {function} handler Description
	 */
	var oninit = function (context, handler) {
		var default_state = null;
		var _unbinded_handler;
		var _type_reup = _type;

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
		//	_unbinded_handler = _handler;

		this.model = Core._("Property");
		this.code = Core._("Property");

		this.context = Core._("Property");
		this.context.onchange = function (context, oldvalue) {
			if (context instanceof Core.getClass ("Context2")) {
				context.interpreter (this);
				return context;
			}
			return oldvalue;
		}.bind (this);

		this.handler = Core._("Property");
		this.handler.onchange = function (newhandler, oldhandler) {
			if (_type_reup.isFunction (newhandler)) {
				_unbinded_handler = newhandler;

				return newhandler.bind (_command_state);
			}

			return oldhandler;
		}.bind (this);

		this.getState = function () {
			return _command_state;
		};

		this.resetState = function () {
			_command_state["id"] = default_state;
			_command_state["nodes"] = default_state;
			_command_state["parameters"] = default_state;
		};

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name Interpreter2#spawn
		 * @function
		 * @return Description
		 * @type Interpreter2
		 */
		this.spawn = function () {
			var instance = Core._("Interpreter2", this.context(), _unbinded_handler);

			instance.link (this);
			instance.model (this.model ());

			return instance;
		};

		if (context) this.context (context);

		//this.handler = _unbinded_handler.bind (_command_state);
		this.handler (_type.isFunction (handler) ? handler : _handler);
	};

	//--------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Interpreter2#run
	 * @function
	 * @param {Iterator} iterator Description
	 * @return Description
	 * @type mixed|false
	 */
	var run = function (code) {
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
	};

	return {
		oninit: oninit,
		run: run
	};
}) (), {
	//--------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Interpreter2#test
	 * @function
	 * @return true on pass, false on fail
	 * @type boolean
	 */
	test: function () {
		var _type = Core._("Helpers.Type");
		var context = Core._("Context2");
		var interpreter = Core._("Interpreter2", context);
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
	}
});

