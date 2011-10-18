
/*---------------------------------------------------------------------------*/
Core.extend ("Template", "Interpreter", {
	initialize: function ($super, context) {
		if (Object.isUndefined (context)) {
			context = Core._("Helpers.Context.DOM");
		}

		$super (context);
	},

	apply: function (chunk, target) {
		var context = this.getContext ();
		var result = this.run (chunk);

		if (target && Object.isFunction (context.onapply)) 
			context.onapply.bind (this) (target, result);

		return result;
	}
});

/*---------------------------------------------------------------------------*/
Core._("Helpers")._("Context").register ("DOM", {
	initialize: function ($super) {
		$super ();

		/*-------------------------------------------------------------------*/
		//Default context properties
		this.command ("action");
		this.identifier ("id");
		this.children ("_nodes");

		/*-------------------------------------------------------------------*/
		//Registered contextual commands, may override existing DOM elements
		this.register ("apply-attributes", function (args) {
			var context = this.getContext ();
			var id_key = context.identifier ();
			var cmd_key = context.command ();
			var nodes_key = context.children ();
			var command, id, childNodes, data;

			args = $H(args);
			command = args.unset (cmd_key);
			id = args.unset (id_key);
			childNodes = args.unset (nodes_key);

			data = context.readData (id, this.get ());

			if (typeof (data) == "object") {
				$(this.get ("_parent")).writeAttribute (context.copyObject (data));
			}

			return [];
		});

		this.register ("apply-style", function (args) {
			var context = this.getContext ();
			var id_key = context.identifier ();
			var cmd_key = context.command ();
			var nodes_key = context.children ();
			var command, id, childNodes, data;

			args = $H(args);
			command = args.unset (cmd_key);
			id = args.unset (id_key);
			childNodes = args.unset (nodes_key);

			data = context.readData (id, this.get ());

			if (typeof (data) == "object")
				$(this.get ("_parent")).setStyle (context.copyObject (data));

			return [];
		});

		this.register ("text", function (args) {
			var context = this.getContext ();
			var id_key = context.identifier ();
			var id = args[id_key];
			var content = context.readData (id, this.get ());
			var element;

			if (typeof (content) == "string")
				element = document.createTextNode (content);
			else if (typeof (args["content"]) == "string")
				element = document.createTextNode (args["content"]);
			else
				element = document.createTextNode ("");

			if (id) this.setElement (id, element);

			return [ element ];
		});
	},

	/*-----------------------------------------------------------------------*/
	//Default function for undefined commands
	ondefault: function (command, args) {
		var context = this.getContext ();
		var id_key = context.identifier ();
		var cmd_key = context.command ();
		var nodes_key = context.children ();
		var id = args[id_key];
		var childNodes;
		var output = new Array ();
		var data;
		var count;

		args = $H(args);
		command = args.unset (cmd_key);
		childNodes = args.unset (nodes_key);
		data = context.processData (id, args, this.get ());
		count = (data.length || 1);

		for (var i = 0; i < count; i++) {
			var element = new Element (command, args.toObject ());
			var element_data = data[i];

			if (typeof (childNodes) == "object")
				context.appendNodes (element, childNodes, this.get (), element_data);

			context.writeData (element, element_data);
			output.push (element);

			if (id) this.setElement (id, element);
		}

		return output;
	},

	/*-----------------------------------------------------------------------*/
	//Contextual behaviors for interpreter
	onstart: function (chunk) {
		var _globals = this.get("_globals");

		this.accumulator = new Array ();

		if (Object.isUndefined (_globals)) {
			this.assign ("_elements", {});
			this.assign ("_globals", this.get ());
			_globals = this.get ();
		}

		this.setElement = function (id, element) {
			var current = _globals._elements[id];

			if (Object.isUndefined (current)) 
				_globals._elements[id] = element;
			else if (Object.isArray (current))
				_globals._elements[id].push (element);
			else {
				_globals._elements[id] = new Array (current);
				_globals._elements[id].push (element);
			}
		};

		this.getElement = function (id) {
			return _globals._elements[id];
		};

		this._ = this.getElement;
	},

	onresult: function (command, result) {
		if (!Object.isUndefined (result)) {
			if (Object.isArray (result)) {
				$A(result).each (function (element) {
					this.accumulator.push (element);
				}.bind (this));
			}
			else this.accumulator.push (result);
		}
	},

	oncomplete: function () {
		return this.accumulator;
	},

	onapply: function (target, content) {
		$A(content).each (function (element) {
			target.appendChild (element);
		});
	},

	/*-----------------------------------------------------------------------*/
	//Context helper functions for command callbacks
	readData: function (id, scope) {
		var data = scope[id];

		if (Object.isUndefined (data)) data = scope._globals[id];

		return data;
	},

	processData: function (id, args, scope) {
		var data = this.readData (id, scope);

		if (!Object.isUndefined (data)) {
			if (Object.isArray (data)) {}
			else if (Object.isFunction (data)) {
				data = [data ()];
			}
			else if (typeof (data) == "object") {
				Object.extend (args, data);
				$H(args).each (function (pair) {
					if (Object.isFunction (pair.value)) {
						args[pair.key] = pair.value ();
					}
				});
				data = [""];
			}
			else data = [data];
		}
		else data = [""];

		return data;
	},

	writeData: function (element, data) {
		if (typeof (data) != "object") {
			if (Object.isFunction (data)) {
				element.appendChild (document.createTextNode (data ()));
			}
			else if (!Object.isUndefined (data) && data != "") {
				element.appendChild (document.createTextNode (data.toString ()));
			}
		}
	},

	copyObject: function (data) {
		var object = {};

		$H(data).each (function (pair) {
			if (Object.isFunction (pair.value))
				object[pair.key] = pair.value ();
			else
				object[pair.key] = pair.value;
		}.bind (this.engine()));

		return object;
	},

	runInstance: function (chunk, scope) {
		var inst_context = this.clone ();
		var instance = new (Core.getClass ("Interpreter")) (inst_context).assign (scope);

		return instance.run (chunk);
	},

	appendNodes: function (parent, nodes, scope, locals) {
		var _scope = { _globals: scope._globals, _parent: parent };

		if (scope._globals != scope)
			_scope = $H(scope).merge (_scope).toObject ();

		if (typeof (locals) == "object")
			_scope = $H(locals).merge (_scope).toObject ();

		$A(this.runInstance ($A(nodes).clone(), _scope)).each (
			function (child) {
				if (child) parent.appendChild (child);
			}.bind (this.engine ())
		);
	}
});




