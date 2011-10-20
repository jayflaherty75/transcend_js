//-----------------------------------------------------------------------------
/**
 * @fileoverview Defines a hierarchical ConfigBranch class that is
 * 	instantiated as the Config singleton which takes advantage of the Core's
 * 	existing ability to allow for default functions (_).  (TODO: need more desc)
 * 	Requires Core, Property<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.extend ("ConfigBranch", "CoreBranch", (function () {
	var ConfigBranch = /** @lends ConfigBranch.prototype */ {
		/**
		 * @class Description.<br/><br/>
		 * @constructs
		 */
		oninit: function () {
			var _register = this.register;
			var _getValue = this.getValue;

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name ConfigBranch#register
			 * @function
			 * @param {String} name Description
			 * @param {Any} value Description
			 */
			this.register = function (name, value) {
				if (typeof (value) == "undefined") {
					_register (name, Core._("ConfigBranch"));
				}
				else {
					return _register (name, Core._("Property", value));
				}
			};

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name ConfigBranch#getValue
			 * @function
			 * @param {String} name Description
			 * @param {Any} value Description
			 */
			this.getValue = function (name, value) {
				if (typeof (value) == "undefined") {
					return _getValue (name);
				}
				else {
					return _getValue (name) (value);
				}
			};

			this._ = this.getValue;
		}
	};

	return ConfigBranch;
}) ());

//-----------------------------------------------------------------------------
Core.singleton ("Config", Core._("ConfigBranch"));




