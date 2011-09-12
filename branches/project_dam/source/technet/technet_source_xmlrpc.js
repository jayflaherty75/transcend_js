//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcContext", "Context2", /** @lends XmlRpcContext */ (function () {
	var _type = Core._("Helpers.Type");
	var onstart;

	/**
	 * @class Description
	 * @constructs
	 */
	oninit = function () {
	};

	//--------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#onstart
	 * @function
	 * @param {type} code Description
	 * @return Description
	 * @type Boolean
	 */
	onstart = function (code) {
		var state = this.get ("_state");

		if (_type.isDefined (state)) {
			state["x"] = {};
			return true;
		}

		return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#oncomplete
	 * @function
	 * @param {Boolean} result Description
	 * @return Description
	 * @type Object|false
	 */
	var oncomplete = function (result) {
		var state = this.get ("_state");

		if (_type.isDefined (state)) return state.x;

		return false;
	};

	return {
		oninit: oninit,
		onstart: onstart
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcController", "SourceController", /** @lends XmlRpcController */ (function () {
	var _type = Core._("Helpers.Type");
	var _default;

	/**
	 * @class Description
	 * @constructs
	 */
	oninit = function () {
		this.assign ("model_key", false);
		this.registerSimple ("_default", _default);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#onstartup
	 * @function
	 */
	onstartup = function () {
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#$_default
	 * @function
	 */
	_default = function () {
	};

	return {
		oninit: oninit,
		onstartup: onstartup
	};
}) ());

