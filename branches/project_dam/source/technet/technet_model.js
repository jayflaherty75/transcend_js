//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br/><br/>
 * 
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.register ("IteratorAbstract", /** @lends IteratorAbstract */ {
	/**
	 * @class Generic iterator providing iteration support for any abstract
	 * 	data type or data structure and allowing iteration of these types to be
	 * 	interchangeable.<br/><br/>
	 * 
	 * 	<u>Events</u><br/>
	 * 	<i>oninit ()</i> - Called on instantiation<br/>
	 * 	<i>onfirst ()</i> - Handles retrieval of first element or node<br/>
	 * 	<i>onnext ()</i> - Iterates and returns elements or nodes<br/>
	 * 	<i>onend ()</i> - Handles check for end of iteration, returning true if end.<br/>
	 * 	<i>onindex (index)</i> - Handles indexing of element or node, adjusting position<br/>
	 * @constructs
	 * @param {any} data Collection or data structure to be iterated
	 */
	initialize: function (data) {
		/**
		 * Any data to be iterated.  Iterator must match data type.
		 * @name IteratorAbstract#data
		 * @type Property
		 */
		this.className = Core._("Property");
		this.data = Core._("Property", data);
		this.cursor = Core._("Property");

		//--------------------------------------------------------------------
		/**
		 * <i>See forEach()</i>
		 * @name IteratorAbstract#each
		 * @function
		 * @param {function} func Description
		 * @return A count of iterations completed
		 * @type Number
		 */
		this.each = this.forEach;

		//--------------------------------------------------------------------
		if (typeof (this.oninit) != "undefined") this.oninit ();

		if (typeof (data.model) != "undefined") {
			if (data.model.className() != this.className()) {
				return new (data.model.defaultIterator ()) (data);
				//var model = Core._(this.className () + "Model");
				//var instance = model.getInstance ();
				//var copy = new (data.model.defaultIterator ()) (data);

				//this.data (instance.convert (copy));
			}
			else
				this.data (data);
		}
		else
			this.data (data);
	},

	//--------------------------------------------------------------------
	/**
	 * Calls a <i>func</i> for each element or node.
	 * @name IteratorAbstract#forEach
	 * @function
	 * @param {function} func Description
	 * @return New Iterator instance
	 * @type Iterator
	 */
	forEach: function (func) {
		var count = 0;
		var terminate = false;
		var element;

		if (typeof (this.onfirst) == "undefined") {
			//throw exception
			return false;
		}

		if (typeof (this.onnext) == "undefined") {
			//throw exception
			return false;
		}

		if (typeof (this.onend) == "undefined") {
			//throw exception
			return false;
		}

		if (this.data.isSet () && !this.isEnd()) {
			element = this.first ();

			do {
				if (func (this.ref (), element) !== false) {
					element = this.next ();
					count++;

					if (this.isEnd()) terminate = true;
				}
				else {
					terminate = true;
				}
			} while (!terminate);
		}

		return count;
	},

	//--------------------------------------------------------------------
	/**
	 * Adjust position of iterator cursor and returns the element or node 
	 * at that position.
	 * @name IteratorAbstract#index
	 * @function
	 * @param {number} index Indexed position of iterator
	 * @return Element or node at the given position
	 * @type any
	 */
	index: function (index) {
		var element;

		if (typeof (this.onindex) == "undefined") {
			//throw exception
			return false;
		}

		element = this.onindex (index);

		if (Object.isArray (element)) element = element[0];

		return element;
	},

	//--------------------------------------------------------------------
	/**
	 * Moves position of cursor to beginning of data and returns first
	 * element or node.
	 * @name IteratorAbstract#first
	 * @function
	 * @return First element or node
	 * @type any
	 */
	first: function () {
		var element;

		if (typeof (this.onfirst) == "undefined") {
			return false;
		}

		element = this.onfirst ();

		//if (Object.isArray (element)) element = element[0];

		return element;
	},

	//--------------------------------------------------------------------
	/**
	 * Adcances the position of the cursor by one and returns the element
	 * or node at the position.
	 * @name IteratorAbstract#next
	 * @function
	 * @return Element or node
	 * @type any
	 */
	next: function () {
		var element;

		if (typeof (this.onnext) == "undefined") {
			return false;
		}

		element = this.onnext ();

		//if (Object.isArray (element)) element = element[0];

		return element;
	},

	//--------------------------------------------------------------------
	/**
	 * Returns a reference to the current element or node.  This may be an
	 * index, key or the node itself.  Basically, anything that would be
	 * passed to the Model get() function to retrieve this same data.
	 * @name IteratorAbstract#ref
	 * @function
	 * @return Reference to the current element or node.
	 * @type any
	 */
	ref: function () {
		if (typeof (this.onref) != "undefined") 
			return this.onref ();
	},

	//--------------------------------------------------------------------
	/**
	 * Checks if the cursor is at the last element or node.
	 * @name IteratorAbstract#isEnd
	 * @function
	 * @return True if cursor is on last element, false otherwise.
	 * @type boolean
	 */
	isEnd: function () {
		var result;

		if (typeof (this.onend) == "undefined") {
			//throw exception
			return false;
		}

		result = this.onend ();

		//if (Object.isArray (result)) result = result[0];

		return result;
	}
});

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

//-----------------------------------------------------------------------------
Core.singleton ("Model", /** @lends Model */ (
/**
 * @class Singleton class providing methods for operating on models and data.
 * @constructs
 */
function () {
	var _type = Core._("Helpers.Type");
	var _string = Core._("Helpers.String");
	var _models = {};

	//-------------------------------------------------------------------------
	/**
	 * Returns an instance for the given model class and caches the object
	 * based on the given source reference.  
	 */
	var getModel = function (model_class, source) {
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
	};

	//-------------------------------------------------------------------------
	/**
	 * Provides a convenient method of instantiating Modeled objects and
	 * caches the models themselves, alleviating the need to maintain instances
	 * of models.
	 * @name Model#getInstance
	 * @function
	 * @param {ModelAbstract (constructor)} model_class Description
	 * @param {Source} source Description
	 * @return Description
	 * @type Object
	 */
	var getInstance = function () {
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
	};

	//-------------------------------------------------------------------------
	/**
	 * Associates the given data with a model based on it's type.  Doing this
	 * allows any data not created by the system to be used within the system.
	 * If the data is already associated with a model (created by the system or
	 * previously "modelized") nothing is done and the object is returned
	 * as-is.
	 * @name Model#modelize
	 * @function
	 * @param {object} object Description
	 * @return Description
	 * @type Object
	 */
	var modelize = function (object, model_name, source) {
		if (_type.isUndefined (object.model)) {
			var model_class, model;

			model_name = _type.isString (model_name) ? model_name : _type.getType (object) + "Model";
			model_class = Core.getClass (model_name);
			model = this.getModel (model_class);

			object = model.getInstance (object);
		}

		return object;
	};

	return {
		_: getInstance,
		getModel: getModel,
		getInstance: getInstance,
		modelize: modelize
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("ArrayIterator", "IteratorAbstract", /** @lends ArrayIterator */ (function () {
	var _class_name = "Array";

	/**
	 * @class Generic iterator for operating on common JavaScript Arrays.
	 * @extends IteratorAbstract
	 * @constructs
	 */
	var oninit = function () {
		var _index = 0;
		var class_name = "array";

		this.className (_class_name);

		this.onfirst = function () {
			_index = 0;
			return this.data()[_index];
		};

		this.onnext = function () {
			_index++;
			return this.data()[_index];
		};

		this.onref = function () {
			return _index;
		};

		this.onindex = function (index) {
			_index = index;
			return this.data()[_index];
		};

		this.onend = function () {
			if (_index >= this.data().length)
				return true;
			else
				return false;
		};
	};

	return {
		oninit: oninit
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("ArrayModel", "ModelAbstract", /** @lends ArrayModel */ {
	/**
	 * @class Simple model for handling basic Arrays
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Array");
		this.defaultIterator (Core.getClass ("ArrayIterator"));
	},

	oncreate: function () {
		var _type = Core._("Helpers.Type");
		var args = $A(arguments);
		//var arr = new Array ();
		var arr = _type.isArray (args[0]) ? args.shift() : new Array ();

		args.each (function (value) {
			if (_type.isDefined (value))
				arr.push (value);
		});

		return arr;
	},

	filterReference: function (ref) {
		if (typeof (ref) != "number") {
			ref = this.length; //typeof (this.length) != "undefined" ? this.length : 0;
		}

		if (ref < 0) ref += this.length;

		return ref;
	},

	getFirstRef: function () {
		return 0;
	},

	getLastRef: function () {
		return this.length - 1;
	},

	onset: function (ref, value) {
		(this)[ref] = value;
	},

	onget: function (ref) {
		return (this)[ref];
	},

	onunset: function (ref) {
		var value = (this)[ref];
		if (typeof (value) != "undefined") this.splice (ref, 1);
		return value;
	},

	oninsert: function (ref, value) {
		if (ref < 0)
			ref = 0;
		else if (ref >= this.length)
			ref = this.length;

		this.splice (ref, 0, value);
	},

	oncompare: function (ref, value) {
		var element = this.get (ref);

		switch (typeof (value)) {
		case "string":
			value = parseInt (value);
			break;
		case "boolean":
			value = value ? 1 : 0;
			break;
		case "function":
			value = value ();
			break;
		default:
			value = 0;
		}

		if (value > element) return 1;
		if (value < element) return -1;

		return 0;
	}
});

//-----------------------------------------------------------------------------
Core.extend ("ObjectIterator", "IteratorAbstract", /** @lends HashIterator */ (function () {
	var _class_name = "Object";

	/**
	 * @class Generic iterator for operating on common associative arrays/objects.
	 * @extends IteratorAbstract
	 * @constructs
	 */
	var oninit = function () {
		var _index = 0;
		var _keys = new Array (); // = $H(this.data ()).keys ();
		var _is_value = function (value) {
			if (typeof (value) != "function" && !(value instanceof Core.getClass ("ModelAbstract"))) {
				return true;
			}
			return false;
		};

		$H(this.data ()).each (function (pair) {
			if (_is_value (pair.value)) _keys.push (pair.key);
		});

		this.className (_class_name);

		this.onfirst = function () {
			_index = 0;
			return this.data()[_keys[_index]];
		};

		this.onnext = function () {
			_index++;
			return this.data()[_keys[_index]];
		};

		this.onref = function () {
			return _keys[_index];
		};

		this.onindex = function (index) {
			_index = index;
			return this.data()[_keys[_index]];
		};

		this.onend = function () {
			if (_index >= _keys.length) {
				return true;
			}
			else {
				return false;
			}
		};
	};

	return {
		oninit: oninit
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("ObjectModel", "ModelAbstract", /** @lends HashModel */ {
	/**
	 * @class Simple model for handling basic associative arrays/objects
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Object");
		this.defaultIterator (Core.getClass ("ObjectIterator"));
	},

	oncreate: function () {
		return typeof (arguments[0]) == "object" ? arguments[0] : {};
	},

	filterReference: function (ref) {
		ref = typeof (ref) == "string" ? ref : ref.toString();

		return ref;
	},

	getFirstRef: function () {
		return $H(this).keys()[0];
	},

	getLastRef: function () {
		var keys = $H(this).keys();
		return keys[keys.length - 1];
	},

	onset: function (ref, value) {
		(this)[ref] = value;
	},

	onget: function (ref) {
		return (this)[ref];
	},

	onunset: function (ref) {
		var value = (this)[ref];
		if (typeof (value) != "undefined") delete (this)[ref];
		return value;
	},

	oninsert: function (ref, value) {
	},

	oncompare: function (ref, value) {
		var element = this.get (ref);

		switch (typeof (value)) {
		case "string":
			value = parseInt (value);
			break;
		case "boolean":
			value = value ? 1 : 0;
			break;
		case "function":
			value = value ();
			break;
		default:
			value = 0;
		}

		if (value > element) return 1;
		if (value < element) return -1;

		return 0;
	}
});

//-----------------------------------------------------------------------------
Core.extend ("DomIterator", "IteratorAbstract", /** @lends DomIterator */ (function () {
	var _class_name = "Array";

	/**
	 * @class Generic iterator for operating on child nodes of DOM Elements.
	 * @extends IteratorAbstract
	 * @constructs
	 */
	var oninit = function () {
		var _index = 0;
		var _data = this.data().childNodes;
		var class_name = "Element";

		this.className (_class_name);

		this.onfirst = function () {
			_index = 0;
			return _data[_index];
		};

		this.onnext = function () {
			_index++;
			return _data[_index];
		};

		this.onref = function () {
			return _index;
		};

		this.onindex = function (index) {
			_index = index;
			return _data[_index];
		};

		this.onend = function () {
			if (_index >= _data.length)
				return true;
			else
				return false;
		};
	};

	return {
		oninit: oninit
	};
}) ());

//-----------------------------------------------------------------------------
Core.extend ("DomModel", "ModelAbstract", /** @lends DomModel */ {
	/**
	 * @class Simple model for handling basic DOM Elements
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Element");
		this.defaultIterator (Core.getClass ("DomIterator"));
	},

	oncreate: function () {
		var _type = Core._("Helpers.Type");
		var args = $A(arguments);
		var object;

		switch (_type.getType (args[0])) {
		case "Element":
			object = args[0];
			break;
		case "String":
			if (args[0] != "text") {
				object = document.createElement (args[0]);
			}
			else {
				object = document.createTextNode (args[1]);
			}
			break;
		default:
			object = document.createElement ("div");
		}

		return $(object);
	},

	/*filterReference: function (ref) {
		if (typeof (ref) != "number")
			ref = 0;

		return ref;
	},*/

	getFirstRef: function () {
		return 0;
	},

	getLastRef: function () {
		return this.childNodes.length - 1;
	},

	onset: function (ref, value) {
		//this.replaceChild (value, this.childNodes[ref]);
		$(this).writeAttribute (ref, value);
	},

	onget: function (ref) {
		//return this.childNodes[ref];
		return (this)[ref];
	},

	onunset: function (ref) {
		var value = this.childNodes[ref];
		if (typeof (value) != "undefined") this.childNodes.splice (ref, 1);
		return value;
	},

	oninsert: function (ref, value) {
		var nodes = this.childNodes;

		if (ref < 0) ref = 0;

		if (ref >= nodes.length) {
			this.appendChild (value);
		}
		else {
			if (nodes[ref + 1]) {
				this.insertBefore (value, nodes[ref + 1]);
			}
			else {
				this.appendChild (value);
			}
		}
	},

	oncompare: function (ref, value) {
		var element = this.get (ref);

		if (element == value) 
			return 0;
		else
			return -1;
	}
});

//-----------------------------------------------------------------------------
Core.extend ("ImageModel", "ModelAbstract", /** @lends ImageModel */ {
	/**
	 * @class Simple model for seemlessly integrating DOM Images
	 * @extends ModelAbstract
	 * @constructs
	 */
	oninit: function () {
		this.className ("Image");
		this.defaultIterator (null);
	},

	oncreate: function () {
		return new Image ();
	}
});

