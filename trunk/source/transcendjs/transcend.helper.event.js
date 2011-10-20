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
Core._("Helpers").register ("Event", (function () {
	var _type = Core._("Helpers.Type");
	var EventHelpers;

	/**
	 * @namespace Description
	 */
	EventHelpers = {
		//---------------------------------------------------------------------
		/**
		 * IE workaround to read event type set by Tech Net
		 * @memberOf EventHelpers
		 * @function
		 * @param {Event} evt Any valid Event object
		 * @return Name of the event type
		 * @type string
		 */
		getType: function (evt) {
			if (evt) {
				if (evt.tn_type)
					return evt.tn_type;
				else if (evt.type)
					return evt.type;
			}

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * IE workaround to read event target object set by Tech Net.
		 * Any object event (hook-in) may be Eventcast.
		 * @memberOf EventHelpers
		 * @function
		 * @param {Event} evt Any valid Event object
		 * @return Target object (not restricted to DOM elements)
		 * @type object
		 */
		getTarget: function (evt) {
			if (evt) {
				if (evt.tn_target)
					return evt.tn_target;
				else if (evt.target)
					return evt.target;
				else if (evt.srcElement)
					return evt.srcElement;
			}

			return false;
		},

		//---------------------------------------------------------------------
		/**
		 * IE (instanceof) workaround to test that an object is an Event
		 * @memberOf EventHelpers
		 * @function
		 * @param {Event} evt Any valid Event object
		 * @return <i>True</i> if object is an instance of Event
		 * @type boolean
		 */
		isEvent: function (evt) {
			if (evt == null) return false;
			if (typeof (evt) != "object") return false; 
			if (Object.isUndefined (evt.clientX) &&
				Object.isUndefined (evt.defaultPrevented)) return false;

			return true;
		}
	};

	//EventHelpers._ = EventHelpers.method;

	return EventHelpers;
}) ());

