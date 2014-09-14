'use strict';

var BankTransferPage  = require('./pages/bankTransfer.page.js');
var BankJournalInquiryPage  = require('./pages/bankJournalInquiry.page.js');

describe('bank transfer page:', function () {

  beforeEach(function () {
  });

  var reference = '';
  it('transfers ok', function () {
    var page = new BankTransferPage();
    expect(page.getTitle()).toEqual('Bank Account Transfer Entry');
    expect(page.getReference()).not.toEqual('');
    page.getReference().then(function(text) {
      reference = text;
    });
    page.transfer('Current account', 'Petty Cash account', '1/2/2013', '11', 'Some memo', null);
    expect(page.getNoteMessage()).toEqual('Transfer has been entered');
  });
  it('reads back', function () {
    var pageReadBack = new BankJournalInquiryPage();
    expect(pageReadBack.getTitle()).toEqual('Journal Inquiry');
    pageReadBack.search(reference, 'Funds Transfer', '1/2/2013', '1/2/2013', null);
//    browser.debugger();
    var items = pageReadBack.getResultRow(0);
    expect(items).toEqual([
      {column: 0, text: '01/02/2013'},
      {column: 1, text: 'Funds Transfer'},
      {column: 2, text: reference},
      {column: 3, text: reference},
      {column: 4, text: '11.00'},
      {column: 5, text: 'Some memo'},
      {column: 6, text: 'test'},
      {column: 7, text: ''},
      {column: 8, text: ''}
    ]);
  });
  it('updates and reads back', function () {
    var page = new BankTransferPage(reference);
    expect(page.getTitle()).toEqual('Modify Bank Account Transfer');
    expect(page.getReference()).toEqual(reference);
    page.transfer('Petty Cash account', 'Current account', '2/3/2013', '22', 'Some other memo', null);
    browser.debugger();
    expect(page.getNoteMessage()).toEqual('Transfer has been entered');

    var pageReadBack = new BankJournalInquiryPage();
    expect(pageReadBack.getTitle()).toEqual('Journal Inquiry');
    pageReadBack.search(reference, 'Funds Transfer', '2/3/2013', '2/3/2013', null);
//    browser.debugger();
    var items = pageReadBack.getResultRow(0);
    expect(items).toEqual([
      {column: 0, text: '02/03/2013'},
      {column: 1, text: 'Funds Transfer'},
      {column: 2, text: reference},
      {column: 3, text: reference},
      {column: 4, text: '22.00'},
      {column: 5, text: 'Some other memo'},
      {column: 6, text: 'test'},
      {column: 7, text: ''},
      {column: 8, text: ''}
    ]);
  });
  it('can be voided', function () {
  });


});
