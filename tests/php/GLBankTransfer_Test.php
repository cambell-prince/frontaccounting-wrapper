<?php

require_once(__DIR__ . '/TestConfig.php');

require_once(TEST_PATH . '/TestEnvironment.php');

class GLBankTransferTest extends PHPUnit_Framework_TestCase
{

	public function testBankTransfer_CreateUpdateReadVoid_Ok()
	{
		$this->assertEquals('OK', TestEnvironment::isGoodToGo());

		// Create transfer
		TestEnvironment::includeFile('gl/includes/db/gl_db_banking.inc');

		$transactionId = add_bank_transfer(
			TestEnvironment::fromAccount(),
			TestEnvironment::toAccount(),
			'2/3/2014',
			'22',
			'1',
			'Some memo',
			0,
			0
		);

// 		var_dump($transactionId);
		$this->assertGreaterThan(0, $transactionId);

		// Read back
		$dbResult = get_bank_trans(ST_BANKTRANSFER, $transactionId);

		$trans1 = db_fetch($dbResult);
// 		var_dump($trans1);

		$trans2 = db_fetch($dbResult);

		$this->assertEquals(2, db_num_rows($dbResult));


		// Update transfer

		// Read back

		// Void

		// Read back
	}

}
