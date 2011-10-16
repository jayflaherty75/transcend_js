//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcController", "TransportController", /** @lends XmlRpcController */ (function () {
	var _type = Core._("Helpers.Type");
	var _convert_json = Core._("Helpers.XmlRpc").convertJson;
	var oninit, onstartup, onsend, _debug_onchange;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @extends TransportController
	 * @constructs
	 */
	oninit = function () {
		this.client = Core._("Property");

		this.debug.onchange = _debug_onchange.bind (this);
	};

	//-------------------------------------------------------------------------
	onstartup = function () {
		var client = new xmlrpc_client (this.get ("server"));

		client.no_multicall = false;

		this.client (client);
		this.debug (this.get ("debug"));
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#onsend
	 * @function
	 * @param {xmlrpcmsg} message Description
	 * @param {Function} handler Description
	 */
	onsend = function (message, handler) {
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
	};

	//-------------------------------------------------------------------------
	_debug_onchange = function (newval, oldval) {
		var value = _type.isBoolean (newval) ? newval : oldval;

		this.client ().setDebug (value ? 2 : 0);

		return value;
	};

	return {
		oninit: oninit,
		onstartup: onstartup,
		onsend: onsend
	};
}) ());

