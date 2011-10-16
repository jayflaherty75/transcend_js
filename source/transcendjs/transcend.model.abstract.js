//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.register ("ModelAbstract", /** @lends ModelAbstract */ (function () {
	/**
	 * @class Description
	 * 
	 * 	<u>Events</u><br/>
	 * 	<i>oninit ()</i> - Called on instantiation<br/>
	 * 	<i>oninsert ()</i> - Description<br/>
	 * 	<i>onremove ()</i> - Description<br/>
	 * 	<i>oncompare ()</i> - Description<br/>
	 * 	<i>onset ()</i> - Description<br/>
	 * 	<i>onget ()</i> - Description<br/>
	 * 	<i>onchange ()</i> - Description<br/>
	 * @constructs
	 */
	var _type = Core._("Helpers.Type");

	//Instance methods extend each instance created by the model
	var _instanceMethods = {
		/*getID: function () {
			if (_type.isUndefined (this.id))
				this.id = Core._("Helpers.Unique")._();

			return this.id;
		},*/

		setAttribute: function (name, value) {
			var self = this;

			try {
				self[name] = value;
			}
			catch (e) {
			}

			if (name == "src") this.model.load (this);
			else if (name == "dest") this.model.save (this);
		},

		getIterator: function () {
			return new (this.model.defaultIterator()) (this);
		},

		set: function (ref, data) {
			this.model.set (this, ref, data);
		},

		get: function (ref) {
			return this.model.get (this, ref);
		},

		unset: function (ref) {
			return this.model.unset (this, ref);
		},

		append: function (data) {
			return this.model.append (this, data);
		},

		insert: function (ref, data) {
			return this.model.insert (this, data);
		},

		prepend: function (data) {
			return this.model.prepend (this, data);
		},

		convert: function (src_iterator) {
			return this.model.convert (this, src_iterator);
		},

		compare: function (ref, value) {
			return this.model.compare (this, ref, value);
		},

		isEqual: function (ref, value) {
			return this.model.isEqual (this, ref, value);
		},

		isLess: function (ref, value) {
			return this.model.isLess (this, ref, value);
		},

		isGreater: function (ref, value) {
			return this.model.isGreater (this, ref, value);
		},

		isLTE: function (ref, value) {
			return this.model.isLTE (this, ref, value);
		},

		isGTE: function (ref, value) {
			return this.model.isGTE (this, ref, value);
		},

		copy: function () {
			var object = this.model.getInstance ();
			var iterator = new (this.model.defaultIterator()) (this);

			return this.model.convert (object, iterator);

//			iterator.each (function (ref, value) {
//				object.set (ref, value);
//			});

//			return object;
		}

		/*
		forEach: function (result) {
			return result;
		},

		reverse: function () {
		},

		sort: function (sortfunc) {
		},

		search: function (result) {
			return result;
		},

		toString: function (result) {
			return result;
		},

		valueOf: function (result) {
			return result;
		},

		map: function (func, result) {
			return result;
		},

		filter: function (testfunc, result) {
			return result;
		},

		every: function (testfunc, result) {
			return result;
		},

		some: function (testfunc, result) {
			return result;
		},

		pop: function (result) {
			return result;
		},

		push: function (element, result) {
			return result;
		},

		shift: function (result) {
			return result;
		},

		unshift: function () {
		},

		concat: function () {
		},

		join: function (seperator, result) {
			return result;
		},

		slice: function (start, end, result) {
			return result;
		},

		splice: function () {
		}
		*/
	};

	var initialize = function (source) {
		//--------------------------------------------------------------------
		/**
		 * Description
		 * @name ModelAbstract#className
		 * @type Property (string)
		 */
		this.className = Core._("Property");

		/**
		 * Description
		 * @name ModelAbstract#source
		 * @type Property (ClientConnection)
		 */
		this.source = Core._("Property", source);

		/**
		 * Description
		 * @name ModelAbstract#defaultIterator
		 * @type Property (constructor)
		 */
		this.defaultIterator = Core._("Property");

		/**
		 * Description
		 * @name ModelAbstract#reverseIterator
		 * @type Property (constructor)
		 */
		this.reverseIterator = Core._("Property");

		if (typeof (this.oninit) == "function") this.oninit ();
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#getInstance
	 * @function
	 * @param {...} varargs Description
	 * @return Description
	 * @type any
	 */
	var get_instance = function () {
		var instance, mcast;
		var _setattr;

		if (typeof (this.oncreate) == "function") {
			instance = this.oncreate.apply (this, arguments);

			$H(_instanceMethods).each (function (method) {
				if (typeof (instance[method.key]) == "undefined") {
					try {
						instance[method.key] = method.value;
					}
					catch (e) {
					}
				}
				else {
					//Method already exists in new instance, make multicast
					//so that both functions get called.
					try {
						mcast = Core._(
							"Multicast",
							instance[method.key].bind (instance), 
							method.value.bind (instance)
						);
						instance[method.key] = mcast.call.bind (mcast);
					}
					catch (e) {
					}
				}
			});

			try {
				instance.model = this;
				if (this.onset) instance.onset = this.onset;
				if (this.onget) instance.onget = this.onget;
				if (this.onunset) instance.onunset = this.onunset;
				if (this.onread) instance.onread = this.onread;
				if (this.onwrite) instance.onwrite = this.onwrite;
				if (this.oninsert) instance.oninsert = this.oninsert;
				if (this.oncompare) instance.oncompare = this.oncompare;
			}
			catch (e) {
			}

			return instance;
		}
		else {
			return null;
		}
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#load
	 * @function
	 * @param {object} obj Instance created by ModelAbstract.getInstance()
	 */
	var load = function (obj) {
		var source = this.source ();

		if (_type.isDefined (source)) source.action ("_load", obj);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#save
	 * @function
	 * @param {object} obj Instance created by ModelAbstract.getInstance()
	 */
	var save = function (obj) {
		var source = this.source ();

		if (_type.isDefined (source)) source.action ("_save", obj);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#convert
	 * @function
	 * @param {object} obj Destination object
	 * @param {Iterator} src_iterator Iterator of source data 
	 */
	var convert = function (obj, src_iterator) {
		src_iterator.forEach (function (ref, value) {
			if (typeof (value) != "function" && !(value instanceof Core.getClass ("ModelAbstract"))) {
				if (typeof (ref) != "undefined") {
					obj.set (ref, value);
				}
				else {
					obj.append (value);
				}
			}
		}.bind (obj));

		return obj;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#set
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} ref Description
	 * @param {any} value Description
	 */
	var set = function (obj, ref, value) {
		if (typeof (this.filterReference) == "function")
			ref = this.filterReference.bind (obj) (ref);

		if (typeof (obj.onwrite) == "function") 
			value = obj.onwrite (value);

		if (typeof (obj.onset) == "function") 
			return obj.onset (ref, value);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#get
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} ref Description
	 * @return Returns the data for the given reference
	 * @type any
	 */
	var get = function (obj, ref) {
		var value;

		if (typeof (this.filterReference) == "function")
			ref = this.filterReference.bind (obj) (ref);

		if (typeof (obj.onget) == "function") value = obj.onget (ref);
		if (typeof (obj.onread) == "function") value = obj.onread (value);

		return value;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#unset
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} ref Description
	 * @return Returns the data removed
	 * @type any
	 */
	var unset = function (obj, ref) {
		var value;

		if (typeof (this.filterReference) == "function")
			ref = this.filterReference.bind (obj) (ref);

		if (typeof (obj.onunset) == "function")
			value = obj.onunset (ref);

		if (typeof (obj.onread) == "function")
			value = obj.onread (value);

		return value;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#append
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value Description
	 * @return Returns the reference, index or node for the new data
	 * @type any
	 */
	var append = function (obj, value) {
		var ref;

		if (typeof (this.getLastRef) == "function")
			ref = this.getLastRef.bind (obj) ();

		if (typeof (obj.onwrite) == "function") 
			value = obj.onwrite (value);

		if (typeof (obj.oninsert) == "function") 
			return obj.oninsert (ref, value);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#insert
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} ref Description
	 * @param {any} value Description
	 * @return Returns the reference, index or node for the new data
	 * @type any
	 */
	var insert = function (obj, ref, value) {
		if (typeof (this.filterReference) == "function")
			ref = this.filterReference.bind (obj) (ref);

		if (typeof (obj.onwrite) == "function") 
			value = obj.onwrite (value);

		if (typeof (obj.oninsert) == "function") 
			return obj.oninsert (ref, value);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#prepend
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value Description
	 * @return Returns the reference, index or node for the new data
	 * @type any
	 */
	var prepend = function (obj, value) {
		if (typeof (obj.onwrite) == "function") 
			value = obj.onwrite (value);

		if (typeof (obj.oninsert) == "function") 
			return obj.oninsert (ref, value);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#compare
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value1 Description
	 * @param {any} value2 Description
	 * @return Returns 0 if equal, -1 if less than and 1 if greater than
	 * @type integer
	 */
	var compare = function (obj, value1, value2) {
		if (typeof (obj.oncompare) == "function") 
			return obj.oncompare (value1, value2);
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#isEqual
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value1 Description
	 * @param {any} value2 Description
	 * @return Description
	 * @type boolean
	 */
	var is_equal = function (obj, value1, value2) {
		if (obj.compare (value1, value2) == 0)
			return true;
		else
			return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#isLess
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value1 Description
	 * @param {any} value2 Description
	 * @return Description
	 * @type boolean
	 */
	var is_less = function (obj, value1, value2) {
		if (obj.compare (value1, value2) < 0)
			return true;
		else
			return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#isGreater
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value1 Description
	 * @param {any} value2 Description
	 * @return Description
	 * @type boolean
	 */
	var is_greater = function (obj, value1, value2) {
		if (obj.compare (value1, value2) > 0)
			return true;
		else
			return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#isLTE
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value1 Description
	 * @param {any} value2 Description
	 * @return Description
	 * @type boolean
	 */
	var is_lte = function (obj, value1, value2) {
		if (obj.compare (value1, value2) <= 0)
			return true;
		else
			return false;
	};

	//--------------------------------------------------------------------
	/**
	 * Description, exceptions
	 * @name ModelAbstract#isGTE
	 * @function
	 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
	 * @param {any} value1 Description
	 * @param {any} value2 Description
	 * @return Description
	 * @type boolean
	 */
	var is_gte = function (obj, value1, value2) {
		if (obj.compare (value1, value2) >= 0)
			return true;
		else
			return false;
	};

	return {
		initialize:			initialize,
		getInstance:		get_instance,
		load:				load,
		save:				save,
		convert:			convert,
		set:				set,
		get:				get,
		unset:				unset,
		append:				append,
		insert:				insert,
		prepend:			prepend,
		compare:			compare,
		isEqual:			is_equal,
		isLess:				is_less,
		isGreater:			is_greater,
		isLTE:				is_lte,
		isGTE:				is_gte
	};
}) ());

