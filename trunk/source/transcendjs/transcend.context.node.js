//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br/><br/>
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.extend ("NodeContext", "Context", (function () {
	var _type = Core._("Helpers.Type");
	var _process_data, _write_data, _copy_data, _save_node, _default;
	var _apply_attributes, _apply_style, _text;

	var NodeContext = /** @lends NodeContext.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends Context
		 * @constructs
		 * @param {any} data Collection or data structure to be iterated
		 */
		oninit: function () {
			this.register ("_default", _default);
			this.register ("apply-attributes", _apply_attributes);
			this.register ("apply-style", _apply_style);
			this.register ("text", _text);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name NodeContext#onstart
		 * @function
		 * @param {type} code Description
		 * @return Description
		 * @type Boolean
		 */
		onstart: function (code) {
			var state = this.get ("_state");

			if (_type.isDefined (state)) {
				state["x"] = {};
				return true;
			}

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name NodeContext#oncomplete
		 * @function
		 * @param {Boolean} result Description
		 * @return Description
		 * @type Object|false
		 */
		oncomplete: function (result) {
			var state = this.get ("_state");

			if (_type.isDefined (state)) {
				return state.x;
			}

			return false;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {Interpreter} interpreter Description
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type mixed
	 */
	_process_data = function (interpreter, id, params) {
		var data = interpreter.get (id);

		if (_type.isDefined (data)) {
			switch (_type._(data)) {
				case "Array":
					break;
				case "Function":
					data = [data ()];
					break;
				case "Object":
					Object.extend (params, data);
					for (key in params) {
						if (_type.isFunction (params[key])) {
							params[key] = params[key] ();
						}
					}
					data = [""];
					break;
				default:
					data = [data];
			}
		}
		else data = [""];

		return data;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {mixed} node Description
	 * @param {mixed} data Description
	 */
	_write_data = function (node, data) {
		if (!_type.isObject (data)) {
			if (_type.isFunction (data)) {
				node.append (node.model.getInstance ("text", data ()));
			}
			else if (_type.isDefined (data) && data != "") {
				node.append (node.model.getInstance ("text", data.toString ()));
			}
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {mixed} data Description
	 * @return Description
	 * @type Object
	 */
	_copy_data = function (data) {
		var object = {};

		for (key in data) {
			if (_type.isFunction (data[key]))
				object[key] = data[key] ();
			else
				object[key] = data[key];
		}

		return object;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {Object} set Description
	 * @param {String} id Description
	 * @param {mixed} node Description
	 */
	_save_node = function (set, id, node) {
		var current = set[id];

		if (_type.isUndefined (current)) 
			set[id] = node;
		else if (_type.isArray (current))
			set[id].push (node);
		else {
			set[id] = new Array (current, node);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @param {Array} nodes Description
	 * @return Description
	 * @type Boolean
	 */
	_default = function (id, params, nodes) {
		var state = this.get ("_state");
		var model = this.model ();
		var parent = state["a"];
		var data = _process_data (this, params["id"], params);
		var count = (data.length || 1);
		var node, par_iterator;
		var result = true;

		for (var i = 0; i < count && result !== false; i++) {
			node = model.getInstance (id);
			par_iterator = Core._("ObjectIterator", params);

			par_iterator.forEach (function (name, value) {
				node.set (name, value);
			});

			if (nodes) {
				var interpreter = this.spawn ();

				state["a"] = node;
				interpreter.assign (data[i]);
				result = interpreter.run (nodes);
				state["a"] = parent;
			}

			_write_data (node, data[i]);
			parent.append (node);

			if (_type.isDefined (params["id"])) 
				_save_node (state["x"], params["id"], node);
		}

		return result;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type Boolean
	 */
	_apply_attributes = function (id, params) {
		var state = this.get ("_state");
		var parent = state["a"];
		var data = _copy_data (this.get (params["id"]));

		parent.set (data);

		return true;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type Boolean
	 */
	_apply_style = function (id, params) {
		var state = this.get ("_state");
		var parent = state["a"];

		if (_type.isFunction (parent["setStyle"])) {
			parent.setStyle (_copy_data (this.get (params["id"])));
		}

		return true;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf NodeContext.prototype
	 * @private
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type Boolean
	 */
	_text = function (id, params) {
		var state = this.get ("_state");
		var model = this.model ();
		var parent = state["a"];
		var content = this.get (params["id"]);

		if (_type.isString (content))
			parent.append (model.getInstance ("text", content));
		else if (_type.isString (params["content"]))
			parent.append (model.getInstance ("text", params["content"]));

		return true;
	};

	return NodeContext;
}) ());

