'use strict';

describe('Akerays E2E Tests:', function () {
  describe('Test Akerays page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/akerays');
      expect(element.all(by.repeater('akeray in akerays')).count()).toEqual(0);
    });
  });
});
