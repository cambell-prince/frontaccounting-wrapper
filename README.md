# FrontAccounting

[![Build Status](https://travis-ci.org/cambell-prince/frontaccounting-wrapper.svg?branch=master)](https://travis-ci.org/cambell-prince/frontaccounting-wrapper)

This project contains tests for the [Front Accounting](http://frontaccounting.com) web based accounting system.

Currently two types of tests are available:

1. E2E tests using the protractor test framework
2. PHP unit tests using the PHPUnit test framework

The E2E tests exercise the UI much as a user would.
The PHP unit tests exercise the database back end for various functions.

### Known Issues
This testing repository is not part of the upstream Front Accounting repository, therefore the tests are not synchronized with the development of Front Accounting itself.  Tests can become 'stale' as features change and the tests are not updated.


### Status
The test suite is far (very far) from complete. In fact, it has only just begun.

You can have a look at our current [Code Coverage](https://rawgit.com/wiki/cambell-prince/frontaccounting-wrapper/code_coverage/index.html).  The code coverage report is updated manually from time to time and may not be up to date.  The Code Coverage report only reflects code covered by the PHPUnit tests.  It does not report on code covered by the E2E tests.

### Travis CI Integration and Automation

The tests have a travis configuration which is [running here](https://travis-ci.org/cambell-prince/frontaccounting-wrapper).

Note that the travis build pulls the latest code from the branch 'master-cp' from https://github.com/cambell-prince/frontaccounting.

The travis testing is done using phantomjs on the Travis node rather than chrome, as Travis nodes are headless.

### Installation & Operation

#### For the PHPUnit Tests

 * Install the dependencies (if not installed)

		npm install
		composer install

 * Run the PHPUnit tests (via gulp)

		gulp test-php
    
#### For the E2E Tests

 * Install the dependencies (if not installed)

		npm install

 * Start the local php server

		sh build-startServer

 * Start the local web driver

		sh build-startWebDriver

 * Run the E2E tests using the Chrome web driver

		gulp test-chrome