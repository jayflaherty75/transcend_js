//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("TransportController", "Controller", /** @lends ConnectionController */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, send_action;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @constructs
	 * @param {ServerController} server Description
	 */
	oninit = function (settings, debug) {
		this.register ("send", send_action);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name ConnectionController#$send
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} message Description
	 * @param {Function} handler Description
	 */
	send_action = function (event, message, handler) {
		if (_type.isFunction (this.onsend))
			this.onsend (message);
	};

	return {
		oninit: oninit
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("ClientController", "Controller", /** @lends ServerController */ (function () {
	var oninit, onstartup;
	var send_action, success_action, error_action;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @constructs
	 */
	oninit = function () {
		this.register ("_send", send_action);
		this.register ("_success", success_action);
		this.register ("_error", error_action);
	};

	onstartup = function () {
		this.immediateMode (true);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name ServerController#$_send
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} message Description
	 * @param {Function} handler Description
	 */
	send_action = function (event, message, handler) {
		var controllers = this.get ("_controllers");

		if (message.multi_call) {
			for (controller in controllers) {
				controller.action ("send", message, handler);
			}
		}
		else {
			controllers["primary"].action ("send", message, handler);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name ServerController#$_success
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} response Description
	 * @param {Function} handler Description
	 */
	success_action = function (event, response, handler) {
		handler (response, true);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name ServerController#$_error
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} response Description
	 * @param {Function} handler Description
	 */
	error_action = function (event, response, handler) {
		handler (response, false);
	};

	return {
		oninit: oninit,
		onstartup: onstartup
	};
}) ());





// Everything thing from this point on is deprecated.

/*---------------------------------------------------------------------------*/
Core._("Helpers")._("Context").register ("XMLRPC_Message", {
	initialize: function ($super) {
		$super ();

		var _messages = null;

		/*-------------------------------------------------------------------*/
		//Default context properties
		this.command ("operation");
		this.identifier ("var");
		this.children ("_nodes");

		/*-------------------------------------------------------------------*/
		//Contextual behaviors for interpreter
		this.onstart = function (chunk) {
			_messages = new Array ();
		};

		this.onresult = function (command, result) {
			_messages.push (result);
		};

		this.oncomplete = function (scope) {
			return _messages;
		};

		/*-------------------------------------------------------------------*/
		//Registered contextual commands
		this.register ("type_array", function () {
			var args = $A(arguments);
			var context = this.getContext ();
			var msg;

			while (msg = args.shift()) {
				context.call (this.getType (msg), msg);
			}
		});

		this.register ("type_object", function (message) {
			var method = message.method || "Action.Execute";
			var temp, id, param;
			var actparams = {};
			var modules = $H(message.parameters).keys();

			for (var i = 0; i < modules.length; i++) {
				temp = {};
				id = modules[i];
				param = message.parameters[id];

				$H(param).each (function (pair) {
					if (!Object.isFunction (pair.value)) {
						temp[pair.key] = new xmlrpcval (pair.value, "string");
					}
				});

				actparams[id.toString ()] = new xmlrpcval (temp, "struct");
			}

			var params = new Array (
				new xmlrpcval (message.operation, "string"),
				new xmlrpcval (actparams, "struct"),
				new xmlrpcval (this.get ("user_id"), "int")
			);

			return new xmlrpcmsg (method, params);
		});

		this.register ("batch", function (actions) {
		});
	}
});

//-----------------------------------------------------------------------------
Core.register ("Proxy",  /** @lends Proxy# */ {
	/**
	 * @class Proxy object that acts as a placeholder for objects that have not 
	 * 	been loaded yet.  Proxy "becomes" object once it has been loaded.
	 * @constructs
	 */
	initialize: function (model) {
		var prvt = {
			isLoading: true,
			self: this
		};

		//--------------------------------------------------------------------
		/**
		 * Description, events, exceptions
		 * @name Proxy#isLoading
		 * @function
		 * @return True if nothing has been loaded, even before any load
		 * 	process has been started.  Returns false after the Proxy has taken
		 * 	on the form of the loaded object.
		 * @type boolean
		 */
		this.isLoading = function () {
			return prvt.isLoading;
		};

		//--------------------------------------------------------------------
		/**
		 * Description, events, exceptions
		 * @name Proxy#load
		 * @function
		 * @param {object} obj Description
		 * @return Description
		 * @type type
		 */
		this.load = function (obj) {
			var self = prvt.self;

			if (self.isLoading) {
				$H(obj).each (function (pairs) {
					self[pairs.key] = pairs.value;
				});

				if (Object.isFunction (self.onload)) self.onload (self);
				prvt.isLoading = false;
			}

			return self;
		};
	}
});

//-----------------------------------------------------------------------------
Core.extend ("ClientConnection", "Interpreter", /** @lends ClientConnection */ {
	/**
	 * @class 
	 * @constructs
	 */
	initialize: function ($super, _url, _debug) {
		$super (Core._("Helpers.Context.XMLRPC_Message"));

		var class_ref = Core.getClass ("ClientConnection");
		var _name = "ClientConnection" + Core._("Helpers.Unique").simple ();
		var _client = new xmlrpc_client (_url);
		var _operations;
		var _actions = new Array ();
		var _process;
		var _run = this.run.bind (this);

		this.location = Core._("Constant", _url);
		this.isDebug = Core._("Constant", _debug);
		this.isConnected = Core._("Property", false);

		var response_recurse = function (value) {
			switch (value.kindOf ()) {
				case "scalar":
					return value.scalarVal();
				case "array":
					var response = new Array ();

					for (var i = 0; i < value.arraySize (); i++) {
						response.push (response_recurse (value.arrayMem (i)));
					}

					return response;
				case "struct":
					//TODO: Handle RPC struct responses
					return value.scalarVal();
			}
		};

		var response_handler = function (response) {
			var action = arguments[1];

			if (response.faultCode ()) {
				if (Object.isFunction (class_ref.onerror)) 
					class_ref.onerror (response.faultString ());

				if (Object.isFunction (action.onfailure)) 
					action.onfailure (response.faultString ());
			}
			else {
				var value = response_recurse (response.value ());

				if (action.proxy instanceof Core.getClass ("Proxy"))
					action.proxy.load (value);

				if (Object.isFunction (action.onsuccess)) 
					action.onsuccess (value);
			}
		};

		var connect_success = function (response) {
			_operations = response;

			this.isConnected (true);

			_process = new Process (_name, this.run.bind(this), 0.5);
			_process.start ();

			if (Object.isFunction (class_ref.onconnect))
				class_ref.onconnect (this);
		};

		var response_loginuserid = function (user_id) {

			if (userid != 0) {
				if (Object.isFunction (this.onlogin))
					if (!this.onlogin (user_id)) return;

				this.assign ("user_id", user_id);
				//Cookie.Set ("userid", this.userid);
			}
		};

		var response_loginkey = function (userkey) {
			var hashpass = hex_md5 (this.get ("pass") + userkey);

			this.execute ({
				method: "Action.Login",
				parameters: [this.get ("user"), hashpass],
				onsuccess: response_loginuserid.bind (this)
			});
		};

		var response_logout = function (response) {
			if (Object.isFunction (this.onlogout))
				this.onlogout (response);

			this.assign ({ user_id: 0, user: "", pass: "", key: "" });

			//Cookie.Delete ("userid");
		};

		this.run = function () {
			var actions = _actions;
			var result;

			_actions = new Array ();
			result = _run (actions);

			for (var i = 0; i < result.length; i++) {
				if (result[i]) {
					_client.send (result[i], 30, 
						response_handler.bindAsEventListener (this, actions[i]));
				}
			}
		};

		this.login = function (user, pass) {
			var request;

			if (this.get ("user_id") == 0) {
				this.assign ("user", user);
				this.assign ("pass", Core._("Helpers.MD5").hex_md5 (pass));

				this.execute ({
					method: "Action.LoginRequest",
					onsuccess: response_loginkey.bind (this)
				});
			}
		};

		this.logout = function () {
			if (this.get ("user_id") != 0) {
				this.execute ({
					method: "Action.Logout",
					onsuccess: response_logout.bind (this)
				});
			}
		};

		this.execute = function (action) {
			if (Object.isFunction (this.onaction)) {
				if (!this.onaction (action)) return;
			}
			_actions.push (action);
		};

		this.getOperations = function () {
			return _operations;
		};

		_client["debug"] = _debug || 0;
		_client["no_multicall"] = false;

		this.assign ("user_id", 0);

		this.execute ({
			method: "Action.GetOperations",
			onsuccess: connect_success.bind (this)
		});

		this.run ();
	}
});

//-----------------------------------------------------------------------------
Core.register ("ClientAction", /** @lends ClientAction */ {
	/**
	 * @class 
	 * @constructs
	 */
	initialize: function () {	//allows multiple connection parameters
		var _connections = $A(arguments);

		this.operation = _connections.shift ();
		this.parameters = {};

		this.setParameter = function (index, name, value) {
			var parameters = this.parameters[index];

			if (!parameters) {
				parameters = {};
				this.parameters[index] = parameters;
			}

			for (var i = 0; i < index - 1; i++)		//Fill in the gaps
				if (!this.parameters[i]) this.parameters[i] = {};

			parameters[name] = value;

			return this;
		};

		this.getParameter = function (index, name) {
			var parameters = this.parameters[index];

			if (parameters)
				return parameters[name];
			else
				return null;
		};

		this.addConnection = function (connection) {
			_connections.push (connection);
		};

		this.execute = function () {
			$A(_connections).each (function (connection) {
				connection.execute (this);
			}.bind (this));
		};
	}
});

//-----------------------------------------------------------------------------
Core.register ("Client", /** @lends Client */ {
	/**
	 * @class 
	 * @constructs
	 */
	initialize: function (_debug) {
		var _connections = new Array ();

		this.connect = function (url) {
			var class_ref = Core.getClass("Client");
			var connections = class_ref["connections"];
			var connection = false;

			if (connections == null) {
				connections = new Array ();
				class_ref["connections"] = connections;
			}
			else {
				for (var i = 0; i < connections.length; i++) {
					if (connections[i].location() == url)
						connection = connections[i];
				}
			}

			if (!connection) {
				connection = new (Core.getClass ("ClientConnection")) (url, _debug);
				connections.push (connection);
			}

			_connections.push (connection);

			return connection;
		};

		this.execute = function (action) {
			if (Object.isFunction (this.onaction)) {
				if (!this.onaction (action)) return;
			}

			$A(_connections).each (function (connection) {
				connection.execute (action);
			}.bind (this));
		};

		this.batch = function () {
			this.execute ($A(arguments));
		};

		this.getAction = function (operation, proxy) {
			var action = new (Core.getClass ("ClientAction")) (operation);

			$A(_connections).each (function (connection) {
				action.addConnection (connection);
			});

			action.proxy = proxy;

			return action;
		};
	}
},
{
	connections: null
});





