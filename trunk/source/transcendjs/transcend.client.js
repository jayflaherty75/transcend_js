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
Core.extend ("ClientController", "Controller", (function () {
	var _type = Core._("Helpers.Type");
	var _send_action, _success_action, _error_action;

	var ClientController = /** @lends ClientController.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends Controller
		 * @constructs
		 */
		oninit: function () {
			this.register ("_send", _send_action);
			this.register ("_success", _success_action);
			this.register ("_error", _error_action);
		},

		//---------------------------------------------------------------------
		onstartup: function () {
			this.immediateMode (true);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf ClientController.prototype
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} message Description
	 * @param {Function} handler Description
	 */
	_send_action = function (event, message, handler) {
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
	 * @memberOf ClientController.prototype
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} response Description
	 * @param {Function} handler Description
	 */
	_success_action = function (event, response) {
		if (_type.isFunction (this.onresponse))
			this.onresponse (response, true);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf ClientController.prototype
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} response Description
	 * @param {Function} handler Description
	 */
	_error_action = function (event, response) {
		if (_type.isFunction (this.onresponse))
			this.onresponse (response, false);
	};

	return ClientController;
}) ());



