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
Core.singleton ("UI", (function () {
	var _type = Core._("Helpers.Type");
	var UI;

	/**
	 * @namespace Description<br/>
	 * <br/>
 	 * If you would like to continue with the tutorial, continue to {@link UIControlAbstract}.
	 */
	UI = {
		//---------------------------------------------------------------------
		/**
		 * Description
		 * @memberOf UI
		 * @function
		 * @param {String} name Description
		 * @return Description
		 * @type TemplateView|false
		 */
		createView: function (name) {
			var view = Core._("TemplateView");

			if (_type.isDefined (view)) {
				view.setTemplate (Core._("Templates." + name));

				return view;
			}

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * Description
		 * @memberOf UI
		 * @function
		 * @param {DOMElement} element Description
		 * @return Description
		 * @type UIControl|false
		 */
		getControl: function (element) {
			return element["_ui_control"] || false;
		}
	};

	UI._ = UI.createView;

	return UI;
}) ());

//-----------------------------------------------------------------------------
Core.singleton ("Templates", Core._("CoreBranch")).register ("UI");

