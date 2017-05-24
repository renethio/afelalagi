'use strict';

describe('Services E2E Tests:', function () {
  describe('Test Services page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/services');
      expect(element.all(by.repeater('service in services')).count()).toEqual(0);
    });
  });
});
