
//-----------------------------------------------------------------------------
/**
 * @fileoverview Contextual data-driven interpreter intended for the purpose of
 * providing a central method of data processing where native JavaScript data
 * (JSON) may be "interpreted" as a language, taking the "code is data" mantra
 * to a new level.  The Context class allows for the context of the interpreter
 * to be defined, giving the interpreter the ability to act as a templating 
 * system, an action stack, a formatter, data converter, etc.<br /><br />
 * 
 * 	Date		2011-02-01<br />
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		Jason K. Flaherty coderx75@hotmail.com
 * @version		0.0.22
 */

//-----------------------------------------------------------------------------
Core.register("Context", /** @lends Context# */ {
	/**
	 * @class Context class for Interpreter.  Describes interpretation of 
	 * 	native JavaScript data (JSON), allowing data to be converted or 
	 * 	processed in any way.
	 * @constructs
	 * @see ContextHelpers
	 * @see Interpreter
	 */
	initialize: function () {
		var _commands = {};

		/**
		 * Engine property referencing Interpreter.  Can not be changed.
		 * @name Context#engine
		 * @type Property
		 */
		this.engine = Core._("Property"); //new Property ();
		/**
		 * Associative identifier of commands
		 * @name Context#command
		 * @type Property
		 */
		this.command = Core._("Property"); //new Property ("command");
		/**
		 * Associative identifier of data
		 * @name Context#identifier
		 * @type Property
		 */
		this.identifier = Core._("Property"); //new Property ("var");
		/**
		 * Associative identifier of child nodes
		 * @name Context#children
		 * @type Property
		 */
		this.children = Core._("Property"); //new Property ("_nodes");

		//Engine onchange handler, allowing only the interpreter to set it
		var _onchange = function (value, oldvalue) {
			if (Object.isUndefined (oldvalue))
				return value;
			else
				return oldvalue;
		};

		//--------------------------------------------------------------------
		/**
		 * Registers function handler to command name
		 * @name Context#register
		 * @function
		 * @param {string} command Arbitrary name of command
		 * @param {function} func Action handler
		 * @throws {TypeError} Parameter 1 must be a string, parameter 2 must
		 * 	be a function.
		 * @return Returns Context supporting chain calls
		 * @type Context
		 */
		this.register = function (command, func) {
			if (Object.isString (command)) {
				if (Object.isFunction (func)) {
					_commands[command] = func;
				}
				else
					throw new TypeError ("Context.register(): Parameter 1 " +
						"must be a string");
			}
			else
				throw new TypeError ("Context.register(): Parameter 2 " +
					"must be a function");

			return this;
		};

		//--------------------------------------------------------------------
		/**
		 * Call function, usually called from Interpreter, executing the given
		 * data as <i>args</i>.
		 * @name Context#call
		 * @function
		 * @param {string} command The name of the command to execute
		 * @param {object} args The data being processed
		 * @param {object} scope The functional environment, may be local 
		 * 		or global.
		 */
		this.call = function (command, args) {
			var result = null;

			if (!Object.isArray (args)) {
				if (typeof (args) == "object")
					args = [Object.clone (args)];
				else
					args = [args];
			}

			if (Object.isFunction (_commands[command])) {
				if (Object.isFunction (this.oncall))
					this.oncall.apply (this.engine(), [command].concat (args));
				result = _commands[command].apply (this.engine(), args);
			}
			else {
				if (Object.isFunction (this.ondefault)) {
					result = this.ondefault.apply (this.engine(), [command].concat (args));
				}
			}

			if (Object.isFunction (this.onresult))
				this.onresult.bind (this.engine()) (command, result);
		};

		//--------------------------------------------------------------------
		/**
		 * Makes an exact copy of the Context (used for nested implementations).
		 * @name Context#clone
		 * @function
		 * @return Cloned Context
		 * @type Context
		 */
		this.clone = function () {
			var _context = Object.clone (this);

			_context.engine = new Property ();
			_context.engine.onchange = _onchange;

			return _context;
		};

		//--------------------------------------------------------------------
		this.engine.onchange = _onchange;

		this.register ("type_array", function () {
			var args = $A(arguments);
			var context = this.getContext ();
			var cmd, action;

			for (this.index(0); !this.isEnd(); this.next()) {
				cmd = args[this.index()];

				if (cmd) {
					action = cmd[context.command()];

					if (!Object.isUndefined (action)) { 
						context.call (action, cmd);
					}
					else {
						throw Core._("Exceptions.InterpreterNoAction",
							"Action missing in " + $H(cmd).inspect ());
					}
				}
			}
		});
	}
});

//-----------------------------------------------------------------------------
Core.extend ("Interpreter", "Container", /** @lends Interpreter# */ {
	/**
	 * @class Contextual data-driven interpreter.  Interprets native JavaScript 
	 * 	data (evaluated JSON) as commands/actions.  The interpretation of the 
	 * 	"language" is described by the Context which is passed to the 
	 * 	Interpreter constructor. An associative array may be passed as the 
	 * 	scope, data referenced by the data to be processed.  The Interpreter 
	 * 	has many potential applications, such as templating systems, message 
	 * 	queues and data converters.
	 * @constructs
	 * @param {Context} context Context in which to process data
	 * @see Context
	 * @see ContextHelpers
	 */
	initialize: function (context) {
		var _parameters = {};
		var _chunk;

		/**
		 * Acts as the "instruction pointer" and may be used by some interpreters
		 * to allow branching
		 * @name Interpreter#index
		 * @type Property
		 */
		this.index = Core._("Property", 0, this);

		//--------------------------------------------------------------------
		/**
		 * Increments the index.  Some contexts may want incrementation to be
		 * handled by the instruction, or may implement it's own traversal.
		 * @name Interpreter#next
		 * @function
		 */
		this.next = function () { this.index(this.index() + 1); };

		//--------------------------------------------------------------------
		/**
		 * In array-based contexts, checks whether the index is at the end of
		 * the current instruction "chunk".
		 * @name Interpreter#isEnd
		 * @function
		 * @return True if EOF
		 * @type boolean
		 */
		this.isEnd = function () { return (this.index() >= this.length ()); };

		//--------------------------------------------------------------------
		/**
		 * In array-based contexts, returns the length of the "chunk".
		 * @name Interpreter#length
		 * @function
		 * @return Length of "chunk"
		 * @type int
		 */
		this.length = function () {
			if (Object.isArray (_chunk))
				return _chunk.length;
			else
				return 0;
		};

		//---------------------------------------------------------------------
		/**
		 * Handles assigned values for the base class.
		 * @name Interpreter#onset
		 * @function
		 * @param {string} key 
		 * @param {string} value 
		 */
		this.onset = function (key, value) { _parameters[key] = value; };

		//---------------------------------------------------------------------
		/**
		 * Handles requests for values from the base class.
		 * @name Interpreter#onget
		 * @function
		 * @param {string} key 
		 * @return Returns the value from the given key.
		 * @type Any
		 */
		this.onget = function (key) {
			if (!Object.isUndefined (key))
				return _parameters[key];
			else
				return _parameters;
		};

		//---------------------------------------------------------------------
		/**
		 * Handles requests to delete values.  If no key is passed, all values
		 * are cleared.
		 * @name Interpreter#onunset
		 * @function
		 * @param {string} key 
		 * @return Returns the deleted value from the given key.
		 * @type Any
		 */
		this.onunset = function (key) {
			if (!Object.isUndefined (key))
				delete _parameters[key];
			else
				_parameters = {};
		};

		//---------------------------------------------------------------------
		/**
		 * 
		 * @name Interpreter#oncopy
		 * @function
		 * @return 
		 * @type object
		 */
		this.oncopy = function () {
			return Object.clone (_parameters);
		};

		//--------------------------------------------------------------------
		/**
		 * Returns the context of the interpreter
		 * @name Interpreter#getContext
		 * @function
		 * @return Context of the interpreter
		 * @type Context
		 */
		this.getContext = function () { return context; };

		//--------------------------------------------------------------------
		/**
		 * Returns the type of a value as a special string representation.
		 * Used by interpreters that rely on data types as command names.
		 * @name Interpreter#getType
		 * @function
		 * @param {Any} value Any value from the data being processed
		 * @return Type of value with a prepended "type_".  Detects arrays.
		 * @type string
		 */
		this.getType = function (value) {
			var type = typeof (value);

			if (type == "object" && Object.isArray (value))
				type = "array";

			return "type_" + type;
		};

		//--------------------------------------------------------------------
		/**
		 * Given a "chunk" of data to be processed (other chunks may be 
		 * recursed, depending on context) and a scope (an associative array
		 * referenced by the chunk), processes the given data based on the
		 * context passed to the interpreter.  What this function does is
		 * entirely reliant upon the given {@link Context}. 
		 * @name Interpreter#run
		 * @function
		 * @param {Any} chunk
		 * @param {object} scope
		 * @return Data returned from oncomplete handler
		 * @type Any
		 */
		this.run = function (chunk) {
			_chunk = chunk;

			if (Object.isFunction (context.onstart))
				context.onstart.bind (this) (chunk);

			context.call (this.getType (chunk), chunk);

			if (Object.isFunction (context.oncomplete))
				return context.oncomplete.bind (this) ();
			else
				return null;
		};

		//--------------------------------------------------------------------
		this.index.onchange = function (value, oldvalue, self) {
			if (value < 0) value = 0;
			if (value > self.length()) value = self.length();

			return value;
		};

		context.engine (this);
	}
});

//-----------------------------------------------------------------------------
Core._("Helpers").register ("Context", new (Class.create ( /** @lends ContextHelpers# */ {
	/**
	 * @class Provides a container for all Contexts.
	 * @constructs
	 * @see Context
	 * @see Interpreter
	 */
	initialize: function () {
		var _base = Core.getClass ("Context");
		var _contexts = { "default": _base };

		//--------------------------------------------------------------------
		/**
		 * Given the prototype, extends the Context class and registers the
		 * new constructor under the name provided.
		 * @name ContextHelpers#register
		 * @function
		 * @param {string} name Given name of context
		 * @param {object} methods Class prototype of context
		 */
		this.register = function (name, methods) {
			_contexts[name] = Class.create (_base, methods);
		};

		//--------------------------------------------------------------------
		/**
		 * Provides a fallback context if no name is provided to 
		 * <i>getContext()</i>.
		 * @name ContextHelpers#setDefault
		 * @function
		 * @param {string} name Name of context to set as default
		 */
		this.setDefault = function (name) {
			_contexts["default"] = _contexts[name];
		};

		//--------------------------------------------------------------------
		/**
		 * Gets new instance of a registered context.  If no name is given,
		 * default set by <i>setDefault()</i> is used.  This is the default
		 * method, accessible by <i>Context._()</i>.
		 * @name ContextHelpers#getContext
		 * @function
		 * @param {string} name Name of context requested
		 * @return 
		 * @type Context
		 */
		this.getContext = function (name) {
			if (Object.isFunction (_contexts[name]))
				return new (_contexts[name]) ();
			else
				return new (_contexts["default"]) ();
		};

		this._ = this.getContext;
	}
})) ());

//-----------------------------------------------------------------------------
Core._("Exceptions").register ("InterpreterNoAction", 
	/**
	 * @lends InterpreterNoAction#
	 * @class Exception thrown when no action can be found by the interpreter.
	 * @constructs
	 * @param {string} msg Detailed description of error
	 */
	function (msg) {
		this.name = "InterpreterNoAction";
		this.message = msg;
		this.toString = function () {
			return this.name + ": " + this.message;
		};
	}
);



