//-----------------------------------------------------------------------------
/**
 * @fileoverview Defines a hierarchical ConfigBranch class that is
 * 	instantiated as the Config singleton which takes advantage of the Core's
 * 	existing ability to allow for default functions (_).  (TODO: need more desc)
 * 	Requires Core, Property
 * 	<br /><br />
 * 
 * 	Date		2011-04-19<br />
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 * @version		0.0.22
 */

//-----------------------------------------------------------------------------
Core.extend ("ConfigBranch", "CoreBranch", /** @lends ConfigBranch */ {
	/**
	 * @class Description.<br/><br/>
	 * @constructs
	 */
	oninit: function () {
		var _register = this.register;
		var _getValue = this.getValue;

		//--------------------------------------------------------------------
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

		//--------------------------------------------------------------------
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
});

//-----------------------------------------------------------------------------
Core.singleton ("Config", /** @lends Config */ Core._("ConfigBranch"));




