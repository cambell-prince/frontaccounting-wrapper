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

		$amount = 22;
		$transactionId = add_bank_transfer(
			TestEnvironment::fromAccount(),
			TestEnvironment::toAccount(),
			'2/3/2014',
			$amount,
			'1',
			'Some memo',
			0,
			0
		);

// 		var_dump($transactionId);
		$this->assertGreaterThan(0, $transactionId);

		// Read back
		$dbResult = get_bank_trans(ST_BANKTRANSFER, $transactionId);
		$this->assertEquals(2, db_num_rows($dbResult));

		$transaction1 = db_fetch($dbResult);
// 		var_dump($transaction1);
		$this->assertEquals('2014-02-03', $transaction1['trans_date']);
		$this->assertEquals(-$amount, $transaction1['amount']);
		$this->assertEquals('1', $transaction1['ref']);

		$transaction2 = db_fetch($dbResult);
// 		var_dump($transaction2);
		$this->assertEquals('2014-02-03', $transaction2['trans_date']);
		$this->assertEquals($amount, $transaction2['amount']);
		$this->assertEquals('1', $transaction2['ref']);

		// Update transfer

		// Read back

		// Void

		// Read back
	}

}
