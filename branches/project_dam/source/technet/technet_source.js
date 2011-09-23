//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.extend ("SourceController", "Controller", /** @lends SourceController */ (function () {
	/**
	 * @class Description
	 */
	var oninit, onpostinit, onstartup, load, save;
	var _default_type = "Object";
	var _type = Core._("Helpers.Type");

	//-------------------------------------------------------------------------
	/**
	 * @constructs
	 */
	oninit = function () {
		this.register ("_load", load);
		this.register ("_save", save);
		this.assign ("model_key", "_MODEL");
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name SourceController#onpostinit
	 * @function
	 * @param {mixed} result Description
	 * @return Description
	 * @type mixed
	 */
	onpostinit = function (result) {
		this.run();

		return result;
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name SourceController#onstartup
	 * @function
	 */
	onstartup = function () {
		this.immediateMode (true);
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name SourceController#$load
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} obj Description
	 */
	load = function (event, obj) {
		if (_type.isFunction (this.onload)) {
			this.onload (obj, function (response, success) {
				var _type_reup = _type, _default_type_reup = _default_type;
				var model_key = this.get ("model_key");
				var response_type = _default_type_reup;

				if (success) {
					if (_type_reup.isFunction (model_key)) {
						response_type = model_key (response);
					}
					else if (model_key) {
						if (_type_reup.isDefined (response[model_key])) {
							response_type = response[model_key];
							delete response[model_key];
						}
					}

					obj.convert (Core._ (response_type + "Iterator", response));

					if (_type_reup.isFunction (obj.onload)) obj.onload (response);
				}
				else {
					if (_type_reup.isFunction (obj.onerror)) obj.onerror (response);
				}
			}.bind (this));
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @name SourceController#$save
	 * @function
	 * @param {Event} event Description
	 * @param {mixed} obj Description
	 */
	save = function (event, obj) {
		if (_type.isFunction (this.onsave)) {
			this.onsave (obj, function (response, success) {
				var _type_reup = _type;

				if (success) {
					if (_type_reup.isFunction (obj.onsave)) obj.onsave (response);
				}
				else {
					if (_type_reup.isFunction (obj.onerror)) obj.onerror (response);
				}
			}.bind (this));
		}
	};

	return {
		oninit: oninit,
		onpostinit: onpostinit,
		onstartup: onstartup
	};
}) ());

