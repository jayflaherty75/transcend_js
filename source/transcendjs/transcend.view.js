//-----------------------------------------------------------------------------
/**
 * @fileoverview View class that may be extended to a child class containing
 * 	logic for rendering a module.  This class may directly render the page or
 * 	make use of {@link Template} objects.<br /><br />
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.extend ("View", "Container", (function () {
	var View = /** @lends View.prototype */ {
		/**
		 * @class View class that may be extended to a child class containing
		 * logic for rendering a module.<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link Controller}.
		 * @extends Container
		 * @constructs
		 */
		oninit: function () {
			this.engine = Core._("Property");
		},

		//---------------------------------------------------------------------
		/**
		 * Calls <i>onprerender()</i>, <i>onrender()</i> and <i>onpostrender()</i>
		 * of the View instance.
		 * @name View#render
		 * @function
		 * @return Returns any data returned by the <i>onrender()</i> handler.
		 * @type Any
		 */
		render: function (parent) {
			var result;
			if (Object.isFunction (this.onprerender)) this.onprerender (parent);
			if (Object.isFunction (this.onrender))
				result = this.onrender (parent);
			if (Object.isFunction (this.onpostrender))
				result = this.onpostrender (result);
	
			return result;
		}
	};

	return View;
}) ());

