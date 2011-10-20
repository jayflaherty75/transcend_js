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
Core.extend ("XmlRpcController", "TransportController", (function () {
	var _type = Core._("Helpers.Type");
	var _convert_json = Core._("Helpers.XmlRpc").convertJson;
	var _debug_onchange;

	var XmlRpcController = /** @lends XmlRpcController.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends TransportController
		 * @constructs
		 */
		oninit: function () {
			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name XmlRpcController#client
			 * @type Property
			 */
			this.client = Core._("Property");

			this.debug.onchange = _debug_onchange.bind (this);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name XmlRpcController#onstartup
		 * @function
		 */
		onstartup: function () {
			var client = new xmlrpc_client (this.get ("server"));

			client.no_multicall = false;

			this.client (client);
			this.debug (this.get ("debug"));
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name XmlRpcController#onsend
		 * @function
		 * @param {xmlrpcmsg} message Description
		 * @param {Function} handler Description
		 */
		onsend: function (message, handler) {
			var client = this.client();
			var response_handler = function (response) {
				if (response.faultCode ()) {
					handler (response.faultString (), false);
				}
				else {
					handler (_convert_json (response.value ()), true);
				}
			};

			if (_type.isArray (message)) {
				client.multicall (message, this.timeout (), response_handler, false);
				//response_handler (client.multicall (message, this.timeout (), null, false));
			}
			else {
				client.send (message, this.timeout (), response_handler);
			}
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#_debug_onchange
	 * @function
	 * @private
	 * @param {mixed} newval Description
	 * @param {mixed} oldval Description
	 * @return Description
	 * @type mixed
	 */
	_debug_onchange = function (newval, oldval) {
		var value = _type.isBoolean (newval) ? newval : oldval;

		this.client ().setDebug (value ? 2 : 0);

		return value;
	};

	return XmlRpcController;
}) ());

