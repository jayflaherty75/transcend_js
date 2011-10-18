//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("TemplateView", "View", /** @lends TemplateView# */ (function () {
	/**
	 * @class Default view providing integration with {@link Template} 
	 * 	instances.
	 * @extends View
	 * @constructs
	 * @param {object} template Template data
	 * @param {object} parent Target location of data.  For templates using the
	 *  DOM Context, this would be the Element containing the output.
	 * @param {Context} context Context object describing the method of
	 * 	interpretation of the template data.
	 * @return TemplateView
	 */
	var oninit = function (template, _parent, context) {
		var _context = Core._("NodeContext");
		var _model = Core._("DomModel");
		var _engine = Core._("Template", _context);

		_engine.model (_model);

		this.engine (_engine);

		//---------------------------------------------------------------------
		/**
		 * Once rendered, accesses the element with the given id.  If more than
		 * one element is found, an array of elements is passed.
		 * @name TemplateView#getElement
		 * @function
		 * @param {string} id 
		 * @return Returns the element for this given id.  Returns an array of
		 * 	elements if there is more than one result.
		 * @type Element
		 */
		this.getElement = function (id) { return _engine._(id); };

		//---------------------------------------------------------------------
		/**
		 * Handles requests for the tample from the base class.
		 * @name TemplateView#ontemplate
		 * @function
		 * @return Returns the Template being used by the current View
		 * @type Template
		 */
		//this.ontemplate = function () { return _engine; };

		//---------------------------------------------------------------------
		/**
		 * Handles assigned values for the base class.
		 * @name TemplateView#onset
		 * @function
		 * @param {string} key 
		 * @param {string} value 
		 */
		this.onset = _engine.onset.bind (_engine);

		//---------------------------------------------------------------------
		/**
		 * Handles requests for values from the base class.
		 * @name TemplateView#onget
		 * @function
		 * @param {string} key 
		 * @return Returns the value from the given key.
		 * @type Any
		 */
		this.onget = _engine.onget.bind (_engine);

		//---------------------------------------------------------------------
		this.isset = _engine.isset.bind (_engine);

		//---------------------------------------------------------------------
		/**
		 * Handles requests to delete values from the base class.
		 * @name TemplateView#onunset
		 * @function
		 * @param {string} key 
		 * @return Returns the deleted value from the given key.
		 * @type Any
		 */
		this.onunset = _engine.onunset.bind (_engine);

		//---------------------------------------------------------------------
		/**
		 * Handles call to render the template.
		 * @name TemplateView#onrender
		 * @function
		 * @return Returns an array of elements generated by the template
		 * @type Array
		 */
		this.onrender = function (parent) {
			_result = _engine.apply (template, parent || _parent);

			return _result;
		};

		this._ = this.getElement;
	};

	//-------------------------------------------------------------------------
	/*
	 * Once rendered, accesses the element with the given id.  If more than
	 * one element is found, an array of elements is passed.
	 * @name TemplateView#getElement
	 * @function
	 * @param {string} id 
	 */
	//getElement: function (id) { this.getTemplate()._(id); }
	return {
		oninit: oninit
	};
}) ());
