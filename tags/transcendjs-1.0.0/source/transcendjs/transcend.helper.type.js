//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Type", new (Class.create ({
	initialize: function () {
		var _toString = Object.prototype.toString;

		//---------------------------------------------------------------------
		//Types returned are all capitalized.  Value's classRef() Property, 
		//model's className(), Number, String, Boolean, Object, Undefined, 
		//String, Array, Element or NUll.
		this.getType = function (value) {
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
		}.bind (this);

		this.isObject = function (object) {
			return _toString.call(object) == "[object Object]";
		};

		this.isElement = function (object) {
			return !!(object && object.nodeType == 1);
		};

		this.isArray = function (object) {
			return _toString.call(object) == "[object Array]";
		};

		this.isFunction = function (object) {
			return typeof object == "function";
		};

		this.isString = function (object) {
			return _toString.call(object) == "[object String]";
		};

		this.isNumber = function (object) {
			return _toString.call(object) == "[object Number]";
		};

		this.isBoolean = function (object) {
			return typeof object == "boolean";
		};

		this.isNull = function (object) {
			return object == null;
		};

		this.isUndefined = function (object) {
			return typeof object == "undefined";
		};

		this.isDefined = function (object) {
			return typeof object != "undefined";
		};

		this.is = function (type, object) {
			return this.getType (object) == type;
		};

		this.toArray = function (object) {
			if (!object) return [];
			if ('toArray' in Object(object)) return object.toArray();
			var length = object.length || 0, results = new Array(length);
			while (length--) results[length] = object[length];
			return results;
		};

		this.toString = function (object) {
			if (this.isString (object)) return object;
			if (!this.isUndefined (object.toString)) return object.toString ();
			return String (object);
		};

		this._ = this.getType;
	}
})) ());

