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
Core.extend ("UIControlAbstract", "Controller", (function () {
	var _type = Core._("Helpers.Type");
	var _render_action;

	var UIControlAbstract = /** @lends UIControlAbstract.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description, events, exceptions, example<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link TransportController}.
		 * @extends Controller
		 * @constructs
		 * @param {type} param_name Description
		 */
		oninit: function () {
			this.register ("render", _render_action);
			this.immediateMode (true);
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf UIControlAbstract.prototype
	 * @function
	 * @private
	 * @param {Event} event Description
	 * @param {DOMElement} parent Description
	 * @return Description
	 * @type type
	 */
	_render_action = function (event, parent) {
		var scope = this.getModel ("content");
		var view = this.view();
		var elements;

		view.link (this);

		if (_type.isDefined (scope)) view.assign (scope);

		if (_type.isFunction (this.onprerender))
			this.onprerender (parent);

		elements = view.render (parent);

		for (var element in elements)
			element["_ui_control"] = this;

		if (_type.isFunction (this.onpostrender))
			this.onpostrender (parent, elements);

		return true;
	};

	return UIControlAbstract;
}) (), 
(function () {
	var _type = Core._("Helpers.Type");

	//--------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @static
	 * @memberOf UIControlAbstract
	 * @return true on pass, false on fail
	 * @type boolean
	 */
	var test = function () {
		return true;
	};

	return {
		test: test
	};
}) ());

