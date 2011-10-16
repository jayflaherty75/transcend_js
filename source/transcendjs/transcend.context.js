//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.register ("Context", /** @lends Context */ (function () {
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
		if (_type.isUndefined (oldval) && (interpreter instanceof Core.getClass ("Interpreter"))) {
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

