<html>
<head>
	<title>Tech Net Client - Example Usage</title>

	<style type="text/css">
		.myclass { color: red; text-align: center; }
	</style>

	<script type="text/javascript" src="source/prototype/prototype.js"></script>
	<script type="text/javascript" src="source/xmlrpc/xmlrpc_lib.js"></script>
	<script type="text/javascript" src="source/raphael/raphael-min.js"></script>
	<?php if (isset ($_REQUEST["action"]) && $_REQUEST["action"] == "test"): ?>
	<script type="text/javascript" src="source/technet/technet-min.js"></script>
	<?php else: ?>
	<script type="text/javascript" src="source/technet/technet_core.js"></script>
	<script type="text/javascript" src="source/technet/technet_config.js"></script>
	<script type="text/javascript" src="source/technet/technet_helpers.js"></script>
	<script type="text/javascript" src="source/technet/technet_helper_md5.js"></script>
	<script type="text/javascript" src="source/technet/technet_container.js"></script>
	<script type="text/javascript" src="source/technet/technet_reference.js"></script>
	<script type="text/javascript" src="source/technet/technet_events.js"></script>
	<script type="text/javascript" src="source/technet/technet_interpreter.js"></script>
	<script type="text/javascript" src="source/technet/technet_interpreter2.js"></script>
	<script type="text/javascript" src="source/technet/technet_template.js"></script>
	<script type="text/javascript" src="source/technet/technet_template2.js"></script>
	<script type="text/javascript" src="source/technet/technet_controller.js"></script>
	<script type="text/javascript" src="source/technet/technet_model.js"></script>
	<script type="text/javascript" src="source/technet/technet_view.js"></script>
	<script type="text/javascript" src="source/technet/technet_process.js"></script>
	<script type="text/javascript" src="source/technet/technet_client.js"></script>
	<script type="text/javascript" src="source/technet/technet_source.js"></script>
	<script type="text/javascript" src="source/technet/technet_source_xmlrpc.js"></script>
	<?php endif; ?>
	<script type="text/javascript" src="../technet_server/settings.php?action=client_config"></script>
	<script type="text/javascript">
		// <![CDATA[
		window.onload = function () {
			Core.extend ("TestSource", "SourceController", (function () {
				var oninit, onload;
				var _data;

				oninit = function () {
					//_data = new Array (7, 8, 7, 0, 4);
					//_data._MODEL = "Array";
					_data = {
						_MODEL: "Object", 
						first: 7, second: 8, third: 7, fourth: 0, fifth: 4 
					};
				};

				onload = function (obj, callback) {
					callback (_data, true);
				};

				return {
					oninit: oninit,
					onload: onload
				};
			}) ());

			Core.extend ("MySource", "SourceController", (function () {
				var oninit, onload;

				oninit = function () {
					this._data = { 
						_MODEL: "Object", 
						title: "TranscendJS", 
						records: [
							{ id: "2", value: "100", row_attribs: { name: "target1" } },
							{ id: "4", value: "200", row_attribs: { name: "target2" } },
							{ id: "6", value: "300", row_attribs: { name: "target3" } },
							{ id: "8", value: "400", row_attribs: { name: "target4" } },
							{ id: "10", value: "500", row_attribs: { name: "target5" } },
							{ id: "11", value: "600", row_attribs: { name: "target6" } },
							{ id: "12", value: "700", row_attribs: { name: "target7" } },
							{ id: "13", value: "800", row_attribs: { name: "target8" } },
							{ id: "14", value: "900", row_attribs: { name: "target9" } },
							{ id: "15", value: "1000", row_attribs: { name: "target10" } },
							{ id: "16", value: "1100", row_attribs: { name: "target11" } },
							{ id: "17", value: "1200", row_attribs: { name: "target12" } },
							{ id: "18", value: "1300", row_attribs: { name: "target13" } },
							{ id: "19", value: "1400", row_attribs: { name: "target14" } },
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
				};

				onload = function (obj, callback) {
					setTimeout (function () {
						callback (this._data, true);
						//callback ("Failed to load from MySource: " + obj.src, false);
					}.bind (this), 1000);
				};

				return {
					oninit: oninit,
					onload: onload
				};
			}) ());

			Core.extend ("MyView", "TemplateView", (function () {
				var oninit = function () {
					this.engine().code (new Array (
						{ action: "div", _nodes: [
							{ action: "apply-style", id: "style" }, 
							{ action: "h2", id: "title", "class": "myclass" },
							{ action: "div", align: "center", id: "output", _nodes: [
								{ action: "text", content: "MyView Template" },
								{ action: "br" }
							]},
							{ action: "table", _nodes: [
								{ action: "tbody", _nodes: [
									{ action: "tr", id: "records", _nodes: [
										{ action: "apply-style", id: "attribs" },
										{ action: "td", id: "id", "width": "128px", _nodes: [
											{ action: "apply-attributes", id: "row_attribs" }
										]},
										{ action: "td", id: "value", "width": "128px" }
									]}
								]}
							]}
						]},
						{ action: "br" }
					));
				};

				return {
					oninit: oninit
				};
			}) ());

			Core.extend ("MyController", "Controller", (function () {
				var _type = Core._("Helpers.Type");
				var oninit, onstartup, render_action, mouseover_action, click_action;

				oninit = function () {
					//Register all controller actions
					this.register ("render", render_action);
					this.register ("mouseover", mouseover_action);
					this.register ("click", click_action);
				};

				onstartup = function () {
					var scope = this.get ("_models")["mymodel"];
					var events = this.get ("_events");

					if (_type.isDefined (scope)) {
						//Load data and begin processing actions once completed
						scope.onload = function () {
							assert (this.immediateMode (true) == true);
						}.bind (this);

						scope.onerror = function (response) {
							alert (response);
						};

						scope.setAttribute ("src", "http://www.whatever.com/index.php");

						//Setup events and handlers
						events["mouseover"] = new Eventcast ("mouseover", "1px solid black");
						events["mouseover"].listen (this.$mouseover);

						events["mouseout"] = new Eventcast ("mouseout", "0");
						events["mouseout"].listen (this.$mouseover);

						events["click"] = new Eventcast ("click");
						events["click"].listen (this.$click);
					}
				};

				render_action = function (event, parent) {
					//Pass model data to view and render
					var scope = this.get ("_models")["mymodel"];
					var events = this.get ("_events");
					var view = this.view().assign (scope);
					var elements = view.render (parent);

					//Add generated view elements to Eventcasts
					events["mouseover"].add (elements["title"], elements["id"], elements["value"][7]);
					events["mouseout"].add (elements["title"], elements["id"], elements["value"][7]);
					events["click"].add (elements["id"]);
				};

				mouseover_action = function (event) {
					Event.getTarget(event).style.border = event.memo;
				};

				click_action = function (event) {
					var view = this.view();

					if (_type.isDefined (view)) 
						view._("output").innerHTML = 
						$(Event.getTarget(event)).readAttribute ("name") + " clicked";
				};

				return {
					oninit: oninit,
					onstartup: onstartup
				};
			}) ());

			Core.globalize ();

			var source = new MySource ();
			var model = Model.getInstance (ObjectModel, source);
			var view = new MyView ();
			var ctrl = new MyController ();
			var parent = $("test1");

			ctrl.view (view);
			ctrl.get ("_models")["mymodel"] = model;
			ctrl.run ();

			ctrl.action ("render", parent);

			var source2 = new MySource ();
			var model2 = Model.getInstance (ObjectModel, source2);
			var view2 = new MyView ();
			var ctrl2 = new MyController ();
			var parent2 = $("testinstance");

			ctrl2.view (view2);
			ctrl2.get ("_models")["mymodel"] = model2;
			ctrl2.run ();

			ctrl2.action ("render", parent2);

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
			//var foo = Model.getInstance (ArrayModel, source);
			var foo = Core._("Model.ArrayModel", source);
			var i;

			//foo.onload = function () { alert ("Hello World!"); };
			//foo.onerror = function () { alert ("Error!"); };
			foo.setAttribute ("src", "http://www.whatever.com/index.php");
			i = new (foo.model.defaultIterator()) (foo.copy());

			//Now, some data-agnostic code
			i.each (function (ref, value) {
				value = value || 0;
				ref = ref || 0;

				$("test3").appendChild (document.createTextNode (".(" + typeof (ref) + ") " + ref.toString() + " - " + value.toString ()));
				$("test3").appendChild (document.createElement ("br"));
			});

			//Now, a demonstration of DOM compatibility
			//var img = Model.getInstance (ImageModel);
			var img = Core._("Model.ImageModel");

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

			console.log ("Container test result: ", Container.test ());

			var rpc_model = new XmlRpcValueModel ();
			var native_model = new ObjectModel ();
			var rpc_val = rpc_model.getInstance ({
				foo: 5,
				bar: [ 2, 4, 6, 8, "ten", 12 ],
				baz: "jay",
				obj: {
					abc: "def",
					xyz: 69
				}
			});
			var native_val = native_model.getInstance ();
			var rpc_iterator = new XmlRpcValueIterator (rpc_val);

			native_val.convert (rpc_iterator);

			console.log (native_val);

			if (Interpreter2.test () === false)
				alert ("Regression test for Interpreter class failed!");

			if (Reference.test () === false) 
				alert ("Regression test for Reference class failed!");
		};
		// ]]>
	</script>
</head>

<body bgcolor="#ffffff">
	<div id="test0"></div>
	<table cellspacing="0" cellpadding="0" border="0"><tr valign="top"><td width="280">
		<div id="test1"></div>
	</td><td>
		<div id="testinstance"></div>
	</td></tr></table>
	<a href="">link</a><br/><br/>
	<div id="test3"></div>
</body>
</html>
