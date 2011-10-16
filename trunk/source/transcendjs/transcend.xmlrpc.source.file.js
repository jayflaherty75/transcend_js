//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcSource", "SourceController", /** @lends XmlRpcSource */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, onload, onsave;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @extends SourceController
	 * @constructs
	 */
	oninit = function () {
		this.assign ("model_key", false);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcSource#onload
	 * @function
	 * @param {Object} object Description
	 * @param {Function} handler Description
	 */
	onload = function (object, handler) {
		var target = this.get ("target");
		var directory = object.src["dir"];
		var filename = object.src["file"];

		target.action ("Action.Execute", 
			[
				function (response, success) {
					handler (response.evalJSON (), success);
				},
				"FileRead", 
				{
					"0": {
						"CurrentDir": directory
					},
					"1": {
						"Filename": filename
					}
				},
				0
			]
		);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcSource#onsave
	 * @function
	 * @param {Object} object Description
	 * @param {Function} handler Description
	 */
	onsave = function (object, handler) {
		var target = this.get ("target");
		var filename = _type.isString (object.dest) ? object.dest : object.dest["file"];

		target.action ("Action.Execute", 
			[
				handler,
				"AnalyticsSave", 
				{
					"0": {
						"Input": Object.toJSON (object)
					},
					"2": {
						"Filename": filename
					}
				},
				0
			]
		);
	};

	return {
		oninit: oninit,
		onload: onload,
		onsave: onsave
	};
}) ());


