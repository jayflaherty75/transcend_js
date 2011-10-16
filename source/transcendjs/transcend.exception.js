//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("ExceptionBranch", "CoreBranch", /** @lends ExceptionBranch */ {
	/**
	 * @class Extends CoreBranch to create a storage hierarchy for exceptions.
	 * <br/><br/>
	 * @extends CoreBranch
	 * @constructs
	 */
	oninit: function () {
		var _getValue = this.getValue;

		/**
		 * Returns exception instance of the requested name or undefined if it
		 * does not exist.  This is the default function, accessible by calling
		 * <i>_()</i>.
		 * @name ExceptionBranch#getValue
		 * @function
		 * @param {string} exception_name
		 * @param {string} message
		 * @param {string} extra
		 * @return New exception instance
		 * @type object
		 */
		this.getValue = function (name) {
			var args = $A(arguments);
			var exception_name = args.shift ();
			var constructor = _getValue (exception_name);

			if (typeof (constructor) == "function")
				return new constructor (args[0], args[1], args[2]);
			else
				return null;	//TODO: return a default UnknownException
		};

		this._ = this.getValue;
	}
});

//-----------------------------------------------------------------------------
Core.singleton ("Exceptions", /** @lends Exceptions */ Core._("ExceptionBranch"));

//-----------------------------------------------------------------------------
Core._("Exceptions").register ("Assert", 
	/**
	 * @lends AssertException
	 * @class Exception thrown when an assert has been triggered..
	 * @extends Exception
	 * @constructs
	 * @param {string} msg Detailed description of error
	 */
	function (msg) {
		this.name = "AssertException";
		this.message = msg;
		this.toString = function () {
			return this.name + ": " + this.message;
		};
	}
);

//-----------------------------------------------------------------------------
/**
 * Throws an AssertException with the given message if test evaluates to true.
 * @function
 * @throws AssertException
 */
var assert = function (test, message) {
	if (!test) {
		throw (Core._("Exceptions.Assert", message));
	}
};

