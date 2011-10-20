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
Core.extend ("XmlRpcSource", "SourceController", (function () {
	var _type = Core._("Helpers.Type");

	var XmlRpcSource = /** @lends XmlRpcSource.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends SourceController
		 * @constructs
		 */
		oninit: function () {
			this.assign ("model_key", false);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name XmlRpcSource#onload
		 * @function
		 * @param {Object} object Description
		 * @param {Function} handler Description
		 */
		onload: function (object, handler) {
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
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name XmlRpcSource#onsave
		 * @function
		 * @param {Object} object Description
		 * @param {Function} handler Description
		 */
		onsave: function (object, handler) {
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
		}
	};

	return XmlRpcSource;
}) ());


