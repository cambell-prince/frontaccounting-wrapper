<?php

require_once(__DIR__ . '/TestConfig.php');

require_once(TEST_PATH . '/TestEnvironment.php');

function display_error($err) {
	echo $err;
}

function end_page() {}


class GLBankTransferTest extends PHPUnit_Framework_TestCase
{

	function setUp() {
		TestEnvironment::isGoodToGo();
		TestEnvironment::cleanBanking();
	}

	function tearDown() {
	}

	public function testBankTransfer_CreateUpdateReadVoid_Ok()
	{
		TestEnvironment::includeFile('gl/includes/db/gl_db_banking.inc');

		// Create transfer
		$amount = 22;
		$transactionId = add_bank_transfer(
			TestEnvironment::currentAccount(),
			TestEnvironment::cashAccount(),
			'2/3/2014',
			$amount,
			'1',
			'Some memo',
			0,
			0
		);

		$this->assertGreaterThan(0, $transactionId);

		// Read back
		$dbResult = get_bank_trans(ST_BANKTRANSFER, $transactionId);
		$this->assertEquals(2, db_num_rows($dbResult));

		$transaction1 = db_fetch($dbResult);
		$this->assertEquals('2014-02-03', $transaction1['trans_date']);
		$this->assertEquals(-$amount, $transaction1['amount']);
		$this->assertEquals('1', $transaction1['ref']);

		$transaction2 = db_fetch($dbResult);
		$this->assertEquals('2014-02-03', $transaction2['trans_date']);
		$this->assertEquals($amount, $transaction2['amount']);
		$this->assertEquals('1', $transaction2['ref']);

		// Update transfer
		$amount = 33;
		$updatedTransactionId = update_bank_transfer(
			$transactionId,
			TestEnvironment::cashAccount(),
			TestEnvironment::currentAccount(),
			'4/5/2014',
			$amount,
			'2',
			'Some other memo',
			0,
			0
		);

		// Read back
		$dbResult = get_bank_trans(ST_BANKTRANSFER, $updatedTransactionId);
		$this->assertEquals(2, db_num_rows($dbResult));

		$transaction1 = db_fetch($dbResult);
		$this->assertEquals('2014-04-05', $transaction1['trans_date']);
		$this->assertEquals(-$amount, $transaction1['amount']);
		$this->assertEquals('2', $transaction1['ref']);

		$transaction2 = db_fetch($dbResult);
		$this->assertEquals('2014-04-05', $transaction2['trans_date']);
		$this->assertEquals($amount, $transaction2['amount']);
		$this->assertEquals('2', $transaction2['ref']);

		// TODO This would be better the bank inquiry tests
		// Check the bank inquiry
		$result = get_bank_trans_for_bank_account(
			1,
			'1/1/20214',
			'12/12/2014'
		);
		// Check that the original transaction id is not present (it has been voided)
		// Check that there is no $0 amount
		$foundId = false;
		$foundZero = false;
		while ($row = db_fetch_assoc($result)) {
			if ($row['amount'] == 0) {
				$foundZero = true;
			}
			if ($row['trans_no'] == $transactionId) {
				$foundId = true;
			}
		}
		$this->assertFalse($foundId);
		$this->assertFalse($foundZero);

		// Void

		// Read back
	}

	public function testBankTransfer_TwoTransfersEditFirst_DoesntPermitBelowZero()
	{
		TestEnvironment::includeFile('gl/includes/db/gl_db_banking.inc');
		$amount = 40;
		$transactionId1 = add_bank_transfer(
			TestEnvironment::currentAccount(),
			TestEnvironment::cashAccount(),
			'2/3/2014',
			$amount,
			'3',
			'Some memo',
			0,
			0
		);
		$amount = 30;
		$transactionId2 = add_bank_transfer(
			TestEnvironment::cashAccount(),
			TestEnvironment::currentAccount(),
			'2/3/2014',
			$amount,
			'3',
			'Some memo',
			0,
			0
		);
		$amount = 10;
		$updatedTransactionId = update_bank_transfer(
			$transactionId1,
			TestEnvironment::currentAccount(),
			TestEnvironment::cashAccount(),
			'2/3/2014',
			$amount,
			'3',
			'Some memo',
			0,
			0
		);

	}

}
