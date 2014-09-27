'use strict';

var BankTransferPage = function(transactionNo) {
  browser.ignoreSynchronization = true;
//  http://bms.local/gl/bank_transfer.php&trans_type=4
  var url = '/gl/bank_transfer.php';
  if (transactionNo) {
    url += '?ModifyTransfer=Yes&trans_no=' + transactionNo;
  }
  browser.get(url);

  this.fromAccount = element(by.name('FromBankAccount'));
  this.toAccount = element(by.name('ToBankAccount'));
  this.date = element(by.name('DatePaid'));
  this.reference = element(by.name('ref'));
  this.amount = element(by.name('amount'));
  this.bankCharge = element(by.name('charge'));
  this.memo = element(by.name('memo_'));
  this.submit = element(by.name('submit'));

  this.transfer = function(from, to, date, amount, memo, bankCharge) {
    this.fromAccount.element(by.cssContainingText('option', from)).click();
    this.toAccount.element(by.cssContainingText('option', to)).click();
    this.date.clear();
    this.date.sendKeys(date);
    this.amount.clear();
    this.amount.sendKeys(amount);
    if (memo) {
      this.memo.clear();
      this.memo.sendKeys(memo);
    }
    if (bankCharge) this.bankCharge.sendKeys(bankCharge);
    this.submit.click();
  };

  this.getTitle = function() {
    return browser.getTitle();
  };

  this.getReference = function() {
    return this.reference.getAttribute('value');
  };

  this.getNoteMessage = function() {
    return element(by.css('div.note_msg')).getText();
  };

}

module.exports = BankTransferPage;