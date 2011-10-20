
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
Core.register ("Process", (function () {
	var Process = /** @lends Process.prototype */ {
		/**
		 * @class Description
		 * @constructs
		 * @param {String} name Description
		 * @param {Function} _callback Description
		 * @param {Number} _interval Description
		 */
		initialize: function (name, _callback, _interval) {
			var statics = Core.getClass ("Process");
			var _time = (new Date ()).getTime ();
			var _exec = null;
			var _wrapper = function () {
				_time = (new Date ()).getTime ();
				_callback ();
			};

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Process#start
			 * @function
			 * @return 
			 * @type 
			 */
			this.start = function () {
				if (this.onstart) this.onstart ();
				_exec = new PeriodicalExecuter (_wrapper, _interval);

				return this;
			};

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Process#stop
			 * @function
			 * @return 
			 * @type 
			 */
			this.stop = function () {
				_exec.stop ();
				_exec = null;

				if (this.onstop) this.onstop ();

				return this;
			};

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Process#status
			 * @function
			 * @return 
			 * @type 
			 */
			this.status = function () {
				var time_check = (new Date ()).getTime ();

				if (_exec != null) {
					if (((time_check - _time) / 1000.0 - _interval) < 10)
						return "Running";
					else
						return "Not responding";
				}

				return "Not running";
			};

			//-----------------------------------------------------------------
			/**
			 * Description
			 * @name Process#getProcess
			 * @function
			 * @param {String} name Description
			 * @return 
			 * @type
			 */
			this.getProcess = function (name) {
				return statics.processes[name];
			};

			this._ = this.getProcess;

			_interval = _interval || 1.0;

			if (!name || name == "" || statics.processes[name])
				name = "process" + statics.counter++;

			statics.processes[name] = this;
		}
	};

	return Process;
}) (), 
/** @lends Process */ {
	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @static
	 * @memberOf Process
	 * @type Number
	 */
	counter: 1,

	//-------------------------------------------------------------------------
	/**
	 * Description
	 * @static
	 * @memberOf Process
	 * @type Object
	 */
	processes: {},

	//-------------------------------------------------------------------------
	/**
	 * Description, events, exceptions, example
	 * @static
	 * @memberOf Process
	 * @function
	 * @return 
	 * @type 
	 */
	getReport: function () {
		var statics = Core.getClass ("Process");
		var report = {};

		$H(statics.processes).each (function (pair) {
			report[pair.key] = pair.value.status ();
		});

		return report;
	}
});

