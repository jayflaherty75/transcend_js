//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("XmlRpc", /** @lends Helpers.XmlRpc */ (function () {
	/**
	 * @class Generic iterator for operating on XML-RPC values, including
	 * scalars, structs and arrays.
	 */
	var _type = Core._("Helpers.Type");
	var convert_xmlrpc, convert_json, convert_message;

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Helpers.XmlRpc#convertXmlRpc
	 * @function
	 * @param {mixed} value Description
	 * @return Description
	 * @type xmlrpcval
	 */
	convert_xmlrpc = function (value) {
		switch (_type._ (value)) {
		case "Number":
			var type = false;

			if (value instanceof Number) {
				if (_type.isDefined (value.xmlrpctype))
					type = value.xmlrpctype;
				value = value.valueOf ();
			}

			if (!type) {
				if (value == Math.floor (value))
					type = "int";
				else
					type = "double";
			}

			value = new xmlrpcval (value, type);

			break;
		case "String":
			value = new xmlrpcval (value, "string");
			break;
		case "Boolean":
			value = new xmlrpcval (value, "boolean");
			break;
		case "Object":
			if (value instanceof xmlrpcval) return;	//return undefined
			for (key in value) {
				value[key] = convert_xmlrpc (value[key]);
			}

			value = new xmlrpcval (value, "struct");
			break;
		case "Array":
			for (var i = 0; i < value.length; i++) {
				value[i] = convert_xmlrpc (value[i]);
			}

			value = new xmlrpcval (value, "array");
			break;
		case "Date":
			value = new xmlrpcval (value, "date");
			break;
		default:
			value = new xmlrpcval ();
		}

		return value;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Helpers.XmlRpc#convertJson
	 * @function
	 * @param {xmlrpcval} value Description
	 * @return Description
	 * @type mixed
	 */
	convert_json = function (value) {
		if (_type.isDefined (value)) {
			switch (value.kindOf ()) {
			case "scalar":
				switch (value.scalarTyp ()) {
				case "i4":
					value = value.scalarVal ();
					break;
				case "int":
					value = value.scalarVal ();
					break;
				case "base64":
					value = value.scalarVal ();
					break;
				case "double":
					value = value.scalarVal ();
					break;
				case "string":
					value = value.scalarVal ();
					break;
				case "null":
					value = null;
					break;
				case "date":
					//TODO: Handler dates in conversion to native data
					break;
				case "dateTime.iso8601":
					break;
				case "boolean":
					value = !!value.scalarVal ();
					break;
				default:
					value = "BAD VALUE!";
				}
				break;
			case "array":
				var temp = new Array ();
				for (var i = 0; i < value.arraySize (); i++) {
					temp[i] = convert_json (value.arrayMem (i));
				}
				value = temp;
				break;
			case "struct":
				var temp = {}, pair;
				value.structReset ();
				for (var i = 0; i < value.structSize (); i++) {
					pair = value.structEach ();
					temp[pair.key] = convert_json (pair.value);
				}
				value = temp;
			}

			return value;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Helpers.XmlRpc#convertMessage
	 * @function
	 * @param {String} method Description
	 * @param {Array} parameters Description
	 * @return Description
	 * @type xmlrpcmsg
	 */
	convert_message = function (method, parameters) {
		var msg, prm = new Array (), index;

		if (_type.isArray (parameters)) {
			for (index = 0; index < parameters.length; index++) {
				prm.push (convert_xmlrpc (parameters[index]));
			}
		}
		else {
			for (index in parameters) {
				if (!_type.isFunction (parameters[index]))
					prm.push (convert_xmlrpc (parameters[index]));
			}
		}

		msg = new xmlrpcmsg (method, prm);

		return msg;
	};

	return {
		convertXmlRpc: convert_xmlrpc,
		convertJson: convert_json,
		convertMessage: convert_message
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcIterator", "IteratorAbstract", /** @lends XmlRpcIterator */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, onfirst, onnext, onref, onindex, onend;
	var _getvalue, _increment, _nochange;
	var _class_name = "XmlRpcValue", _class;

	//-------------------------------------------------------------------------
	/**
	 * @class Generic iterator for operating on XML-RPC values, including
	 * scalars, structs and arrays.
	 * @extends IteratorAbstract
	 * @constructs
	 */
	oninit = function () {
		var data;	//is data already being passed as an argument?

		this.className (_class_name);
		this.cursor (0);

		this.xmlrpc_type = Core._("Property");
		this.length = Core._("Property");

		if (_type.isUndefined (_class))
			_class = Core.getClass ("XmlRpcIterator");

		if (this.data.isSet ()) {
			data = this.data();

			switch (data.kindOf ()) {
				case "scalar":
					this.xmlrpc_type (_class.TYPE_SCALAR);
					this.length (1);
					break;
				case "array":
					this.xmlrpc_type (_class.TYPE_ARRAY);
					this.length (data.arraySize ());
					break;
				case "struct":
					var record, length;

					this.keys = new Array ();
					data.structReset ();
					length = data.structSize ();
					for (var i = 0; i < length; i++) {
						record = data.structEach ();
						this.keys[i] = record.key;
					}

					this.xmlrpc_type (_class.TYPE_STRUCT);
					this.length (length);
			}
		}
		else {
			this.xmlrpc_type (_class.TYPE_INVALID);
			this.length (0);
		}

		this.xmlrpc_type.onchange = _nochange;
	};

	//-------------------------------------------------------------------------
	onfirst = function () {
		this.cursor (0);
		return _getvalue (this);
	};

	//-------------------------------------------------------------------------
	onnext = function () {
		_increment (this);
		return _getvalue (this);
	};

	//-------------------------------------------------------------------------
	onref = function () {
		return this.keys[this.cursor()];
	};

	//-------------------------------------------------------------------------
	onindex = function (index) {
		this.cursor (index);
		return _getvalue (this);
	};

	//-------------------------------------------------------------------------
	onend = function () {
		if (this.cursor () < this.length ()) {
			return false;
		}

		return true;
	};

	//-------------------------------------------------------------------------
	_getvalue = function (iterator) {
		var data = iterator.data.isSet () ? iterator.data() : null;
		var cursor = iterator.cursor ();
		var result;

		switch (iterator.xmlrpc_type ()) {
			case _class.TYPE_INVALID:
				result = false;
				break;
			case _class.TYPE_SCALAR:
				if (cursor == 0) {
					result = data.scalarVal();
				}
				break;
			case _class.TYPE_ARRAY:
				if (cursor < iterator.length ()) {
					result = data.arrayMem (cursor);
				}
				break;
			case _class.TYPE_STRUCT:
				if (cursor < iterator.length ()) {
					result = data.structMem (iterator.keys[cursor]);
				}
		}

		return result;
	};

	//-------------------------------------------------------------------------
	_increment = function (iterator) {
		var cursor = iterator.cursor ();

		switch (iterator.xmlrpc_type ()) {
			case _class.TYPE_SCALAR:
				if (cursor == 0) {
					iterator.cursor (cursor + 1);
				}
				break;
			case _class.TYPE_ARRAY:
				if (cursor < iterator.length ()) {
					iterator.cursor (cursor + 1);
				}
				break;
			case _class.TYPE_STRUCT:
				if (cursor < iterator.length ()) {
					iterator.cursor (cursor + 1);
				}
		}
	};

	//-------------------------------------------------------------------------
	_nochange = function (newval, oldval) { return oldval; };

	return {
		oninit: oninit,
		onfirst: onfirst,
		onnext: onnext,
		onref: onref,
		onindex: onindex,
		onend: onend
	};
}) (), {
	TYPE_INVALID: 0,
	TYPE_SCALAR: 1,
	TYPE_ARRAY: 2,
	TYPE_STRUCT: 3
});

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcValueIterator", "XmlRpcIterator", /** @lends XmlRpcValueIterator */ (function () {
	var _convert_native = Core._("Helpers.XmlRpc").convertJson;

	var oninit = function () {
		var _onfirst = this.onfirst.bind (this);
		var _onnext = this.onnext.bind (this);
		var _onindex = this.onindex.bind (this);

		this.onfirst = function () {
			return _convert_native (_onfirst ());
		};

		this.onnext = function () {
			return _convert_native (_onnext ());
		};

		this.onindex = function (index) {
			return _onindex (index);
		};
	};

	var onend = function () {
		if (this.cursor () < this.length ()) {
			return false;
		}

		return true;
	};

	return { oninit: oninit, onend: onend };
}) ());

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

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcMessageModel", "ModelAbstract", /** @lends XmlRpcMessageModel */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, oncreate;
	var _convert_message = Core._("Helpers.XmlRpc").convertMessage;

	//-------------------------------------------------------------------------
	/**
	 * @class Simple model for dynamically building XML-RPC messages
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit = function () {
		this.className ("XmlRpcMessage");
	};

	//-------------------------------------------------------------------------
	oncreate = function (method, parameters) {
		return _convert_message (method, parameters);
	};

	return {
		oninit: oninit,
		oncreate: oncreate
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcController", "TransportController", /** @lends XmlRpcController */ (function () {
	var _type = Core._("Helpers.Type");
	var _convert_json = Core._("Helpers.XmlRpc").convertJson;
	var oninit, onstartup, onsend, _debug_onchange;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @extends TransportController
	 * @constructs
	 */
	oninit = function () {
		this.client = Core._("Property");

		this.debug.onchange = _debug_onchange.bind (this);
	};

	//-------------------------------------------------------------------------
	onstartup = function () {
		var client = new xmlrpc_client (this.get ("server"));

		client.no_multicall = false;

		this.client (client);
		this.debug (this.get ("debug"));
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcController#onsend
	 * @function
	 * @param {xmlrpcmsg} message Description
	 * @param {Function} handler Description
	 */
	onsend = function (message, handler) {
		var client = this.client();
		var response_handler = function (response) {
			if (response.faultCode ()) {
				handler (response.faultString (), false);
			}
			else {
				handler (_convert_json (response.value ()), true);
			}
		};

		if (_type.isArray (message)) {
			client.multicall (message, this.timeout (), response_handler, false);
			//response_handler (client.multicall (message, this.timeout (), null, false));
		}
		else {
			client.send (message, this.timeout (), response_handler);
		}
	};

	//-------------------------------------------------------------------------
	_debug_onchange = function (newval, oldval) {
		var value = _type.isBoolean (newval) ? newval : oldval;

		this.client ().setDebug (value ? 2 : 0);

		return value;
	};

	return {
		oninit: oninit,
		onstartup: onstartup,
		onsend: onsend
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcClient", "ClientController", /** @lends XmlRpcClient */ (function () {
	var _type = Core._("Helpers.Type");
	var _convert_msg = Core._("Helpers.XmlRpc").convertMessage;
	var oninit, _default, onbatchstart, onbatchend;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @extends ClientController
	 * @constructs
	 */
	oninit = function () {
		/**
		 * Private. Description
		 * @name XmlRpcClient#_batch_mode
		 * @type Property
		 */
		this._batch = false;

		this.register ("_default", _default);
	};

	//-------------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name XmlRpcClient#$_default
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @param {Array} nodes Description
	 * @return Description
	 * @type Boolean
	 */
	var _default = function (id, params, nodes) {
		var state = this.get ("_state");
		var handler = params.shift ();
		var message = Core._("Model.XmlRpcMessageModel", null, id, params);
		var batch = this._batch;

		if (batch === false) {
			this.action ("_send", message, handler);
		}
		else {
			this._batch.push (message, handler);
		}
	};

	//-------------------------------------------------------------------------
	onbatchstart = function () {
		this._batch = new Array ();
	};

	//-------------------------------------------------------------------------
	onbatchend = function () {
		this.action ("_send", this._batch);
		this._batch = false;
	};

	return {
		oninit: oninit,
		onbatchstart: onbatchstart,
		onbatchend: onbatchend
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("XmlRpcSource", "SourceController", /** @lends XmlRpcSource */ (function () {
	var _type = Core._("Helpers.Type");
	var oninit, onload, onsave;

	//-------------------------------------------------------------------------
	/**
	 * @class Description
	 * @extends SourceController
	 * @constructs
	 */
	oninit = function () {
		this.assign ("model_key", false);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcSource#onload
	 * @function
	 * @param {Object} object Description
	 * @param {Function} handler Description
	 */
	onload = function (object, handler) {
		var target = this.get ("target");
		var directory = object.src["dir"];
		var filename = object.src["file"];

		target.action ("Action.Execute", 
			[
				function (response, success) {
					handler (response.evalJSON (), success);
				},
				"FileRead", 
				{
					"0": {
						"CurrentDir": directory
					},
					"1": {
						"Filename": filename
					}
				},
				0
			]
		);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name XmlRpcSource#onsave
	 * @function
	 * @param {Object} object Description
	 * @param {Function} handler Description
	 */
	onsave = function (object, handler) {
		var target = this.get ("target");
		var filename = _type.isString (object.dest) ? object.dest : object.dest["file"];

		target.action ("Action.Execute", 
			[
				handler,
				"AnalyticsSave", 
				{
					"0": {
						"Input": Object.toJSON (object)
					},
					"2": {
						"Filename": filename
					}
				},
				0
			]
		);
	};

	return {
		oninit: oninit,
		onload: onload,
		onsave: onsave
	};
}) ());


