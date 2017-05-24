'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tekeray = mongoose.model('Tekeray');

/**
 * Globals
 */
var user,
  tekeray;

/**
 * Unit tests
 */
describe('Tekeray Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      tekeray = new Tekeray({
        name: 'Tekeray Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return tekeray.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      tekeray.name = '';

      return tekeray.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Tekeray.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
