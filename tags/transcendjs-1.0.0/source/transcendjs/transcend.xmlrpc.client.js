//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcClient", "ClientController", /** @lends XmlRpcClient */ (function () {
	var _type = Core._("Helpers.Type");
	var _convert_msg = Core._("Helpers.XmlRpc").convertMessage;
	var oninit, _default, onbatchstart, onbatchend;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @extends ClientController
	 * @constructs
	 */
	oninit = function () {
		/**
		 * Private. Description
		 * @name XmlRpcClient#_batch_mode
		 * @type Property
		 */
		this._batch = false;

		this.register ("_default", _default);
	};

	//-------------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name XmlRpcClient#$_default
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

	//-------------------------------------------------------------------------
	onbatchstart = function () {
		this._batch = new Array ();
	};

	//-------------------------------------------------------------------------
	onbatchend = function () {
		this.action ("_send", this._batch);
		this._batch = false;
	};

	return {
		oninit: oninit,
		onbatchstart: onbatchstart,
		onbatchend: onbatchend
	};
}) ());

