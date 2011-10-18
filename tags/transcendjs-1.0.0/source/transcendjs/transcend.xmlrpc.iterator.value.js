//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcValueIterator", "XmlRpcIterator", /** @lends XmlRpcValueIterator */ (function () {
	var _convert_native = Core._("Helpers.XmlRpc").convertJson;

	var oninit = function () {
		var _onfirst = this.onfirst.bind (this);
		var _onnext = this.onnext.bind (this);
		var _onindex = this.onindex.bind (this);

		this.onfirst = function () {
			return _convert_native (_onfirst ());
		};

		this.onnext = function () {
			return _convert_native (_onnext ());
		};

		this.onindex = function (index) {
			return _onindex (index);
		};
	};

	var onend = function () {
		if (this.cursor () < this.length ()) {
			return false;
		}

		return true;
	};

	return { oninit: oninit, onend: onend };
}) ());

