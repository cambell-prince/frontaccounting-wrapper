'use strict';

var BankAccountInquiryPage = function() {
  browser.ignoreSynchronization = true;
  browser.get('/gl/inquiry/bank_inquiry.php');

  this.account = element(by.name('bank_account'));
  this.dateFrom = element(by.name('TransAfterDate'));
  this.dateTo = element(by.name('TransToDate'));
  this.submit = element(by.name('Show'));

  this.search = function(account, from, to) {
    this.account.element(by.cssContainingText('option', account)).click();
    this.dateFrom.clear();
    this.dateFrom.sendKeys(from);
    this.dateTo.clear();
    this.dateTo.sendKeys(to);
    this.submit.click();
  };

  this.getTitle = function() {
    return browser.getTitle();
  };

  this.getResultRow = function(row) {
    var items = element.all(by.css('div#trans_tbl tr'))
    .get(row + 2)
    .all(by.tagName('td'))
    .map(function(cellElement, cellIndex) {
      return {
        column: cellIndex,
        text: cellElement.getText()
      };
    });
    return items;
  };

  this.getBalance = function() {
    var items = element.all(by.css('div#trans_tbl tr.inquirybg'))
    .get(1)
    .all(by.tagName('td'))
    .map(function(cellElement, cellIndex) {
      return {
        column: cellIndex,
        text: cellElement.getText()
      };
    });
    return items;
  }

}

module.exports = BankAccountInquiryPage;