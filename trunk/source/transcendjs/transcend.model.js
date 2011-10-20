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
Core.singleton ("Model", (function () {
	var _type = Core._("Helpers.Type");
	var _string = Core._("Helpers.String");
	var _models = {};
	var Model;

	/**
	 * @namespace Singleton class providing methods for operating on models 
	 * 	and data.
	 */
	Model = {
		//---------------------------------------------------------------------
		/**
		 * Returns an instance for the given model class and caches the object
		 * based on the given source reference.  
		 * @memberOf Model
		 * @function
		 * @param {ModelAbstract (constructor)} model_class Description
		 * @param {Source} source Description
		 * @return Description
		 * @type ModelAbstract|false
		 */
		getModel: function (model_class, source) {
			var model, name, instance;

			if (typeof (model_class) == "function") {
				name = _string.trim (model_class.className ()).slice (0, -5);

				if (_type.isDefined (source))
					name += "_" + Core.getID (source);

				if (_type.isUndefined (_models[name]))
					_models[name] = new model_class (source);

				return _models[name];
			}

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * Provides a convenient method of instantiating Modeled objects and
		 * caches the models themselves, alleviating the need to maintain 
		 * instances of models.
		 * @memberOf Model
		 * @function
		 * @param {ModelAbstract (constructor)|String} model_class Description
		 * @param {Source} source Description
		 * @return Description
		 * @type Object
		 */
		getInstance: function () {
			var args = $A(arguments);
			var model_class = args.shift ();
			var source = args.shift ();

			if (_type.isString (model_class)) {
				model_class = Core.getClass (model_class);
			}

			if (model = this.getModel (model_class, source)) {
				return model.getInstance.apply (model, args);
			}

			return null;
		},

		//---------------------------------------------------------------------
		/**
		 * Associates the given data with a model based on it's type.  Doing 
		 * this allows any data not created by the system to be used within 
		 * the system.  If the data is already associated with a model (created 
		 * by the system or previously "modelized") nothing is done and the 
		 * object is returned as-is.
		 * @memberOf Model
		 * @function
		 * @param {object} object Description
		 * @return Description
		 * @type Object
		 */
		modelize: function (object, model_name, source) {
			if (_type.isUndefined (object.model)) {
				var model_class, model;

				model_name = _type.isString (model_name) ? model_name : _type.getType (object) + "Model";
				model_class = Core.getClass (model_name);
				model = this.getModel (model_class);

				object = model.getInstance (object);
			}

			return object;
		}
	};

	Model._ = Model.getInstance;

	return Model;
}) ());

