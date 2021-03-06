<html>
<head>
	<title>TranscendJS - Example Usage</title>

	<style type="text/css">
		.myclass { color: red; text-align: center; }
	</style>

	<script type="text/javascript" src="source/prototype/prototype.js"></script>
	<script type="text/javascript" src="source/xmlrpc/xmlrpc_lib.js"></script>
	<script type="text/javascript" src="source/raphael/raphael-min.js"></script>
	<?php if (isset ($_REQUEST["action"]) && $_REQUEST["action"] == "test"): ?>
	<script type="text/javascript" src="source/transcendjs/transcend.min.js"></script>
	<?php else: ?>
	<script type="text/javascript" src="source/transcendjs/transcend.core.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.exception.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.property.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.config.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.cookies.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.querystring.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.css.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.unique.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.type.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.string.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.array.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.event.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.helper.md5.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.container.abstract.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.container.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.reference.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.multicast.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.eventcast.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.context.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.context.node.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.interpreter.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.template.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.process.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.controller.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.batch.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.iterator.abstract.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.iterator.array.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.iterator.object.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.iterator.dom.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.model.abstract.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.model.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.model.array.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.model.object.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.model.dom.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.model.image.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.view.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.view.helper.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.view.template.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.source.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.transport.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.client.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.helper.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.iterator.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.iterator.value.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.model.value.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.model.message.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.transport.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.client.js"></script>
	<script type="text/javascript" src="source/transcendjs/transcend.xmlrpc.source.file.js"></script>
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

				onload = function (obj, handler) {
					handler (_data, true);
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

				onload = function (obj, handler) {
					setTimeout (function () {
						handler (this._data, true);
						//handler ("Failed to load from MySource: " + obj.src, false);
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
				var _event = Core._("Helpers.Event");
				var oninit, onstartup, render_action, mouseover_action, click_action;

				oninit = function () {
					//Register all controller actions
					this.register ("render", render_action);
					this.register ("mouseover", mouseover_action);
					this.register ("click", click_action);
				};

				onstartup = function () {
					var scope = this.get ("_models")["mymodel"];

					if (_type.isDefined (scope)) {
						//Load data and begin processing actions once completed
						scope.onload = function () {
							assert (this.immediateMode (true) == true);
						}.bind (this);

						scope.onerror = function (response) {
							alert (response);
						};

						scope.setAttribute ("src", "http://www.whatever.com/index.php");
					}
				};

				render_action = function (event, parent) {
					//Pass model data to view and render
					var scope = this.get ("_models")["mymodel"];
					var view = this.view().assign (scope);
					var elements = view.render (parent);

					//Add generated view elements to Eventcasts
					Eventcast.listen (
						[elements["title"], elements["id"], elements["value"][7]], 
						"mouseover", this.$mouseover
					).setMemo ("1px solid black");
					Eventcast.listen (
						[elements["title"], elements["id"], elements["value"][7]], 
						"mouseout", this.$mouseover
					).setMemo ("0");
					Eventcast.listen (elements["id"], "click", this.$click);
				};

				mouseover_action = function (event) {
					_event.getTarget(event).style.border = event.memo;
				};

				click_action = function (event) {
					var view = this.view();

					if (_type.isDefined (view)) 
						view._("output").innerHTML = 
						$(_event.getTarget(event)).readAttribute ("name") + " clicked";
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

			var rpc_xport = (new XmlRpcController ()).assign ({
				server: "http://intranet.jasonkflaherty.com/clients/technet_server/",
				debug: true
			});
			var rpc_process = (new Process ("XmlRpcTransport", rpc_xport.run.bind (rpc_xport), 0.5)).start ();
			var rpc_client = new XmlRpcClient ();
			var rpc_source = new XmlRpcSource ();
			var rpc_model = new ArrayModel (rpc_source);
			var test_obj = rpc_model.getInstance ();

			test_obj.onload = function (response) {
				console.log ("Final output:", Object.toJSON (response));

				//test_obj.setAttribute ("dest", "testfile.json");
			};

			rpc_xport.run ();
			rpc_source.assign ("target", rpc_client);
			rpc_client.get ("_controllers")["primary"] = rpc_xport;
			rpc_client.run ();

			test_obj.setAttribute ("src", {
				dir: "/data/analytics",
				file: "7f0000017db80e0b202d2d904f20095.json"
				//file: "63f7300a7db9020a1414353951b005f.json"
			});

			/*
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
			*/

			if (Container.test () === false)
				alert ("Regression test for Container class failed!");

			if (Interpreter.test () === false)
				alert ("Regression test for Interpreter class failed!");

			if (Reference.test () === false) 
				alert ("Regression test for Reference class failed!");

			if (Controller.test () === false) 
				alert ("Regression test for Controller class failed!");

			if (Core._("Helpers.MD5").test () === false) 
				alert ("Regression test for Controller class failed!");
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
