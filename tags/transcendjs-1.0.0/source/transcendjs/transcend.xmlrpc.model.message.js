//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcMessageModel", "ModelAbstract", /** @lends XmlRpcMessageModel */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, oncreate;
	var _convert_message = Core._("Helpers.XmlRpc").convertMessage;

	//-------------------------------------------------------------------------
	/**
	 * @class Simple model for dynamically building XML-RPC messages
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit = function () {
		this.className ("XmlRpcMessage");
	};

	//-------------------------------------------------------------------------
	oncreate = function (method, parameters) {
		return _convert_message (method, parameters);
	};

	return {
		oninit: oninit,
		oncreate: oncreate
	};
}) ());

