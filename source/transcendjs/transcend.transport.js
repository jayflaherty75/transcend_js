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
Core.extend ("TransportController", "Controller", (function () {
	var _type = Core._("Helpers.Type");
	var _send_action;

	var TransportController = /** @lends TransportController.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link ClientController}.
		 * @extends Controller
		 * @constructs
		 */
		oninit: function () {
			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name TransportController#timeout
			 * @type Property
			 */
			this.timeout = Core._("Property", 30);

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name TransportController#debug
			 * @type Property
			 */
			this.debug = Core._("Property");

			this.register ("send", _send_action);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf TransportController.prototype
	 * @function
	 * @private
	 * @param {Event} event Description
	 * @param {mixed} message Description
	 * @param {Function} handler Description
	 */
	_send_action = function (event, message, handler) {
		if (_type.isFunction (this.onsend)) {
			this.onsend (message, handler);
		}
	};

	return TransportController;
}) ());

