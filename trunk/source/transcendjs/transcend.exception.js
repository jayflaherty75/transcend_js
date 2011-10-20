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
Core.extend ("ExceptionBranch", "CoreBranch", (function () {
	var ExceptionBranch = /** @lends ExceptionBranch.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Extends CoreBranch to create a storage hierarchy for exceptions.
		 * <br/><br/>
		 * @extends CoreBranch
		 * @constructs
		 */
		oninit: function () {
			var _getValue = this.getValue;

			/**
			 * Returns exception instance of the requested name or undefined 
			 * if it does not exist.  This is the default function, accessible 
			 * by calling <i>_()</i>.
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
	};

	return ExceptionBranch;
}) ());

//-----------------------------------------------------------------------------
Core.singleton ("Exceptions", Core._("ExceptionBranch"));

//-----------------------------------------------------------------------------
Core._("Exceptions").register ("Assert", (function () {
	var _type = Core._("Helpers.Type");
	var AssertException;

	/**
	 * @class Exception thrown when an assert has been triggered..
	 * @constructs
	 * @param {string} msg Detailed description of error
	 */
	AssertException = function (msg) {
		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name AssertException#name
		 * @type String
		 */
		this.name = "AssertException";

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name AssertException#message
		 * @type String
		 */
		this.message = msg;

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name AssertException#toString
		 * @function
		 * @return Description
		 * @type String
		 */
		this.toString = function () {
			return this.name + ": " + this.message;
		};
	};

	return AssertException;
}) ());

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

