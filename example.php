<html>
<head>
	<title>Tech Net Client - Example Usage</title>

	<style type="text/css">
		.myclass { color: red; text-align: center; }
	</style>

	<script type="text/javascript" src="source/prototype/prototype.js"></script>
	<script type="text/javascript" src="source/raphael/raphael-min.js"></script>
	<?php if (isset ($_REQUEST["action"]) && $_REQUEST["action"] == "test"): ?>
	<script type="text/javascript" src="source/technet/technet-min.js"></script>
	<?php else: ?>
	<script type="text/javascript" src="source/technet/technet_core.js"></script>
	<script type="text/javascript" src="source/technet/technet_config.js"></script>
	<script type="text/javascript" src="source/technet/technet_helpers.js"></script>
	<script type="text/javascript" src="source/technet/technet_helper_md5.js"></script>
	<script type="text/javascript" src="source/technet/technet_container.js"></script>
	<script type="text/javascript" src="source/technet/technet_events.js"></script>
	<script type="text/javascript" src="source/technet/technet_interpreter.js"></script>
	<script type="text/javascript" src="source/technet/technet_interpreter2.js"></script>
	<script type="text/javascript" src="source/technet/technet_template.js"></script>
	<script type="text/javascript" src="source/technet/technet_controller.js"></script>
	<script type="text/javascript" src="source/technet/technet_model.js"></script>
	<script type="text/javascript" src="source/technet/technet_view.js"></script>
	<script type="text/javascript" src="source/technet/technet_process.js"></script>
	<script type="text/javascript" src="source/technet/technet_client.js"></script>
	<?php endif; ?>
	<script type="text/javascript" src="../technet_server/settings.php?action=client_config"></script>
	<script type="text/javascript">
		// <![CDATA[
		window.onload = function () {
			Core.extend ("Template2", "Interpreter2", {
				oninit: function (context) {
					if (Object.isUndefined (context)) {
						context = Core._("DOMContext");
					}
				},

				apply: function (chunk, target) {
					var context = this.context ();
					var result = this.run (chunk);

					if (target && Object.isFunction (context.onapply)) 
						context.onapply.bind (this) (target, result);

					return result;
				}
			});

			/*
			Core.register ("ContextAbstract", (function () {
				var _type = Core._("Helpers.Type");
				var _commands = {};

				var register = function (name, func) {
					if (_type.isString (name)) {
						if (_type.isFunction (func)) {
							_commands[name] = func;
						}
						else
							throw new TypeError ("ContextAbstract.register(): " +
								"Parameter 1 must be a string");
					}
					else
						throw new TypeError ("ContextAbstract.register(): " +
							"Parameter 2 must be a function");

					return this;
				};

				var start = function (engine, code) {
					if (_type.isFunction (this.onstart))
					this.onstart.bind (engine) (code);
				};

				var scope = function (engine, parent, child) {
					if (_type.isFunction (this.onscope)) {
						this.onscope.bind (engine) (parent, child);
					}
				};

				var process = function (engine, command, name, id, subroutine) {
					var handler = _commands[this.command()];
					var result;

					if (_type.isFunction (handler)) {
						if (_type.isFunction (this.onprocess))
							this.onprocess.bind (engine) (command, name, id);

						result = handler.bind (engine) (command, name, id, subroutine);
					}
					else {
						if (_type.isFunction (this.ondefault))
							result = this.ondefault.bind (engine) (command, name, id, subroutine);
					}

					if (_type.isFunction (this.onresult))
						this.onresult.bind (engine) (command, result);
				};

				var complete = function (engine) {
					if (_type.isFunction (this.oncomplete))
						this.oncomplete.bind (engine) ();
				};

				var onscope = function (parent, child) {
					//Link child process to global scope which is either
					//the parent's link or the parent.
					child.link (parent.link () || parent);
				};

				return {
					command:		new Core._("Property", "action"),
					identifier:		new Core._("Property", "id"),
					nest:			new Core._("Property", "_nodes"),
					register:		register,
					start:			start,
					process:		process,
					complete:		complete,
					onscope:		onscope
				};
			}) ());

			//Container and Interpreter should be decoupled.
			Core.extend ("Interpreter2", "Container", (function () {
				var _type = Core._("Helpers.Type");
				var _context = null;

				var initialize = function (context) {
					_context = context;
				};

				var get_context = function () {
					return _context;
				};

				var execute = function (code) {
					var iterator = new code.defaultIterator() (code);
					var _context_reup = _context;

					_context.start (this, code);

					iterator.each (function (ref, command) {
						var name, id, nest, subroutine;

						command = Model.modelize (command).copy ();

						name = command.unset (this.command());
						id = command.unset (this.identifier());
						nest = command.unset (this.nest());

						if (!_type.isUndefined (nest)) {
							subroutine = Core._("Interpreter2") (_context_reup);
							_context_reup.scope (this, subroutine);
						}

						_context.process (this, command, name, id, subroutine);
					}.bind (this));

					return _context.complete (this);
				};

				return {
					initialize:		initialize,
					getContext:		get_context,
					execute:		execute,
					run:			execute		//For backwards compatibility
				};
			}) ());

			Core.extend ("DOMContext", "ContextAbstract", (function () {
				var _type = Core._("Helpers.Type");

				var _process_data = function (id) {
					var data = this.get (id);

					if (!_type.isUndefined (data)) {
						if (_type.isArray (data)) {}
						else if (_type.isFunction (data)) {
							data = [data ()];
						}
						else if (_type.isObject (data)) {
							Object.extend (args, data);
							$H(args).each (function (pair) {
								if (_type.isFunction (pair.value)) {
									args[pair.key] = pair.value ();
								}
							});
							data = [""];
						}
						else data = [data];
					}
					else data = [""];

					return data;
				};

				var initialize = function () {
					this.command ("action"),
					this.identifier ("id");
					this.nest ("_nodes");
				};

				var ondefault = function (command, name, id, subroutine) {
					var context = this.getContext ();
					var data;

					if (!_type.isUndefined (id)) data = this.get (id);



					var output = new Array ();
					var data;
					var count;

					args = $H(args);
					command = args.unset (cmd_key);
					childNodes = args.unset (nodes_key);
					data = context.processData (id, args, this.get ());
					count = (data.length || 1);

					for (var i = 0; i < count; i++) {
						var element = new Element (command, args.toObject ());
						var element_data = data[i];

						if (typeof (childNodes) == "object")
							context.appendNodes (element, childNodes, this.get (), element_data);

						context.writeData (element, element_data);
						output.push (element);

						if (id) this.setElement (id, element);
					}

					return output;
				};

				var onstart = function (code) {
				};

				var onresult = function (command, result) {
				};

				var oncomplete = function () {
				};

				var cmd_apply_attributes = function (command) {
				};

				var cmd_apply_style = function (command) {
				};

				var cmd_text = function (command) {
				};

				return {
					initialize:				initialize,
					ondefault:				ondefault,
					onstart:				onstart,
					onresult:				onresult,
					oncomplete:				oncomplete,
					cmd_apply_attributes: 	cmd_apply_attributes,
					cmd_apply_style: 		cmd_apply_style,
					cmd_text: 				cmd_text
				};
			}) ());
			*/

			Core.extend ("MyController", "Controller", {
				oninit: function () {
					var scope = { 
						title: "Tech Net Client", 
						records: [
							{ id: "2", value: "100", name: { name: "target1" } },
							{ id: "4", value: "200", name: { name: "target2" } },
							{ id: "6", value: "300", name: { name: "target3" } },
							{ id: "8", value: "400", name: { name: "target4" } },
							{ id: "10", value: "500", name: { name: "target5" } },
							{ id: "11", value: "600", name: { name: "target6" } },
							{ id: "12", value: "700", name: { name: "target7" } },
							{ id: "13", value: "800", name: { name: "target8" } },
							{ id: "14", value: "900", name: { name: "target9" } },
							{ id: "15", value: "1000", name: { name: "target10" } },
							{ id: "16", value: "1100", name: { name: "target11" } },
							{ id: "17", value: "1200", name: { name: "target12" } },
							{ id: "18", value: "1300", name: { name: "target13" } },
							{ id: "19", value: "1400", name: { name: "target14" } },
						],
						style: {
							"border": "1px solid #A0A0A0",
							"width": "260px"
						},
						attribs: {
							"backgroundColor": Helpers._("View").cycle ([
								"#E0E0E0", "#FFFFFF"
							])
						}
					};
					var code = new Array (
						{ action: "div", _nodes: [
							{ action: "apply-style", id: "style" }, 
							{ action: "h2", id: "title", "class": "myclass" },
							{ action: "div", align: "center", id: "output", _nodes: [
								{ action: "br" }
							]},
							{ action: "table", _nodes: [
								{ action: "tbody", _nodes: [
									{ action: "tr", id: "records", _nodes: [
										{ action: "apply-style", id: "attribs" },
										{ action: "td", id: "id", "width": "128px", _nodes: [
											{ action: "apply-attributes", id: "name" }
										]},
										{ action: "td", id: "value", "width": "128px" }
									]}
								]}
							]},
							{ action: "br" }
						]}
					);

					//Interpreter/Template test code
					var _view = (new TemplateView (code, $("test1"))).assign (scope);
					var _elements = _view.render ();
					var bcast_mouseover = new Broadcast ("mouseover", "1px solid black", 
						_view._("title"), _view._("id"), _view._("value")[7]);
					var bcast_mouseout = new Broadcast ("mouseout", "0", 
						_view._("title"), _view._("id"), _view._("value")[7]);
					var bcast_click = new Broadcast ("click", null, _view._("id"));

					this.register ("mouseover", function (event) {
						Event.getTarget(event).style.border = event.memo;
					});
					this.register ("click", function (event) {
						_view._("output").innerHTML = $(Event.getTarget(event)).readAttribute ("name") + " clicked";
					});
					this.register ("test", function (event, arg1, arg2) {
						alert (event.type + ", " + arg1 + ", " + arg2);
					});

					//Broadcast test code
					bcast_mouseover.listen (this.getListener ("mouseover"));
					bcast_mouseout.listen (this.getListener ("mouseover"));
					bcast_click.listen (this.getListener ("click"));

					this.onaction = function () { this.run (); };

					var view = Raphael ($("test3"), "100%", 200);
					var circle = (view.circle (160, 100, 99)).attr("fill", "white");
					//var box = view.rect (10, 10, 1000, 20);

					circle.node.onmouseover = function () {
						circle.attr("fill", "#B1BFCF");
					};

					circle.node.onmouseout = function () {
						circle.attr("fill", "white");
					};

					if (Interpreter2.test () === false) alert ("fail!");
				}
			});

			Core.register ("TestSource", {
				load: function (obj, callback) {
					//Usually, queried with "src" and, maybe, other attribs
					var response = {
						SRC_TYPE: "Object", first: 1, second: 1, third: 2, fourth: 3, fifth: 2 
					};

					callback (response, true);
				}
			});

			Core.globalize ();

			var ctrl = new MyController ();

			ctrl.run ();

			//var mdl_hash = new HashModel ();
			//var foo = mdl_hash.getInstance ({ 
			//	first: 1, second: 1, third: 2, fourth: 3, fifth: 2 
			//});
			//var i = new HashIterator (foo);
			//var i = new ArrayIterator (foo);

			//var mdl_arr = new ArrayModel ();
			//var foo = mdl_arr.getInstance (1, 1, 2, 3, 2);
			//var i = new ArrayIterator (foo);
			//var i = new HashIterator (foo);

			var source = new TestSource ();
			var foo = Model.getInstance (ArrayModel, source);
			var i;

			//foo.onload = function () { alert ("Hello World!"); };
			//foo.onerror = function () { alert ("Error!"); };
			foo.setAttribute ("src", "http://www.whatever.com/index.php");
			i = new ArrayIterator (foo.copy ());

			//Now, some data-agnostic code
			i.each (function (ref, value) {
				value = value || 0;
				ref = ref || 0;

				$("test3").appendChild (document.createTextNode (".(" + typeof (ref) + ") " + ref.toString() + " - " + value.toString ()));
				$("test3").appendChild (document.createElement ("br"));
			});

			//Now, a demonstration of DOM compatibility
			var img = Model.getInstance (ImageModel);

			img.setAttribute ("src", "http://www.jasonkflaherty.com/images/i_can_count.png");

			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (img);
			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (document.createElement ("br"));

			//Testing configuration system
			Core._("Config").register ("Foo");
			Core._("Config").register ("Bar");

			Core._("Config.Foo").register ("Name", "Jason Flaherty");
			Core._("Config.Foo").register ("Position", "Software Engineer");

			Core._("Config.Foo").register ("Baz");
			Core._("Config.Foo.Baz").register ("Name", "Don King");

			Core._("Config.Bar").register ("Something", "Whatever");
			Core._("Config.Bar").register ("Else", 69);

			Core._("Config.Bar.Else", 11);

			$("test3").appendChild (document.createTextNode ("Foo.Name: " + Core._("Config.Foo.Name") ()));
			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (document.createTextNode ("Foo.Position: " + Core._("Config.Foo.Position") ()));
			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (document.createTextNode ("Foo.Baz.Name: " + Core._("Config.Foo.Baz.Name") ()));
			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (document.createTextNode ("Bar.Something: " + Core._("Config.Bar.Something") ()));
			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (document.createTextNode ("Bar.Else: " + Core._("Config.Bar.Else") ()));
			$("test3").appendChild (document.createElement ("br"));
			$("test3").appendChild (document.createElement ("br"));
		};
		// ]]>
	</script>
</head>

<body bgcolor="#ffffff">
	<div id="test1"></div>
	<a href="">link</a><br/><br/>
	<div id="test3"></div>
</body>
</html>
