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
Core.extend ("XmlRpcIterator", "IteratorAbstract", (function () {
	var _type = Core._("Helpers.Type");
	var _getvalue, _increment, _nochange;
	var _class_name = "XmlRpcValue", _class;

	var XmlRpcIterator = /** @lends XmlRpcIterator.prototype */ {
		//-------------------------------------------------------------------------
		/**
		 * @class Generic iterator for operating on XML-RPC values, including
		 * scalars, structs and arrays.
		 * @extends IteratorAbstract
		 * @constructs
		 */
		oninit: function () {
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
		},

		//-------------------------------------------------------------------------
		onfirst: function () {
			this.cursor (0);
			return _getvalue (this);
		},

		//-------------------------------------------------------------------------
		onnext: function () {
			_increment (this);
			return _getvalue (this);
		},

		//-------------------------------------------------------------------------
		onref: function () {
			return this.keys[this.cursor()];
		},

		//-------------------------------------------------------------------------
		onindex: function (index) {
			this.cursor (index);
			return _getvalue (this);
		},

		//-------------------------------------------------------------------------
		onend: function () {
			if (this.cursor () < this.length ()) {
				return false;
			}
	
			return true;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf XmlRpcIterator.prototype
	 * @function
	 * @private
	 * @param {Iterator} iterator Description
	 * @return Description
	 * @type xmlrpcval
	 */
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
	/**
	 * Description, events, exceptions, example
	 * @memberOf XmlRpcIterator.prototype
	 * @function
	 * @private
	 * @param {Iterator} iterator Description
	 */
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
	/**
	 * Description, events, exceptions, example
	 * @memberOf XmlRpcIterator.prototype
	 * @function
	 * @private
	 * @param {mixed} newval Description
	 * @param {mixed} oldval Description
	 * @return Description
	 * @type mixed
	 */
	_nochange = function (newval, oldval) { return oldval; };

	return XmlRpcIterator;
}) (), /** @lends XmlRpcIterator */ {
	TYPE_INVALID: 0,
	TYPE_SCALAR: 1,
	TYPE_ARRAY: 2,
	TYPE_STRUCT: 3
});

