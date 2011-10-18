//-----------------------------------------------------------------------------
/**
 * @fileoverview Description, required classes, examples
 * 	<br /><br />
 * 
 * Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 */

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("QueryString", new (Class.create ({
	initialize: function () {
		var qstr = window.location.search.substring (1);
		var entries = qstr.split ("&");
		var entry, key;
		var pairs = {};

		for (var i = 0; i < entries.length; i++) {
			entry = entries[i].split ("=");
			key = entry[0];

			if (Object.isUndefined (pairs[key]))
				pairs[key] = entry[1];
			else if (Object.isArray (pairs[key]))
				pairs[key].push (entry[1]);
			else
				pairs[key] = new Array (pairs[key], entry[1]);
		}

		this.getAll = function (key) {
			return Object.clone (pairs);
		};

		this._ = function (key) {
			return pairs[key];
		};
	}
})) ());

