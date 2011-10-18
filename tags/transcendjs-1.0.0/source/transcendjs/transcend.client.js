//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("ClientController", "Controller", /** @lends ServerController */ (function () {
	var _type = Core._("Helpers.Type");
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
	success_action = function (event, response) {
		if (_type.isFunction (this.onresponse))
			this.onresponse (response, true);
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
	error_action = function (event, response) {
		if (_type.isFunction (this.onresponse))
			this.onresponse (response, false);
	};

	return {
		oninit: oninit,
		onstartup: onstartup
	};
}) ());



