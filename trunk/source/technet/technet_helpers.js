
/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Cookies", {
	set: function (name, value, exp_y, exp_m, exp_d, path, domain, secure) {
		var cookie_string = name + "=" + escape (value);

		if (exp_y) {
			var expires = new Date (exp_y, exp_m, exp_d);
			cookie_string += "; expires=" + expires.toGMTString ();
		}

		if (path) cookie_string += "; path=" + escape (path);
		if (domain) cookie_string += "; domain=" + escape (domain);
		if (secure) cookie_string += "; secure";

		document.cookie = cookie_string;
	},

	get: function (cookie_name) {
		var results = document.cookie.match ('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

		if (results)
			return (unescape (results[2]));
		else
			return null;
	},

	remove: function (cookie_name) {
		var cookie_date = new Date ();  // current date & time
		cookie_date.setTime (cookie_date.getTime () - 1);
		document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString ();
	}
});

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

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("CSS", new (Class.create ({
	initialize: function () {
		this.getStyle = function (selector, file_index) {
			var result = false;

			if (typeof (file_index) != "undefined") {
				var rules;

				if (document.styleSheets[file_index].cssRules)
					rules = document.styleSheets[file_index].cssRules;
				else if (document.styleSheets[file_index].rules)
					rules = document.styleSheets[file_index].rules;
				else
					rules = new Array();

	 			for (n in rules) {
	 				if (rules[n].selectorText == selector) {
						if (!rules[n].style) rules[n].style = {};

						result = rules[n].style;
					}
				}
			}
			else {
				file_index = 0;

				while (document.styleSheets[file_index] && result === false) {
					result = this.getStyle (selector, file_index++);
				}
			}

 			return result;
		};

		this._ = this.getStyle;
	}
})) ());

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Unique", new (Class.create ({
	initialize: function () {
		var uid = Math.floor (Math.random () * 256);

		this.simple = function () {
			return ++uid;
		};

		this.hex = function () {
			return "h" + Core._("Helpers.View").formatHex (this.simple (), 8);
		};

		this.global = function () {
			if (__SYSTEM_USERADDRESS__) {
				var format_hex = Core._("Helpers.View").formatHex;
				var d = new Date ();
				var ipaddress = __SYSTEM_USERADDRESS__.split (".");
				var output = [
					format_hex (parseInt (ipaddress[0]), 2),
					format_hex (parseInt (ipaddress[1]), 2),
					format_hex (parseInt (ipaddress[2]), 2),
					format_hex (parseInt (ipaddress[3]), 2),
					format_hex (d.getFullYear (), 3),
					format_hex (d.getMonth (), 1),
					format_hex (d.getDate (), 2),
					format_hex (d.getHours (), 2),
					format_hex (d.getMinutes (), 2),
					format_hex (d.getSeconds (), 2),
					format_hex (d.getMilliseconds (), 3),
					format_hex (Math.floor (Math.random () * 65536), 4),
					format_hex (this.simple(), 4)
				];

				return output.join ("");
			}
			else {
				return false;
			}
		}.bind (this);

		this._ = this.global;
	}
})) ());

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("Type", new (Class.create ({
	initialize: function () {
		var _toString = Object.prototype.toString;

		this.getType = function (value) {
			if (typeof (value.model) == "undefined") {
				var type = typeof (value);

				if (type == "object") {
					if (this.isString (value)) return "String";
					if (this.isArray (value)) return "Array";
					if (this.isElement (value)) return "Element";
				}

				return Core._("Helpers.String").capitalize (type);
			}
			else if (typeof (value.classRef) == "function") {
				return value.classRef().className();
			}
			else {
				return value.model.className();
			}
		}.bind (this);

		this.isObject = function (object) {
			return _toString.call(object) == "[object Object]";
		};

		this.isElement = function (object) {
			return !!(object && object.nodeType == 1);
		};

		this.isArray = function (object) {
			return _toString.call(object) == "[object Array]";
		};

		this.isFunction = function (object) {
			return typeof object == "function";
		};

		this.isString = function (object) {
			return _toString.call(object) == "[object String]";
		};

		this.isNumber = function (object) {
			return _toString.call(object) == "[object Number]";
		};

		this.isBoolean = function (object) {
			return typeof object == "boolean";
		};

		this.isUndefined = function (object) {
			return typeof object == "undefined";
		};

		this.isDefined = function (object) {
			return typeof object != "undefined";
		};

		this.toArray = function (object) {
			if (!object) return [];
			if ('toArray' in Object(object)) return object.toArray();
			var length = object.length || 0, results = new Array(length);
			while (length--) results[length] = object[length];
			return results;
		};

		this.toString = function (object) {
			if (this.isString (object)) return object;
			if (!this.isUndefined (object.toString)) return object.toString ();
			return String (object);
		};

		this._ = this.getType;
	}
})) ());

/*---------------------------------------------------------------------------*/
Core._("Helpers").register ("String", new (Class.create ({
	initialize: function () {
		this.capitalize = function (str) {
			return str.replace (/(^|\s)([a-z])/g, function (m, p1, p2) {
				return p1 + p2.toUpperCase ();
			});
		};

		this.isEmail = function (str) {
		    var pattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;

    		if (pattern.test (str)) return true;

    		return false; 
		};

		this.trim = function (str) {
			if (str.trim)
				return str.trim();
			else
				return str.replace(/(^\s*)|(\s*$)/g, "");
		};
	}
})) ());

