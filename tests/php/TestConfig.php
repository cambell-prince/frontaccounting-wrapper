<?php

ini_set('xdebug.show_exception_trace', 0);

$rootPath = realpath(__DIR__ . '/../..');
define('ROOT_PATH', $rootPath);
define('SRC_PATH', $rootPath . '/htdocs');
define('TEST_PATH', $rootPath . '/tests/php');

