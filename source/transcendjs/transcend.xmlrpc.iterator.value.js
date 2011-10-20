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
Core.extend ("XmlRpcValueIterator", "XmlRpcIterator", (function () {
	var _convert_native = Core._("Helpers.XmlRpc").convertJson;

	var XmlRpcValueIterator = /** @lends XmlRpcValueIterator.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description, events, exceptions, example
		 * @extends XmlRpcIterator
		 * @constructs
		 */
		oninit: function () {
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
		},

		onend: function () {
			if (this.cursor () < this.length ()) {
				return false;
			}

			return true;
		}
	};

	return XmlRpcValueIterator;
}) ());

