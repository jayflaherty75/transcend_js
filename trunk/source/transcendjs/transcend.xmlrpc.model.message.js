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
Core.extend ("XmlRpcMessageModel", "ModelAbstract", (function () {
	var _type = Core._("Helpers.Type");
	var _convert_message = Core._("Helpers.XmlRpc").convertMessage;

	var XmlRpcMessageModel = /** @lends XmlRpcMessageModel.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Simple model for dynamically building XML-RPC messages
		 * @extends ModelAbstract
		 * @constructs
		 */
		oninit: function () {
			this.className ("XmlRpcMessage");
		},

		//---------------------------------------------------------------------
		oncreate: function (method, parameters) {
			return _convert_message (method, parameters);
		}
	};

	return XmlRpcMessageModel;
}) ());

