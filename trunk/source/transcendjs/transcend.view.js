//-----------------------------------------------------------------------------
/**
 * @fileoverview View class that may be extended to a child class containing
 * 	logic for rendering a module.  This class may directly render the page or
 * 	make use of {@link Template} objects.<br /><br />
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("View", "Container", /** @lends View */ (function () {
	/**
	 * @class View class that may be extended to a child class containing
	 * 	logic for rendering a module.
	 * @constructs
	 */
	var oninit =  function () {
		this.engine = Core._("Property");
	};

	//-------------------------------------------------------------------------
	/**
	 * For views utilizing templates, returns the template.
	 * @name View#getEngine
	 * @function
	 * @return Returns the Template object being used by the View
	 * @type Template
	 */
	//var get_engine = function () {
	//	if (Object.isFunction (this.onengine))
	//		return this.onengine ();
	//	else
	//		return null;
	//};

	//-------------------------------------------------------------------------
	/**
	 * Calls <i>onprerender()</i>, <i>onrender()</i> and <i>onpostrender()</i>
	 * of the View instance.
	 * @name View#render
	 * @function
	 * @return Returns any data returned by the <i>onrender()</i> handler.
	 * @type Any
	 */
	var render = function (parent) {
		var result;
		if (Object.isFunction (this.onprerender)) this.onprerender (parent);
		if (Object.isFunction (this.onrender))
			result = this.onrender (parent);
		if (Object.isFunction (this.onpostrender))
			result = this.onpostrender (result);

		return result;
	};

	return {
		oninit: oninit,
		//getEngine: get_engine,
		render: render
	};
}) ());

