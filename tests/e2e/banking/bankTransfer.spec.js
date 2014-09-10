'use strict';

var BankTrasnferPage  = require('../pages/bankTransfer.page.js');

describe('bank transfer page:', function () {
  var page;

  beforeEach(function () {
    page = new BankTrasnferPage();
  });

  it('transfer succeeds', function () {
    expect(page.getTitle()).toEqual('Bank Account Transfer Entry');
    expect(page.getReference()).not.toEqual('');
    page.transfer('Current account', 'Petty Cash account', '1/2/2013', '11', 'Some memo', null);
    browser.debugger();
    expect(page.getNoteMessage()).toEqual('Transfer has been entered');
  });
});
