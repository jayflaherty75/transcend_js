
/*---------------------------------------------------------------------------*/
Core.extend ("Controller", "Interpreter", {
	initialize: function ($super, context) {
		var _actions = new Array ();
		var _run;

		if (Object.isUndefined (context)) {
			//context = Core._("Helpers")._("Context")._("Controller");
			context = Core._("Helpers.Context.Controller");
		}

		$super (context);

		_run = this.run.bind (this);

		this.action = function () {
			var args = $A(arguments);
			var action_name = args.shift();
			var action = {
				action: action_name,
				arguments: args
			};

			if (!Event.isEvent (args[0])) args.unshift (window.event || { clientX: 0 });

			_actions.push (action);

			if (Object.isFunction (this.onaction)) 
				this.onaction (action_name, action);
		};

		this.run = function () {
			var actions = _actions;
			var result;

			_actions = new Array ();
			result = _run (actions);

			return result;
		};

		this.register ("initialize", function () {
			if (Object.isFunction (this.oninit)) this.oninit ();
		});

		this.action ("initialize");
	},

	register: function (action_name, action_handler) {
		var self = this;
		var name = "$" + action_name;

		if (Object.isUndefined (self[name])) {
			this.getContext ().register (action_name, action_handler);
			self[name] = this.getListener (action_name);
		}
		else {
			alert (action_name + " already exists");
			//TODO: Create new exception and call it here
		}
	},

	getListener: function (action_name) {
		return function () {
			var args = $A(arguments);

			args.unshift (action_name);
			this.action.apply (this, args);
		}.bind (this);
	}
});

/*---------------------------------------------------------------------------*/
Core._("Helpers")._("Context").register ("Controller", {
	initialize: function ($super) {
		$super ();

		/*-------------------------------------------------------------------*/
		//Default context properties
		this.command ("action");
		this.identifier ("id");
		this.children ("_nodes");

		/*-------------------------------------------------------------------*/
		//Registered contextual commands
		this.register ("type_array", function () {
			var args = $A(arguments);
			var context = this.getContext ();
			var cmd;

			while (cmd = args.shift()) {
				context.call (cmd[context.command()], cmd.arguments);
			}
		});
	}
});



