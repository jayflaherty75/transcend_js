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
Core.extend ("ObjectModel", "ModelAbstract", /** @lends HashModel */ {
	/**
	 * @class Simple model for handling basic associative arrays/objects
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Object");
		this.defaultIterator (Core.getClass ("ObjectIterator"));
	},

	oncreate: function () {
		return typeof (arguments[0]) == "object" ? arguments[0] : {};
	},

	filterReference: function (ref) {
		ref = typeof (ref) == "string" ? ref : ref.toString();

		return ref;
	},

	getFirstRef: function () {
		return $H(this).keys()[0];
	},

	getLastRef: function () {
		var keys = $H(this).keys();
		return keys[keys.length - 1];
	},

	onset: function (ref, value) {
		(this)[ref] = value;
	},

	onget: function (ref) {
		return (this)[ref];
	},

	onunset: function (ref) {
		var value = (this)[ref];
		if (typeof (value) != "undefined") delete (this)[ref];
		return value;
	},

	oninsert: function (ref, value) {
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

