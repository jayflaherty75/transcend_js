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
Core.extend ("XmlRpcClient", "ClientController", (function () {
	var _type = Core._("Helpers.Type");
	var _convert_msg = Core._("Helpers.XmlRpc").convertMessage;
	var _default;

	var XmlRpcClient = /** @lends XmlRpcClient.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends ClientController
		 * @constructs
		 */
		oninit: function () {
			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name XmlRpcClient#_batch_mode
			 * @type Property
			 */
			this._batch = false;

			this.register ("_default", _default);
		},

		//---------------------------------------------------------------------
		onbatchstart: function () {
			this._batch = new Array ();
		},

		//---------------------------------------------------------------------
		onbatchend: function () {
			this.action ("_send", this._batch);
			this._batch = false;
		}
	};

	//---------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcClient#$_default
	 * @private
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @param {Array} nodes Description
	 * @return Description
	 * @type Boolean
	 */
	var _default = function (id, params, nodes) {
		var state = this.get ("_state");
		var handler = params.shift ();
		var message = Core._("Model.XmlRpcMessageModel", null, id, params);
		var batch = this._batch;

		if (batch === false) {
			this.action ("_send", message, handler);
		}
		else {
			this._batch.push (message, handler);
		}
	};

	return XmlRpcClient;
}) ());

