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
Core.register ("ModelAbstract", (function () {
	var _type = Core._("Helpers.Type");
	var _instanceMethods;

	var ModelAbstract = /** @lends ModelAbstract.prototype */ {
		/**
		 * @class Description
		 * 
		 * <u>Events</u><br/>
		 * <i>oninit ()</i> - Called on instantiation<br/>
		 * <i>oninsert ()</i> - Description<br/>
		 * <i>onremove ()</i> - Description<br/>
		 * <i>oncompare ()</i> - Description<br/>
		 * <i>onset ()</i> - Description<br/>
		 * <i>onget ()</i> - Description<br/>
		 * <i>onchange ()</i> - Description<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link Model}.<br/>
	 	 * <br/>
	 	 * See also {@link ArrayModel}, {@link ObjectModel}, {@link DomModel}, {@link ImageModel}.
		 * @constructs
		 */
		initialize: function (source) {
			//-----------------------------------------------------------------
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
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#getInstance
		 * @function
		 * @param {...} varargs Description
		 * @return Description
		 * @type any
		 */
		getInstance: function () {
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
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#load
		 * @function
		 * @param {object} obj Instance created by ModelAbstract.getInstance()
		 */
		load: function (obj) {
			var source = this.source ();

			if (_type.isDefined (source)) source.action ("_load", obj);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#save
		 * @function
		 * @param {object} obj Instance created by ModelAbstract.getInstance()
		 */
		save: function (obj) {
			var source = this.source ();

			if (_type.isDefined (source)) source.action ("_save", obj);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#convert
		 * @function
		 * @param {object} obj Destination object
		 * @param {Iterator} src_iterator Iterator of source data 
		 */
		convert: function (obj, src_iterator) {
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
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#set
		 * @function
		 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
		 * @param {any} ref Description
		 * @param {any} value Description
		 */
		set: function (obj, ref, value) {
			if (typeof (this.filterReference) == "function")
				ref = this.filterReference.bind (obj) (ref);

			if (typeof (obj.onwrite) == "function") 
				value = obj.onwrite (value);

			if (typeof (obj.onset) == "function") 
				return obj.onset (ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#get
		 * @function
		 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
		 * @param {any} ref Description
		 * @return Returns the data for the given reference
		 * @type any
		 */
		get: function (obj, ref) {
			var value;

			if (typeof (this.filterReference) == "function")
				ref = this.filterReference.bind (obj) (ref);

			if (typeof (obj.onget) == "function") value = obj.onget (ref);
			if (typeof (obj.onread) == "function") value = obj.onread (value);

			return value;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#unset
		 * @function
		 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
		 * @param {any} ref Description
		 * @return Returns the data removed
		 * @type any
		 */
		unset: function (obj, ref) {
			var value;

			if (typeof (this.filterReference) == "function")
				ref = this.filterReference.bind (obj) (ref);

			if (typeof (obj.onunset) == "function")
				value = obj.onunset (ref);

			if (typeof (obj.onread) == "function")
				value = obj.onread (value);

			return value;
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#append
		 * @function
		 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
		 * @param {any} value Description
		 * @return Returns the reference, index or node for the new data
		 * @type any
		 */
		append: function (obj, value) {
			var ref;

			if (typeof (this.getLastRef) == "function")
				ref = this.getLastRef.bind (obj) ();

			if (typeof (obj.onwrite) == "function") 
				value = obj.onwrite (value);

			if (typeof (obj.oninsert) == "function") 
				return obj.oninsert (ref, value);
		},

		//---------------------------------------------------------------------
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
		insert: function (obj, ref, value) {
			if (typeof (this.filterReference) == "function")
				ref = this.filterReference.bind (obj) (ref);

			if (typeof (obj.onwrite) == "function") 
				value = obj.onwrite (value);

			if (typeof (obj.oninsert) == "function") 
				return obj.oninsert (ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, exceptions
		 * @name ModelAbstract#prepend
		 * @function
		 * @param {object} obj Proxy or instance created by ModelAbstract.getInstance()
		 * @param {any} value Description
		 * @return Returns the reference, index or node for the new data
		 * @type any
		 */
		prepend: function (obj, value) {
			if (typeof (obj.onwrite) == "function") 
				value = obj.onwrite (value);

			if (typeof (obj.oninsert) == "function") 
				return obj.oninsert (ref, value);
		},

		//---------------------------------------------------------------------
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
		compare: function (obj, value1, value2) {
			if (typeof (obj.oncompare) == "function") 
				return obj.oncompare (value1, value2);
		},

		//---------------------------------------------------------------------
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
		isEqual: function (obj, value1, value2) {
			if (obj.compare (value1, value2) == 0)
				return true;
			else
				return false;
		},

		//---------------------------------------------------------------------
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
		isLess: function (obj, value1, value2) {
			if (obj.compare (value1, value2) < 0)
				return true;
			else
				return false;
		},

		//---------------------------------------------------------------------
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
		isGreater: function (obj, value1, value2) {
			if (obj.compare (value1, value2) > 0)
				return true;
			else
				return false;
		},

		//---------------------------------------------------------------------
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
		isLTE: function (obj, value1, value2) {
			if (obj.compare (value1, value2) <= 0)
				return true;
			else
				return false;
		},

		//---------------------------------------------------------------------
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
		isGTE: function (obj, value1, value2) {
			if (obj.compare (value1, value2) >= 0)
				return true;
			else
				return false;
		}
	};

	//-------------------------------------------------------------------------
	/**
	 * @namespace Instance methods extend each instance created by the model<br/>
	 * <br/>
 	 * If you would like to continue with the tutorial, continue to {@link Batch}.
	 */
	_instanceMethods = {

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {String} name Description
		 * @param {mixed} value Description
		 */
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

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @return Description
		 * @type Iterator
		 */
		getIterator: function () {
			return new (this.model.defaultIterator()) (this);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} data Description
		 */
		set: function (ref, data) {
			this.model.set (this, ref, data);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @return Description
		 * @type mixed
		 */
		get: function (ref) {
			return this.model.get (this, ref);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @return Description
		 * @type mixed
		 */
		unset: function (ref) {
			return this.model.unset (this, ref);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} data Description
		 * @return Description
		 * @type mixed
		 */
		append: function (data) {
			return this.model.append (this, data);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} data Description
		 * @return Description
		 * @type mixed
		 */
		insert: function (ref, data) {
			return this.model.insert (this, data);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} data Description
		 * @return Description
		 * @type mixed
		 */
		prepend: function (data) {
			return this.model.prepend (this, data);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {Iterator} src_iterator Description
		 * @return Description
		 * @type mixed
		 */
		convert: function (src_iterator) {
			return this.model.convert (this, src_iterator);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} value Description
		 * @return Description
		 * @type number
		 */
		compare: function (ref, value) {
			return this.model.compare (this, ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} value Description
		 * @return Description
		 * @type boolean
		 */
		isEqual: function (ref, value) {
			return this.model.isEqual (this, ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} value Description
		 * @return Description
		 * @type boolean
		 */
		isLess: function (ref, value) {
			return this.model.isLess (this, ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} value Description
		 * @return Description
		 * @type boolean
		 */
		isGreater: function (ref, value) {
			return this.model.isGreater (this, ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} value Description
		 * @return Description
		 * @type boolean
		 */
		isLTE: function (ref, value) {
			return this.model.isLTE (this, ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @param {mixed} ref Description
		 * @param {mixed} value Description
		 * @return Description
		 * @type boolean
		 */
		isGTE: function (ref, value) {
			return this.model.isGTE (this, ref, value);
		},

		//---------------------------------------------------------------------
		/**
		 * Description, events, exceptions, example
		 * @memberOf _instanceMethods
		 * @function
		 * @return Description
		 * @type mixed
		 */
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

	return ModelAbstract;
}) ());

