<?php
	$output = "";
	$settings = array (
		"libfile" => "\\xampp\\htdocs\\clients\\technet_client\\release\\technet_full.js",
		"outfile" => "\\xampp\\htdocs\\clients\\technet_client\\release\\technet.js",
		"jsdoc" => "\\Program Files\\JSDoc\\jsrun.jar",
		"jsdocrun" => "\\Program Files\\JSDoc\\app\\run.js",
		"templates" => "\\Program Files\\JSDoc\\templates\\jsdoc",
		"scripts" => "\\xampp\\htdocs\\clients\\technet_client\\js",
		"docs" => "\\xampp\\htdocs\\clients\\technet_client\\release\\docs",
		"compressor" => "\\Program Files\\yuicompressor\\build\\yuicompressor-2.4.2.jar"
	);
	$files = array (
		"technet_core.js", 
		"technet_config.js", 
		"technet_helpers.js", 
		"technet_container.js", 
		"technet_events.js", 
		"technet_interpreter.js", 
		"technet_process.js",
		"technet_controller.js",
		"technet_model.js",
		"technet_view.js"
	);
	$exec_docs = "java -jar \"" . $settings["jsdoc"] . "\" \"" . 
		$settings["jsdocrun"] . "\" -a -t=\"" . $settings["templates"] . 
		"\" -d=\"" . $settings["docs"] . "\" \"" . $settings["scripts"] . "\"";
	$exec_compress = "java -jar \"" . $settings["compressor"] . "\" -v " . 
		$settings["libfile"] . " -o " . $settings["outfile"];

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
