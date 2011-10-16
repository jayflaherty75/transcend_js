//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

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

