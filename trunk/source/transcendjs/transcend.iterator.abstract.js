//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples<br/><br/>
 * 
 * Copyright &copy; 2011 
 * <a href="http://www.jasonkflaherty.com" target="_blank">Jason K. Flaherty</a>
 * (<a href="mailto:coderx75@hotmail.com">E-mail</a>)<br />
 * @author Jason K. Flaherty
 */

//-----------------------------------------------------------------------------
Core.register ("IteratorAbstract", (function () {
	var IteratorAbstract = /** @lends IteratorAbstract.prototype */ {
		/**
		 * @class Generic iterator providing iteration support for any abstract
		 * data type or data structure and allowing iteration of these types 
		 * to be interchangeable.<br/><br/>
		 * 
		 * <u>Events</u><br/>
		 * <i>oninit ()</i> - Called on instantiation<br/>
		 * <i>onfirst ()</i> - Handles retrieval of first element or node<br/>
		 * <i>onnext ()</i> - Iterates and returns elements or nodes<br/>
		 * <i>onend ()</i> - Handles check for end of iteration, returning true 
		 * 	if end.<br/>
		 * <i>onindex (index)</i> - Handles indexing of element or node, 
		 * 	adjusting position<br/>
		 * <br/>
	 	 * If you would like to continue with the tutorial, continue to {@link ModelAbstract}.<br/>
	 	 * <br/>
	 	 * See also {@link ArrayIterator}, {@link ObjectIterator}, {@link DomIterator}.
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

			//-----------------------------------------------------------------
			/**
			 * <i>See forEach()</i>
			 * @name IteratorAbstract#each
			 * @function
			 * @param {function} func Description
			 * @return A count of iterations completed
			 * @type Number
			 */
			this.each = this.forEach;

			//-----------------------------------------------------------------
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

		//---------------------------------------------------------------------
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

		//---------------------------------------------------------------------
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

		//---------------------------------------------------------------------
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

		//---------------------------------------------------------------------
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

		//---------------------------------------------------------------------
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

		//---------------------------------------------------------------------
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
	};

	return IteratorAbstract;
}) ());

