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
Core._("Helpers").register ("Type", (function () {
	var _type = Core._("Helpers.Type");
	var _toString = Object.prototype.toString;
	var TypeHelpers;

	/**
	 * @namespace Description
	 */
	TypeHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Types returned are all capitalized.  Value's classRef() Property, 
		 * model's className(), Number, String, Boolean, Object, Undefined, 
		 * String, Array, Element or NUll.
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} value Description
		 * @return Description
		 * @type boolean
		 */
		getType: function (value) {
			if (typeof (value.model) == "undefined") {
				var type = typeof (value);

				if (type == "object") {
					if (this.isString (value)) return "String";
					if (this.isArray (value)) return "Array";
					if (this.isElement (value)) return "Element";
					if (this.isNull (value)) return "Null";
				}

				return Core._("Helpers.String").capitalize (type);
			}
			else if (typeof (value.classRef) == "function") {
				return value.classRef().className();
			}
			else {
				return value.model.className();
			}
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isObject: function (object) {
			return _toString.call(object) == "[object Object]";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isElement: function (object) {
			return !!(object && object.nodeType == 1);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isArray: function (object) {
			return _toString.call(object) == "[object Array]";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isFunction: function (object) {
			return typeof object == "function";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isString: function (object) {
			return _toString.call(object) == "[object String]";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isNumber: function (object) {
			return _toString.call(object) == "[object Number]";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isBoolean: function (object) {
			return typeof object == "boolean";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isNull: function (object) {
			return object == null;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isUndefined: function (object) {
			return typeof object == "undefined";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		isDefined: function (object) {
			return typeof object != "undefined";
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {String} type Description
		 * @param {mixed} object Description
		 * @return Description
		 * @type boolean
		 */
		is: function (type, object) {
			return this.getType (object) == type;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type Array
		 */
		toArray: function (object) {
			if (!object) return [];
			if ('toArray' in Object(object)) return object.toArray();
			var length = object.length || 0, results = new Array(length);
			while (length--) results[length] = object[length];
			return results;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf TypeHelpers
		 * @function
		 * @param {mixed} object Description
		 * @return Description
		 * @type String
		 */
		toString: function (object) {
			if (this.isString (object)) return object;
			if (!this.isUndefined (object.toString)) return object.toString ();
			return String (object);
		}
	};

	TypeHelpers._ = TypeHelpers.getType;

	return TypeHelpers;
}) ());

