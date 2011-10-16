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
	 */
	oninit = function () {
		this.timeout = Core._("Property", 30);
		this.debug = Core._("Property");

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
		if (_type.isFunction (this.onsend)) {
			this.onsend (message, handler);
		}
	};

	return {
		oninit: oninit
	};
}) ());

