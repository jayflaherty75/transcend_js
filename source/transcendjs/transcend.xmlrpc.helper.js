//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("XmlRpc", (function () {
	var _type = Core._("Helpers.Type");
	//var convert_xmlrpc, convert_json, convert_message;
	var XmlRpcHelpers;

	/**
	 * @namespace Generic iterator for operating on XML-RPC values, including
	 * scalars, structs and arrays.
	 */
	XmlRpcHelpers = {
		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf XmlRpcHelpers
		 * @function
		 * @param {mixed} value Description
		 * @return Description
		 * @type xmlrpcval
		 */
		convertXmlRpc: function (value) {
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
					value[key] = XmlRpcHelpers.convertXmlRpc (value[key]);
				}

				value = new xmlrpcval (value, "struct");
				break;
			case "Array":
				for (var i = 0; i < value.length; i++) {
					value[i] = XmlRpcHelpers.convertXmlRpc (value[i]);
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
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf XmlRpcHelpers
		 * @function
		 * @param {xmlrpcval} value Description
		 * @return Description
		 * @type mixed
		 */
		convertJson: function (value) {
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
						temp[i] = XmlRpcHelpers.convertJson (value.arrayMem (i));
					}
					value = temp;
					break;
				case "struct":
					var temp = {}, pair;
					value.structReset ();
					for (var i = 0; i < value.structSize (); i++) {
						pair = value.structEach ();
						temp[pair.key] = XmlRpcHelpers.convertJson (pair.value);
					}
					value = temp;
				}

				return value;
			}
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf XmlRpcHelpers
		 * @function
		 * @param {String} method Description
		 * @param {Array} parameters Description
		 * @return Description
		 * @type xmlrpcmsg
		 */
		convertMessage: function (method, parameters) {
			var msg, prm = new Array (), index;

			if (_type.isArray (parameters)) {
				for (index = 0; index < parameters.length; index++) {
					prm.push (XmlRpcHelpers.convertXmlRpc (parameters[index]));
				}
			}
			else {
				for (index in parameters) {
					if (!_type.isFunction (parameters[index]))
						prm.push (XmlRpcHelpers.convertXmlRpc (parameters[index]));
				}
			}

			msg = new xmlrpcmsg (method, prm);

			return msg;
		}
	};

	return XmlRpcHelpers;
}) ());

