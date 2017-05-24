'use strict';

describe('Tekerays E2E Tests:', function () {
  describe('Test Tekerays page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tekerays');
      expect(element.all(by.repeater('tekeray in tekerays')).count()).toEqual(0);
    });
  });
});
