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
Core.extend ("Template", "Interpreter", (function () {
	var _type = Core._("Helpers.Type");

	var Template = /** @lends Template.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description
		 * @extends Interpreter
		 * @constructs
		 */
		oninit: function () {
			if (!this.model.isSet()) this.model (Core._("DomModel"));
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name Template#apply
		 * @function
		 * @param {mixed} template Description
		 * @param {mixed} target Description
		 * @return Description
		 * @type Array|false
		 */
		apply: function (template, target) {
			var state, model;

			if (this.context.isSet ()) {
				if (template) this.code (template);

				state = this.get ("_state");
				model = this.model ();
				state["a"] = model.getInstance (target);

				return this.run ();
			}

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name Template#getElement
		 * @function
		 * @param {String} id Description
		 * @return Description
		 * @type mixed|false
		 */
		getElement: function (id) {
			var state = this.get ("_state");

			return state.x[id] || false;
		}
	};

	Template._ = Template.getElement;

	return Template;
}) ());

