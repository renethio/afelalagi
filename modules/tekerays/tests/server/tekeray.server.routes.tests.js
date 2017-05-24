'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Tekeray = mongoose.model('Tekeray'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  tekeray;

/**
 * Tekeray routes tests
 */
describe('Tekeray CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Tekeray
    user.save(function () {
      tekeray = {
        name: 'Tekeray name'
      };

      done();
    });
  });

  it('should be able to save a Tekeray if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tekeray
        agent.post('/api/tekerays')
          .send(tekeray)
          .expect(200)
          .end(function (tekeraySaveErr, tekeraySaveRes) {
            // Handle Tekeray save error
            if (tekeraySaveErr) {
              return done(tekeraySaveErr);
            }

            // Get a list of Tekerays
            agent.get('/api/tekerays')
              .end(function (tekeraysGetErr, tekeraysGetRes) {
                // Handle Tekerays save error
                if (tekeraysGetErr) {
                  return done(tekeraysGetErr);
                }

                // Get Tekerays list
                var tekerays = tekeraysGetRes.body;

                // Set assertions
                (tekerays[0].user._id).should.equal(userId);
                (tekerays[0].name).should.match('Tekeray name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Tekeray if not logged in', function (done) {
    agent.post('/api/tekerays')
      .send(tekeray)
      .expect(403)
      .end(function (tekeraySaveErr, tekeraySaveRes) {
        // Call the assertion callback
        done(tekeraySaveErr);
      });
  });

  it('should not be able to save an Tekeray if no name is provided', function (done) {
    // Invalidate name field
    tekeray.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tekeray
        agent.post('/api/tekerays')
          .send(tekeray)
          .expect(400)
          .end(function (tekeraySaveErr, tekeraySaveRes) {
            // Set message assertion
            (tekeraySaveRes.body.message).should.match('Please fill Tekeray name');

            // Handle Tekeray save error
            done(tekeraySaveErr);
          });
      });
  });

  it('should be able to update an Tekeray if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tekeray
        agent.post('/api/tekerays')
          .send(tekeray)
          .expect(200)
          .end(function (tekeraySaveErr, tekeraySaveRes) {
            // Handle Tekeray save error
            if (tekeraySaveErr) {
              return done(tekeraySaveErr);
            }

            // Update Tekeray name
            tekeray.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Tekeray
            agent.put('/api/tekerays/' + tekeraySaveRes.body._id)
              .send(tekeray)
              .expect(200)
              .end(function (tekerayUpdateErr, tekerayUpdateRes) {
                // Handle Tekeray update error
                if (tekerayUpdateErr) {
                  return done(tekerayUpdateErr);
                }

                // Set assertions
                (tekerayUpdateRes.body._id).should.equal(tekeraySaveRes.body._id);
                (tekerayUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Tekerays if not signed in', function (done) {
    // Create new Tekeray model instance
    var tekerayObj = new Tekeray(tekeray);

    // Save the tekeray
    tekerayObj.save(function () {
      // Request Tekerays
      request(app).get('/api/tekerays')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Tekeray if not signed in', function (done) {
    // Create new Tekeray model instance
    var tekerayObj = new Tekeray(tekeray);

    // Save the Tekeray
    tekerayObj.save(function () {
      request(app).get('/api/tekerays/' + tekerayObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', tekeray.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Tekeray with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/tekerays/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Tekeray is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Tekeray which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Tekeray
    request(app).get('/api/tekerays/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Tekeray with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Tekeray if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Tekeray
        agent.post('/api/tekerays')
          .send(tekeray)
          .expect(200)
          .end(function (tekeraySaveErr, tekeraySaveRes) {
            // Handle Tekeray save error
            if (tekeraySaveErr) {
              return done(tekeraySaveErr);
            }

            // Delete an existing Tekeray
            agent.delete('/api/tekerays/' + tekeraySaveRes.body._id)
              .send(tekeray)
              .expect(200)
              .end(function (tekerayDeleteErr, tekerayDeleteRes) {
                // Handle tekeray error error
                if (tekerayDeleteErr) {
                  return done(tekerayDeleteErr);
                }

                // Set assertions
                (tekerayDeleteRes.body._id).should.equal(tekeraySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Tekeray if not signed in', function (done) {
    // Set Tekeray user
    tekeray.user = user;

    // Create new Tekeray model instance
    var tekerayObj = new Tekeray(tekeray);

    // Save the Tekeray
    tekerayObj.save(function () {
      // Try deleting Tekeray
      request(app).delete('/api/tekerays/' + tekerayObj._id)
        .expect(403)
        .end(function (tekerayDeleteErr, tekerayDeleteRes) {
          // Set message assertion
          (tekerayDeleteRes.body.message).should.match('User is not authorized');

          // Handle Tekeray error error
          done(tekerayDeleteErr);
        });

    });
  });

  it('should be able to get a single Tekeray that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Tekeray
          agent.post('/api/tekerays')
            .send(tekeray)
            .expect(200)
            .end(function (tekeraySaveErr, tekeraySaveRes) {
              // Handle Tekeray save error
              if (tekeraySaveErr) {
                return done(tekeraySaveErr);
              }

              // Set assertions on new Tekeray
              (tekeraySaveRes.body.name).should.equal(tekeray.name);
              should.exist(tekeraySaveRes.body.user);
              should.equal(tekeraySaveRes.body.user._id, orphanId);

              // force the Tekeray to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Tekeray
                    agent.get('/api/tekerays/' + tekeraySaveRes.body._id)
                      .expect(200)
                      .end(function (tekerayInfoErr, tekerayInfoRes) {
                        // Handle Tekeray error
                        if (tekerayInfoErr) {
                          return done(tekerayInfoErr);
                        }

                        // Set assertions
                        (tekerayInfoRes.body._id).should.equal(tekeraySaveRes.body._id);
                        (tekerayInfoRes.body.name).should.equal(tekeray.name);
                        should.equal(tekerayInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Tekeray.remove().exec(done);
    });
  });
});
