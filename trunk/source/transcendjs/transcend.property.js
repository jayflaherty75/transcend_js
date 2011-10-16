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
Core.register ("Property", /** @lends Property# */ function () {
	var _value = arguments[0];
	var _memo = arguments[1];

	/**
	 * Function object returned by constructor.  May set and get values.
	 * @name Property#_func
	 * @function
	 * @param {any} value Attempt to set new value
	 * @return New value.
	 * @type any
	 */
	var _func = function (value) {
		if (!Object.isUndefined (value)) {
			if (Object.isFunction (this.onassign))
				value = this.onassign (value, _value, _memo);

			if (value !== _value) {
				if (Object.isFunction (this.onchange)) {
					value = this.onchange (value, _value, _memo);
				}
			}

			_value = value;
		}

		return _value;
	};

	/**
	 * @class Acts as constructor, instance and getter/setter method 
	 * 	all-in-one.  Creates a function object that stores a value as a 
	 * 	property and returns it's value. This allows the value to be set and 
	 * 	read but also calls <b>onassign</b> and <b>onchange</b> handlers to 
	 * 	allow for control of the property or to allow code to listen for 
	 * 	access to the property.  These events may be listened to by event 
	 * 	<i>Eventcast</i> objects.
	 * @constructs
	 * @param {Any} Initial value
	 * @param {any} Memo passed to handler functions
	 * @return Returns the Property function
	 * @type function
	 */
	var func = function () {
		return _func.apply (func, arguments);
	};

	/**
	 * Check if value of Property has been set.  If initial value was passed,
	 * this function will always return <i>true</i>.
	 * @name Property#isSet
	 * @function
	 * @return True if value has been set (is not undefined)
	 * @type boolean
	 */
	func.isSet = function () {
		return !Object.isUndefined (_value);
	};

	return func;
});

