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
Core.register ("Property", (function () {
	var wrapper = function () {
		var Property, isSet, _func;

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name Property#_value
		 * @private
		 * @type mixed
		 */
		var _value = arguments[0];

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @name Property#_memo
		 * @private
		 * @type mixed
		 */
		var _memo = arguments[1];

		//---------------------------------------------------------------------
		/**
		 * @class Acts as constructor, instance and getter/setter method 
		 * 	all-in-one.  Creates a function object that stores a value as a 
		 * 	property and returns it's value. This allows the value to be set and 
		 * 	read but also calls <b>onassign</b> and <b>onchange</b> handlers to 
		 * 	allow for control of the property or to allow code to listen for 
		 * 	access to the property.  These events may be listened to by event 
		 * 	<i>Eventcast</i> objects.
		 * @param {Any} initial value
		 * @param {any} memo passed to handler functions
		 * @return Returns the Property function
		 * @type function
		 */
		Property = function () {
			return _func.apply (Property, arguments);
		};

		//---------------------------------------------------------------------
		/**
		 * Check if value of Property has been set.  If initial value was passed,
		 * this function will always return <i>true</i>.
		 * @memberOf Property.prototype
		 * @public
		 * @function
		 * @return True if value has been set (is not undefined)
		 * @type boolean
		 */
		isSet = function () {
			return !Object.isUndefined (_value);
		};

		//---------------------------------------------------------------------
		/**
		 * Function object returned by constructor.  May set and get values.
		 * @memberOf Property.prototype
		 * @private
		 * @function
		 * @param {any} value Attempt to set new value
		 * @return New value.
		 * @type any
		 */
		_func = function (value) {
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

		Property.isSet = isSet;

		return Property;
	};

	return wrapper;
}) ());

