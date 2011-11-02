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
Core.extend ("ButtonControl", "UIControlAbstract", (function () {
	var _type = Core._("Helpers.Type");
	var _onclick;

	Core._("Templates.UI").register ("Button", new Array (
		{ action: "div", id: "root", style: "height: 20px;", _nodes: [
			{ action: "apply-style", id: "style" },
			{ action: "apply-attributes", id: "attribs" }//,
			//{ action: "text", id: "content" }
		]}
	));

	var ButtonControl = /** @lends ButtonControl.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description, events, exceptions, example
		 * @extends UIControlAbstract
		 * @constructs
		 */
		oninit: function () {
			var view = Core._("UI").createView ("UI.Button");

			this.view (view);
			this.assign ("area_name", "root");
			this.assign ("content_name", "root");
			this.assign ("attribs", { "class" : "button" });
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @name ButtonControl#onpostrender
		 * @function
		 * @param {Element} parent Description
		 * @param {Array} elements Description
		 * @return Description
		 * @type boolean
		 */
		onpostrender: function (parent, elements) {
			var area_name = this.get ("area_name");
			var content_name = this.get ("content_name");
			var content = this.getController ("content");

			if (_type.isDefined (content))
				content.action ("render", elements[content_name]);

			Core.listen (elements[area_name], "click", _onclick.bind (this));

			return true;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @memberOf ButtonControl.prototype
	 * @function
	 * @private
	 * @param {Event} event Description
	 * @return Description
	 * @type boolean
	 */
	_onclick = function (event) {
		if (_type.isFunction (this.onclick))
			this.onclick (event);

		return true;
	};

	return ButtonControl;
}) ());


