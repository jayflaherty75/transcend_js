<?php
	$output = "";
	$settings = array (
		"libfile" => "\\xampp\\htdocs\\clients\\technet_client\\source\\transcendjs\\transcend.js",
		"outfile" => "\\xampp\\htdocs\\clients\\technet_client\\source\\transcendjs\\transcend-min.js",
		"jsdoc" => "\\Program Files\\JSDoc\\jsrun.jar",
		"jsdocrun" => "\\Program Files\\JSDoc\\app\\run.js",
		"templates" => "\\Program Files\\JSDoc\\templates\\jsdoc",
		"scripts" => "\\xampp\\htdocs\\clients\\technet_client\\source\\transcendjs",
		"docs" => "\\xampp\\htdocs\\clients\\technet_client\\docs",
		"compressor" => "\\Program Files\\yuicompressor\\build\\yuicompressor-2.4.2.jar"
	);
	$files = array (
		"transcend.core.js",
		"transcend.exception.js",
		"transcend.property.js",
		"transcend.config.js",
		"transcend.helper.cookies.js",
		"transcend.helper.querystring.js",
		"transcend.helper.css.js",
		"transcend.helper.unique.js",
		"transcend.helper.type.js",
		"transcend.helper.string.js",
		"transcend.container.abstract.js",
		"transcend.container.js",
		"transcend.reference.js",
		"transcend.multicast.js",
		"transcend.eventcast.js",
		"transcend.context.js",
		"transcend.context.node.js",
		"transcend.interpreter.js",
		"transcend.template.js",
		"transcend.process.js",
		"transcend.controller.js",
		"transcend.batch.js",
		"transcend.iterator.abstract.js",
		"transcend.iterator.array.js",
		"transcend.iterator.object.js",
		"transcend.iterator.dom.js",
		"transcend.model.abstract.js",
		"transcend.model.js",
		"transcend.model.array.js",
		"transcend.model.object.js",
		"transcend.model.dom.js",
		"transcend.model.image.js",
		"transcend.view.js",
		"transcend.view.helper.js",
		"transcend.view.template.js",
		"transcend.source.js",
		"transcend.transport.js",
		"transcend.client.js",
		"transcend.xmlrpc.helper.js",
		"transcend.xmlrpc.iterator.js",
		"transcend.xmlrpc.iterator.value.js",
		"transcend.xmlrpc.model.value.js",
		"transcend.xmlrpc.model.message.js",
		"transcend.xmlrpc.transport.js",
		"transcend.xmlrpc.client.js",
	);
	$exec_docs = "java -jar \"" . $settings["jsdoc"] . "\" \"" . 
		$settings["jsdocrun"] . "\" -a -t=\"" . $settings["templates"] . 
		"\" -d=\"" . $settings["docs"] . "\" \"" . $settings["scripts"] . "\"";
	$exec_compress = "java -jar \"" . $settings["compressor"] . "\" -v " . 
		$settings["libfile"] . " -o " . $settings["outfile"];

	echo ("<pre>Removing existing files...\r\n\r\n");
	echo ($exec_docs . "\r\n\r\n");

	if (unlink ($settings["libfile"])) {
		echo ($settings["libfile"] . " deleted.");
	}
	else {
		echo ($settings["libfile"] . " not found.");
	}

	if (unlink ($settings["outfile"])) {
		echo ($settings["outfile"] . " deleted.");
	}
	else {
		echo ($settings["outfile"] . " not found.");
	}

		echo ("<pre>Exporting documentation...\r\n\r\n");
	echo ($exec_docs . "\r\n\r\n");

	system ($exec_docs);

	echo ("\r\n\r\n");
	echo ("Loading library files...\r\n\r\n");

	$d = dir($settings["scripts"]);
	while (false !== ($file = $d->read())) {
		if (!in_array ($file, $files) && is_file ($settings["scripts"] . "\\" . $file)) {
			$files[] = $file;
		}
	}
	$d->close();

	foreach ($files as $file) {
		$content = file_get_contents ($settings["scripts"] . "\\" . $file);
		echo ($file . " <i>(" . strlen ($content) . " bytes)</i>\r\n");
		$output .= $content . "\r\n";
	}

	echo ("\r\n");
	echo ("Writing " . $settings["libfile"] . "\r\n\r\n");

	file_put_contents ($settings["libfile"], $output);

	echo ("Compressing...\r\n\r\n");
	echo ($exec_compress . "\r\n\r\n");

	system ($exec_compress);

	echo ("Done</pre>\r\n\r\n");
?>
