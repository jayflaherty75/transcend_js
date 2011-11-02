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
Core.extend ("CaptionControl", "UIControlAbstract", (function () {
	var _type = Core._("Helpers.Type");
	var _onclick;

	Core._("Templates.UI").register ("Caption", new Array (
		{ action: "text", id: "content" }
	));

	var ButtonControl = /** @lends ButtonControl.prototype */ {
		//---------------------------------------------------------------------
		/**
		 * @class Description, events, exceptions, example
		 * @extends UIControlAbstract
		 * @constructs
		 */
		oninit: function () {
			this.view (Core._("UI").createView ("UI.Caption"));
		}
	};

	return ButtonControl;
}) ());


