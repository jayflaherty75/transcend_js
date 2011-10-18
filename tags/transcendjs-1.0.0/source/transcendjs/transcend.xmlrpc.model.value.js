//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcValueModel", "ModelAbstract", /** @lends XmlRpcValueModel */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, oncreate, get_first_ref, get_last_ref;
	var onset, onget, onunset, oninsert, oncompare;
	var _convert_xmlrpc = Core._("Helpers.XmlRpc").convertXmlRpc;
	var _convert_native = Core._("Helpers.XmlRpc").convertJson;
	var _get_value;

	//-------------------------------------------------------------------------
	/**
	 * @class Simple model for handling basic Arrays
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit = function () {
		this.className ("XmlRpcValue");
		//this.defaultIterator (Core.getClass ("XmlRpcValueIterator"));
		this.defaultIterator (Core.getClass ("XmlRpcIterator"));
	};

	//-------------------------------------------------------------------------
	oncreate = function () {
		return _convert_xmlrpc (arguments[0]);
	};

	//-------------------------------------------------------------------------
	get_first_ref = function () {
		return 0;
	};

	//-------------------------------------------------------------------------
	get_last_ref = function () {
		return 0; //this.length - 1;
	};

	//-------------------------------------------------------------------------
	onset = function (ref, value) {
		var check = _get_value (obj, ref);

		if (_type.isUndefined (check)) 
			this.insert (ref, _convert_xmlrpc (value));
	};

	//-------------------------------------------------------------------------
	onget = function (ref) {
		var obj = _get_value (this, ref);

		if (_type.isDefined (obj))
			return _convert_native (obj);
	};

	//-------------------------------------------------------------------------
	//onunset = function (ref) {	//Not supported in JS XML-RPC
	//};

	//-------------------------------------------------------------------------
	oninsert = function (ref, value) {
		/*
		var obj = this.value ();

		value = value.value ();

		switch (obj.kindOf ()) {
		case "array":
			this.addArray ();
			break;
		case "struct":
		}
		*/
	};

	//-------------------------------------------------------------------------
	oncompare = function (ref, value) {
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
	};

	//-------------------------------------------------------------------------
	_get_value = function (obj, ref) {

		switch (obj.kindOf ()) {
			case "scalar":
				return obj;
				break;
			case "array":
				return obj.arrayMem (ref);
				break;
			case "struct":
				return obj.structMem (ref);
		}
	};

	return {
		oninit: oninit,
		oncreate: oncreate,
		getFirstRef: get_first_ref,
		getLastRef: get_last_ref,
		onset: onset,
		onget: onget,
		onunset: onunset,
		oninsert: oninsert,
		oncompare: oncompare
	};
}) ());

