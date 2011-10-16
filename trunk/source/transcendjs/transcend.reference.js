//-----------------------------------------------------------------------------
/**
 * @fileoverview Reference instances hold references to other objects or object
 * 	members.  These are useful when returning objects when the object has not 
 * 	yet been loaded or for passing arguments to functions when the value of
 * 	the argument won't be known until the time of the call.  For instance, a
 * 	Controller action may be requested but not called until some time later.
 * 	Passing a reference to a value rather than the value itself will provide
 * 	the call with the latest value.  These are especially useful for batch
 * 	operations to Controllers, allowing a Controller to be pre-programmed but
 * 	always have up-to-date arguments.  Note: Controllers recognize these and
 * 	act accordingly when they are passed.<br /><br />
 * 
 * 	When referencing the member of an object and that member is a function,
 * 	any extra arguments passed to the constructor will be passed to that
 * 	function and it's return value is passed as the value.  If the member
 * 	function is one that supports References, these arguments may too be
 * 	Reference instances, allowing values to be referenced recursively.<br /><br />
 * 
 * 	<pre>
 * 	ref = new Reference (object);
 * 	value = ref.getValue ();		//returns object
 * 
 * 	ref = new Reference (object, member);
 * 	value = ref.getValue ();		//returns object[member]
 * 
 * 	ref = new Reference (object, method, arg1, arg2);
 * 	value = ref.getValue ();		//returns object.method (arg1, arg2)
 * 	</pre><br />
 * 
 * 	The variable <i>ref</i> declares where or how we get a value.  This may be 
 * 	passed to another function later where the getValue() method may be called 
 * 	and the value can be captured.  The first example shows a reference to an
 * 	object and is mainly for situations where a loader function must
 * 	return an object even though the "real" object is not yet loaded.<br /><br />
 * 
 * 	References passed to other References as arguments can be immediately 
 * 	recursed (early binding) or passed as-is to the object method (late 
 * 	binding).  The latter case may be preferable if the object method supports
 * 	referencing or if we simply want to pass around a Reference instance.  By
 * 	default, References bind early, however, this may be changed by setting the
 * 	bind_early property to false.  This can also be done in a chain call by
 * 	using the bindLate() method, as follows:<br /><br />
 * 
 * 	<pre>
 * 	ref = (new Reference (object, method, arg1, arg2)).bindLate ();
 * 	value = ref.getValue ();		//If passed as an argument to another
 *                                  //reference, pass instance as-is
 * 	</pre><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

//-----------------------------------------------------------------------------
Core.register ("Reference", /** @lends Reference */ (function () {
	var _type = Core._("Helpers.Type");
	var initialize, get_value, bind_late;

	/**
	 * @class Instantiates an instance that references another object or object
	 * 	member.
	 * @constructs
	 * @param {object} object Object being referenced.  May be another 
	 * 	Reference.
	 * @param {string} member Optional. Key of the member being referenced.
	 * 	If none passed, only the object is referenced.  If a function, the
	 * 	function is called and any additional arguments are passed to it. May
	 * 	be another Reference.
	 * @param {...} mixed Optional.  If the member is a function, these
	 * 	arguments will be passed to it. If the function supports References, 
	 * 	these arguments may too be References.
	 */
	initialize = function () {
		var _class = Core.getClass ("Reference");
		var args = $A(arguments);

		/**
		 * When using a Reference as an argument to another Reference, this
		 * property instructs whether to bind early, the default, or late.
		 * The default behavior is for the Reference to be immediately 
		 * recursed and it's value passed to the object method being referenced.
		 * In some cases, the object method may support referencing and we'll
		 * want the latest value.  Setting this to false delegates the 
		 * responsibility to the object method.  To set this to false in a 
		 * chain call for convenience, see bindLate() method.
		 * @name Reference#bind_early
		 * @type boolean
		 */
		this.bind_early = true;

		/**
		 * Private.  Contains the object to be referenced, the first argument 
		 * to the constructor.  May be any object or array.
		 * @name Reference#object
		 * @type mixed
		 */
		this._object = args.shift ();

		/**
		 * Private.  Contains the key of the object member to be referenced,
		 * the second argument to the constructor.  Usually a string but may
		 * also be a number if referencing an array.  Array properties, such as
		 * length, may also be referenced.
		 * @name Reference#member
		 * @type String|Number
		 */
		this._member = args.shift ();

		/**
		 * Private.  Any additional arguments to the constructor are stored in
		 * this array.  If the member being referenced is a function, these
		 * arguments are passed to it and the return value is used.
		 * @name Reference#arguments
		 * @type Array
		 */
		this._arguments = args;
	};

	//-------------------------------------------------------------------------
	/**
	 * Dynamically references an object or value and returns it.  Referencing
	 * is based on the object, member and arguments passed to the constructor.
	 * Any of of these arguments may too be References.
	 * @name Reference#getValue
	 * @function
	 * @return Description
	 * @type mixed
	 */
	get_value = function () {
		var _class = Core.getClass ("Reference");
		var object = this._object, member = this._member, value;

		//Object is required.  Return undefined if none provided.
		if (_type.isUndefined (object)) return;

		//Recurse if object is a Reference
		if (object instanceof _class) object = object.getValue ();

		//If no member is specified, simply return object
		if (_type.isUndefined (member)) return object;

		//Recurse if member is a Reference
		if (member instanceof _class) member = member.getValue ();

		value = object[member];		//Get the value

		//If value of member is a function call and pass any arguments
		if (_type.isFunction (value)) {
			var i, arg_val, args_array = new Array ();

			//Copy arguments array so values are unchanged and may be 
			//reused. If value is an early binded Reference, recurse it.
			for (i = 0; i < this._arguments.length; i++) {
				arg_val = this._arguments[i];

				if (arg_val instanceof _class && arg_val.bind_early) {
					args_array.push (arg_val.getValue ());
				}
				else {
					args_array.push (arg_val);
				}
			}

			//Call object method
			value = value.apply (object, args_array);
		}

		return value;		//return undefined if no value is found
	};

	//-------------------------------------------------------------------------
	/**
	 * Convenience function for setting bind_early property to false.  For use 
	 * in chain calls.
	 * @name Reference#bindLate
	 * @function
	 * @return Returns <i>this</> for use in chain calls.
	 * @type Reference
	 */
	bind_late = function () {
		this.bind_early = false;

		return this;
	};

	return {
		initialize: initialize,
		getValue: get_value,
		bindLate: bind_late
	};
}) (), {
	//-------------------------------------------------------------------------
	/**
	 * Static regression test method, called as Reference.test() or
	 * Core.getClass ("Reference").test ();
	 * @name Reference#test
	 * @function
	 * @return Returns true if passed and false on error
	 * @type boolean
	 */
	test: function () {
		var _output = "test: ", test_val;
		var _class = Core.getClass ("Reference");

		//Object with foo method tests late binding and argument passing
		var test_obj = { test: "Jason Flaherty", foo: function (arg1, arg2) {
			if (arg1 instanceof _class) arg1 = arg1.getValue ();
			_output += arg1.toString () + " ";
			return arg2;
		}};

		//Simple object method for passing arguments
		var test_obj2 = { method: function (arg1) {
			return arg1;
		}};

		//Some basic object with literal members for testing basic object referencing
		var test_obj3 = { key: 69 };

		//Object for testing dynamic member argument.  Member may be dynamic.
		var test_obj4 = { key: "foo" };

		//Object for testing dynamic object argument.  Object may be dynamic.
		var test_obj5 = { method: function (arg1) {
			if (arg1 === true)
				return test_obj;
			else
				return null;
		}};

		//Now for a regression test mindf&@k. Object, member and first argument
		//are all Reference instances.
		var ref = Core._ ("Reference", 
			Core._ ("Reference",
				test_obj5,
				"method",
				true
			), 
			Core._ ("Reference",
				test_obj4,
				"key"
			), 
			Core._ ("Reference",
				test_obj2, 
				"method", 
				Core._ ("Reference",
					test_obj3, 
					"key"
				)
			).bindLate (), 
			"bar"
		);

		test_val = ref.getValue ();
		_output += test_val.toString ();

		if (_output != "test: 69 bar") {
			return false;
		}

		return true;
	}
});

