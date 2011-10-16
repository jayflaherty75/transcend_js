//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br/><br/>
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("NodeContext", "Context", /** @lends NodeContext */ (function () {
	/**
	 * @class Description
	 */
	var _type = Core._("Helpers.Type");

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#process_data
	 * @function
	 * @param {Interpreter} interpreter Description
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type mixed
	 */
	var process_data = function (interpreter, id, params) {
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

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#write_data
	 * @function
	 * @param {mixed} node Description
	 * @param {mixed} data Description
	 */
	var write_data = function (node, data) {
		if (!_type.isObject (data)) {
			if (_type.isFunction (data)) {
				node.append (node.model.getInstance ("text", data ()));
			}
			else if (_type.isDefined (data) && data != "") {
				node.append (node.model.getInstance ("text", data.toString ()));
			}
		}
	};

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#copy_data
	 * @function
	 * @param {mixed} data Description
	 * @return Description
	 * @type Object
	 */
	var copy_data = function (data) {
		var object = {};

		for (key in data) {
			if (_type.isFunction (data[key]))
				object[key] = data[key] ();
			else
				object[key] = data[key];
		}

		return object;
	};

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#save_node
	 * @function
	 * @param {Object} set Description
	 * @param {String} id Description
	 * @param {mixed} node Description
	 */
	var save_node = function (set, id, node) {
		var current = set[id];

		if (_type.isUndefined (current)) 
			set[id] = node;
		else if (_type.isArray (current))
			set[id].push (node);
		else {
			set[id] = new Array (current, node);
		}
	};

	//--------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name NodeContext#onstart
	 * @function
	 * @param {type} code Description
	 * @return Description
	 * @type Boolean
	 */
	var onstart = function (code) {
		var state = this.get ("_state");

		if (_type.isDefined (state)) {
			state["x"] = {};
			return true;
		}

		return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name NodeContext#oncomplete
	 * @function
	 * @param {Boolean} result Description
	 * @return Description
	 * @type Object|false
	 */
	var oncomplete = function (result) {
		var state = this.get ("_state");

		if (_type.isDefined (state)) {
			return state.x;
		}

		return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#oncomplete
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @param {Array} nodes Description
	 * @return Description
	 * @type Boolean
	 */
	var _default = function (id, params, nodes) {
		var state = this.get ("_state");
		var model = this.model ();
		var parent = state["a"];
		var data = process_data (this, params["id"], params);
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

			write_data (node, data[i]);
			parent.append (node);

			if (_type.isDefined (params["id"])) 
				save_node (state["x"], params["id"], node);
		}

		return result;
	};

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#apply_attributes
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type Boolean
	 */
	var apply_attributes = function (id, params) {
		var state = this.get ("_state");
		var parent = state["a"];
		var data = copy_data (this.get (params["id"]));

		parent.set (data);

		return true;
	};

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#apply_style
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type Boolean
	 */
	var apply_style = function (id, params) {
		var state = this.get ("_state");
		var parent = state["a"];

		if (_type.isFunction (parent["setStyle"])) {
			parent.setStyle (copy_data (this.get (params["id"])));
		}

		return true;
	};

	//--------------------------------------------------------------------
	/**
	 * Private. Description, events, exceptions, example
	 * @name NodeContext#text
	 * @function
	 * @param {String} id Description
	 * @param {Object} params Description
	 * @return Description
	 * @type Boolean
	 */
	var text = function (id, params) {
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

	//--------------------------------------------------------------------
	/**
	 * @constructs
	 * @param {any} data Collection or data structure to be iterated
	 */
	var oninit = function () {
		this.register ("_default", _default);
		this.register ("apply-attributes", apply_attributes);
		this.register ("apply-style", apply_style);
		this.register ("text", text);
	};

	return {
		oninit: oninit,
		onstart: onstart,
		oncomplete: oncomplete
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("Template", "Interpreter", /** @lends Template */ (function () {
	var _type = Core._("Helpers.Type");

	//--------------------------------------------------------------------
	/**
	 * @class Description
	 * @constructs
	 */
	var oninit = function () {
		if (!this.model.isSet()) this.model (Core._("DomModel"));
	};

	//--------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Template#apply
	 * @function
	 * @param {mixed} template Description
	 * @param {mixed} target Description
	 * @return Description
	 * @type Array|false
	 */
	var apply = function (template, target) {
		var state, model;

		if (this.context.isSet ()) {
			if (template) this.code (template);

			state = this.get ("_state");
			model = this.model ();
			state["a"] = model.getInstance (target);

			return this.run ();
		}

		return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name Template#getElement
	 * @function
	 * @param {String} id Description
	 * @return Description
	 * @type mixed|false
	 */
	var get_element = function (id) {
		var state = this.get ("_state");

		return state.x[id] || false;
	};

	return {
		oninit: oninit,
		apply: apply,
		getElement: get_element,
		_: get_element
	};
}) ());

