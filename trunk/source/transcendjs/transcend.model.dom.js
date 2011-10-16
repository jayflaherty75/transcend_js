//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("DomModel", "ModelAbstract", /** @lends DomModel */ {
	/**
	 * @class Simple model for handling basic DOM Elements
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Element");
		this.defaultIterator (Core.getClass ("DomIterator"));
	},

	oncreate: function () {
		var _type = Core._("Helpers.Type");
		var args = $A(arguments);
		var object;

		switch (_type.getType (args[0])) {
		case "Element":
			object = args[0];
			break;
		case "String":
			if (args[0] != "text") {
				object = document.createElement (args[0]);
			}
			else {
				object = document.createTextNode (args[1]);
			}
			break;
		default:
			object = document.createElement ("div");
		}

		return $(object);
	},

	/*filterReference: function (ref) {
		if (typeof (ref) != "number")
			ref = 0;

		return ref;
	},*/

	getFirstRef: function () {
		return 0;
	},

	getLastRef: function () {
		return this.childNodes.length - 1;
	},

	onset: function (ref, value) {
		//this.replaceChild (value, this.childNodes[ref]);
		$(this).writeAttribute (ref, value);
	},

	onget: function (ref) {
		//return this.childNodes[ref];
		return (this)[ref];
	},

	onunset: function (ref) {
		var value = this.childNodes[ref];
		if (typeof (value) != "undefined") this.childNodes.splice (ref, 1);
		return value;
	},

	oninsert: function (ref, value) {
		var nodes = this.childNodes;

		if (ref < 0) ref = 0;

		if (ref >= nodes.length) {
			this.appendChild (value);
		}
		else {
			if (nodes[ref + 1]) {
				this.insertBefore (value, nodes[ref + 1]);
			}
			else {
				this.appendChild (value);
			}
		}
	},

	oncompare: function (ref, value) {
		var element = this.get (ref);

		if (element == value) 
			return 0;
		else
			return -1;
	}
});

