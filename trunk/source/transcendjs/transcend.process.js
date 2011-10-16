
//-----------------------------------------------------------------------------
/**
 * @fileoverview 
 * 	<br /><br />
 * 
 * 	Date			2011-02-07<br />
 * 	Copyright	&copy; 2011 {@link http://www.jasonkflaherty.com Jason K. Flaherty}<br />
 * 	Bugs<br />
 * @author		{@link http://www.jasonkflaherty.com Jason K. Flaherty}
 * 				{@link mailto:coderx75@hotmail.com coderx75@hotmail.com}
 * @version		0.0.22
 */

//-----------------------------------------------------------------------------
Core.register ("Process", /** @lends Process */ {
	/**
	 * @class 
	 * @constructs
	 */
	initialize: function (name, _callback, _interval) {
		var statics = Core.getClass ("Process");
		var _time = (new Date ()).getTime ();
		var _exec = null;
		var _wrapper = function () {
			_time = (new Date ()).getTime ();
			_callback ();
		};

		//---------------------------------------------------------------------
		/**
		 * 
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

		//---------------------------------------------------------------------
		/**
		 * 
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

		//---------------------------------------------------------------------
		/**
		 * 
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

		//---------------------------------------------------------------------
		/**
		 * 
		 * @name Process#getProcess
		 * @function
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
},
{
	counter: 1, processes: {},

	//-------------------------------------------------------------------------
	/**
	 * 
	 * @name Process#getProcess
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

