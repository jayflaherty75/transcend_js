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
Core.extend ("ArrayModel", "ModelAbstract", /** @lends ArrayModel */ {
	/**
	 * @class Simple model for handling basic Arrays
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Array");
		this.defaultIterator (Core.getClass ("ArrayIterator"));
	},

	oncreate: function () {
		var _type = Core._("Helpers.Type");
		var args = $A(arguments);
		//var arr = new Array ();
		var arr = _type.isArray (args[0]) ? args.shift() : new Array ();

		args.each (function (value) {
			if (_type.isDefined (value))
				arr.push (value);
		});

		return arr;
	},

	filterReference: function (ref) {
		if (typeof (ref) != "number") {
			ref = this.length; //typeof (this.length) != "undefined" ? this.length : 0;
		}

		if (ref < 0) ref += this.length;

		return ref;
	},

	getFirstRef: function () {
		return 0;
	},

	getLastRef: function () {
		return this.length - 1;
	},

	onset: function (ref, value) {
		(this)[ref] = value;
	},

	onget: function (ref) {
		return (this)[ref];
	},

	onunset: function (ref) {
		var value = (this)[ref];
		if (typeof (value) != "undefined") this.splice (ref, 1);
		return value;
	},

	oninsert: function (ref, value) {
		if (ref < 0)
			ref = 0;
		else if (ref >= this.length)
			ref = this.length;

		this.splice (ref, 0, value);
	},

	oncompare: function (ref, value) {
		var element = this.get (ref);

		switch (typeof (value)) {
		case "string":
			value = parseInt (value);
			break;
		case "boolean":
			value = value ? 1 : 0;
			break;
		case "function":
			value = value ();
			break;
		default:
			value = 0;
		}

		if (value > element) return 1;
		if (value < element) return -1;

		return 0;
	}
});

