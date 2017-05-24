'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Akeray = mongoose.model('Akeray'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  akeray;

/**
 * Akeray routes tests
 */
describe('Akeray CRUD tests', function () {

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

    // Save a user to the test db and create new Akeray
    user.save(function () {
      akeray = {
        name: 'Akeray name'
      };

      done();
    });
  });

  it('should be able to save a Akeray if logged in', function (done) {
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

        // Save a new Akeray
        agent.post('/api/akerays')
          .send(akeray)
          .expect(200)
          .end(function (akeraySaveErr, akeraySaveRes) {
            // Handle Akeray save error
            if (akeraySaveErr) {
              return done(akeraySaveErr);
            }

            // Get a list of Akerays
            agent.get('/api/akerays')
              .end(function (akeraysGetErr, akeraysGetRes) {
                // Handle Akerays save error
                if (akeraysGetErr) {
                  return done(akeraysGetErr);
                }

                // Get Akerays list
                var akerays = akeraysGetRes.body;

                // Set assertions
                (akerays[0].user._id).should.equal(userId);
                (akerays[0].name).should.match('Akeray name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Akeray if not logged in', function (done) {
    agent.post('/api/akerays')
      .send(akeray)
      .expect(403)
      .end(function (akeraySaveErr, akeraySaveRes) {
        // Call the assertion callback
        done(akeraySaveErr);
      });
  });

  it('should not be able to save an Akeray if no name is provided', function (done) {
    // Invalidate name field
    akeray.name = '';

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

        // Save a new Akeray
        agent.post('/api/akerays')
          .send(akeray)
          .expect(400)
          .end(function (akeraySaveErr, akeraySaveRes) {
            // Set message assertion
            (akeraySaveRes.body.message).should.match('Please fill Akeray name');

            // Handle Akeray save error
            done(akeraySaveErr);
          });
      });
  });

  it('should be able to update an Akeray if signed in', function (done) {
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

        // Save a new Akeray
        agent.post('/api/akerays')
          .send(akeray)
          .expect(200)
          .end(function (akeraySaveErr, akeraySaveRes) {
            // Handle Akeray save error
            if (akeraySaveErr) {
              return done(akeraySaveErr);
            }

            // Update Akeray name
            akeray.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Akeray
            agent.put('/api/akerays/' + akeraySaveRes.body._id)
              .send(akeray)
              .expect(200)
              .end(function (akerayUpdateErr, akerayUpdateRes) {
                // Handle Akeray update error
                if (akerayUpdateErr) {
                  return done(akerayUpdateErr);
                }

                // Set assertions
                (akerayUpdateRes.body._id).should.equal(akeraySaveRes.body._id);
                (akerayUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Akerays if not signed in', function (done) {
    // Create new Akeray model instance
    var akerayObj = new Akeray(akeray);

    // Save the akeray
    akerayObj.save(function () {
      // Request Akerays
      request(app).get('/api/akerays')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Akeray if not signed in', function (done) {
    // Create new Akeray model instance
    var akerayObj = new Akeray(akeray);

    // Save the Akeray
    akerayObj.save(function () {
      request(app).get('/api/akerays/' + akerayObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', akeray.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Akeray with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/akerays/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Akeray is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Akeray which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Akeray
    request(app).get('/api/akerays/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Akeray with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Akeray if signed in', function (done) {
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

        // Save a new Akeray
        agent.post('/api/akerays')
          .send(akeray)
          .expect(200)
          .end(function (akeraySaveErr, akeraySaveRes) {
            // Handle Akeray save error
            if (akeraySaveErr) {
              return done(akeraySaveErr);
            }

            // Delete an existing Akeray
            agent.delete('/api/akerays/' + akeraySaveRes.body._id)
              .send(akeray)
              .expect(200)
              .end(function (akerayDeleteErr, akerayDeleteRes) {
                // Handle akeray error error
                if (akerayDeleteErr) {
                  return done(akerayDeleteErr);
                }

                // Set assertions
                (akerayDeleteRes.body._id).should.equal(akeraySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Akeray if not signed in', function (done) {
    // Set Akeray user
    akeray.user = user;

    // Create new Akeray model instance
    var akerayObj = new Akeray(akeray);

    // Save the Akeray
    akerayObj.save(function () {
      // Try deleting Akeray
      request(app).delete('/api/akerays/' + akerayObj._id)
        .expect(403)
        .end(function (akerayDeleteErr, akerayDeleteRes) {
          // Set message assertion
          (akerayDeleteRes.body.message).should.match('User is not authorized');

          // Handle Akeray error error
          done(akerayDeleteErr);
        });

    });
  });

  it('should be able to get a single Akeray that has an orphaned user reference', function (done) {
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

          // Save a new Akeray
          agent.post('/api/akerays')
            .send(akeray)
            .expect(200)
            .end(function (akeraySaveErr, akeraySaveRes) {
              // Handle Akeray save error
              if (akeraySaveErr) {
                return done(akeraySaveErr);
              }

              // Set assertions on new Akeray
              (akeraySaveRes.body.name).should.equal(akeray.name);
              should.exist(akeraySaveRes.body.user);
              should.equal(akeraySaveRes.body.user._id, orphanId);

              // force the Akeray to have an orphaned user reference
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

                    // Get the Akeray
                    agent.get('/api/akerays/' + akeraySaveRes.body._id)
                      .expect(200)
                      .end(function (akerayInfoErr, akerayInfoRes) {
                        // Handle Akeray error
                        if (akerayInfoErr) {
                          return done(akerayInfoErr);
                        }

                        // Set assertions
                        (akerayInfoRes.body._id).should.equal(akeraySaveRes.body._id);
                        (akerayInfoRes.body.name).should.equal(akeray.name);
                        should.equal(akerayInfoRes.body.user, undefined);

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
      Akeray.remove().exec(done);
    });
  });
});
