//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core.extend ("Batch", "Container", /** @lends Batch */ (function () {
	var _type = Core._("Helpers.Type");
	var _ref_class = Core.getClass ("Reference");
	var oninit, action, run, map, get_function;
	var _default_value = false;

	//-------------------------------------------------------------------------
	/**
	 * @class Batch handles automated controller actions
	 * @constructs
	 * @param {Controller} controller Description
	 */
	oninit = function (controller) {
		this._controller = Core._ ("Property", controller);
		this._mappings = _default_value;
		this._actions = new Array (new Array ("batch_start"));
		this._is_closed = false;

		for (var i = 1; i < arguments.length; i++) {
			this.map (arguments[i]);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#action
	 * @function
	 * @param {mixed} ... Description
	 * @return Description
	 * @type Batch
	 */
	action = function () {
		var action_name = arguments[0];

		if (!this._is_closed) {
			if (_type.isString (action_name) || action_name instanceof _ref_class)
				this._actions.push ($A(arguments));
		}

		return this;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#run
	 * @function
	 */
	run = function (controller) {
		controller = controller || this._controller ();

		if (!this._is_closed) {
			this._actions.push (new Array ("batch_end"));
			this._is_closed = true;
		}

		if (controller) controller.action (this._actions);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#map
	 * @function
	 * @param {String} arg_name Description
	 * @return Description
	 * @type Batch
	 */
	map = function (arg_name) {
		if (_type.isString (arg_name)) {
			if (this._mappings === false)
				this._mappings = new Array ();

			this._mappings.push (arg_name);
		}

		return this;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @name Batch#getFunction
	 * @function
	 * @param {mixed} ... Description
	 * @return Description
	 * @type Function
	 */
	get_function = function (controller) {
		return function () {
			for (var i = 0; i < this._mappings.length; i++) {
				this.assign (this._mappings[i], arguments[i]);
			}

			this.run (controller);
		}.bind (this);
	};

	return {
		oninit: oninit,
		action: action,
		run: run,
		map: map,
		getFunction: get_function
	};
}) ());


