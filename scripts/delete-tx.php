<?php

	define('APP_PATH', '../htdocs/');

	// can only run from the command line
	if (php_sapi_name() !== 'cli') {
		header('Location: /');
		exit;
	}
	
	require_once(APP_PATH . 'config_db.php');
	
	// Command line options
	$options = getopt("s:e:", ["start:", "end:"]);
	if (isset($options['s'])) {
		$options['start'] = $options['s'];
		unset($options['s']);
	}
	if (isset($options['e'])) {
		$options['end'] = $options['e'];
		unset($options['e']);
	}
	// Defaults
	if (!isset($options['start'])) {
		$options['start'] = 0;
	}
	if (!isset($options['end'])) {
		$options['end'] = 999999;
	}
	
	$connectionInfo = $db_connections[1];

	// Connect to the database
	$mysqli = new mysqli($connectionInfo['host'], $connectionInfo['dbuser'], $connectionInfo['dbpassword'], $connectionInfo['dbname']);
	if ($mysqli->connect_errno) {
		exit(sprintf("DB connection failed: %s\n", $mysqli->connect_error));
	}
	print "DB connection successful\n";
	
	var_dump($options);
	
	$sql = sprintf("SELECT * FROM %d_audit_trail WHERE id>='%d' AND id<='%d'", 0, $options['start'], $options['end']);

	$typeMap = array(
		10 => 'ST_SALESINVOICE',
		13 => 'ST_CUSTDELIVERY',
		30 => 'ST_SALESORDER',
	);
	$result = $mysqli->query($sql);
	while ($row = $result->fetch_assoc()) {
		if (!array_key_exists($row['type'], $typeMap)) {
			printf("UNSUPPORTED id: %d type: %d trans: %d timestamp: %s\n", $row['id'], $row['type'], $row['trans_no'], $row['stamp']);
			continue;
		}
		switch ($row['type']) {
			case 10:
				printf("id: %d type: %s trans: %d timestamp: %s\n", $row['id'], $typeMap[$row['type']], $row['trans_no'], $row['stamp']);
				break;
			case 13:
				printf("id: %d type: %s trans: %d timestamp: %s\n", $row['id'], $typeMap[$row['type']], $row['trans_no'], $row['stamp']);
				break;
			case 30:
				printf("id: %d type: %s trans: %d timestamp: %s\n", $row['id'], $typeMap[$row['type']], $row['trans_no'], $row['stamp']);
				break;
		}
	}

	exit;

	// Update wp_options siteurl and home
	$sql = "SELECT * FROM wp_options WHERE option_name='siteurl' LIMIT 1";
	$value = $mysqli->query($sql)->fetch_assoc()['option_value'];
	$value = str_replace($domain, $wpConfig['DOMAIN_CURRENT_SITE'], $value);
	$sql = "UPDATE wp_options SET option_value='$value' WHERE option_name='siteurl'";
	updateDbValue($mysqli, $sql);
	
	$sql = "SELECT * FROM wp_options WHERE option_name='home' LIMIT 1";
	$value = $mysqli->query($sql)->fetch_assoc()['option_value'];
	$value = str_replace($domain, $wpConfig['DOMAIN_CURRENT_SITE'], $value);
	$sql = "UPDATE wp_options SET option_value='$value' WHERE option_name='home'";
	updateDbValue($mysqli, $sql);

	// For each row in wp_blogs update domain to that set in the wp_config file
	if ($result = $mysqli->query("SELECT * FROM wp_blogs")) {
		while ($subsite = $result->fetch_assoc()) {
			$blogId = $subsite['blog_id'];
			$value = str_replace($domain, $wpConfig['DOMAIN_CURRENT_SITE'], $subsite['domain']);
			$sql = "UPDATE wp_blogs SET domain='$value' WHERE blog_id='$blogId'";
			updateDbValue($mysqli, $sql);
		
			// Update wp_options siteurl and home for the subsite
			if ($blogId > 1) {
				$sql = sprintf("SELECT * FROM wp_%s_options WHERE option_name='siteurl' LIMIT 1", $blogId);
				$value = $mysqli->query($sql)->fetch_assoc()['option_value'];
				$value = str_replace($domain, $wpConfig['DOMAIN_CURRENT_SITE'], $value);
				$sql = sprintf("UPDATE wp_%s_options SET option_value='$value' WHERE option_name='siteurl'", $blogId);
				updateDbValue($mysqli, $sql);
				
				$sql = sprintf("SELECT * FROM wp_%s_options WHERE option_name='home' LIMIT 1", $blogId);
				$value = $mysqli->query($sql)->fetch_assoc()['option_value'];
				$value = str_replace($domain, $wpConfig['DOMAIN_CURRENT_SITE'], $value);
				$sql = sprintf("UPDATE wp_%s_options SET option_value='$value' WHERE option_name='home'", $blogId);
				updateDbValue($mysqli, $sql);
			}
		}
		$result->close();
	}
	$mysqli->close();
	print "DB connection closed\n";
	
	/**
	 * @param  string                    $filePath
	 * @return array
	 */
	function parseDefineConfigFile($filePath) {
		$result = array();
		$handle = fopen($filePath, "r");
		if (! $handle) {
			exit(sprintf("Error: Could not open file '%s'\n", $filePath));
		}
		while (($line = fgets($handle)) !== false) {
			$matches=array();
			
			// find a "define(name, value);" item on a line
			if (preg_match('/DEFINE\(\'(.*?)\',\s*\'(.*)\'\);/i', $line, $matches)) {
				$name = $matches[1];
				$value = $matches[2];
				$result[$name] = $value;
			}
		}
		fclose($handle);

		return $result;
	}

	/**
	 * @param  string                    $mysqli
	 * @param  string                    $sql
	 */
	function updateDbValue($mysqli, $sql) {
		if ($mysqli->query($sql) === TRUE) {
			print "Record updated successfully: $sql\n";
		} else {
			print "Error updating record: $mysqli->error\n";
		}
	}
	
