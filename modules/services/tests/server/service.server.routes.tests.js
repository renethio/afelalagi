'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Service = mongoose.model('Service'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  service;

/**
 * Service routes tests
 */
describe('Service CRUD tests', function () {

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

    // Save a user to the test db and create new Service
    user.save(function () {
      service = {
        name: 'Service name'
      };

      done();
    });
  });

  it('should be able to save a Service if logged in', function (done) {
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

        // Save a new Service
        agent.post('/api/services')
          .send(service)
          .expect(200)
          .end(function (serviceSaveErr, serviceSaveRes) {
            // Handle Service save error
            if (serviceSaveErr) {
              return done(serviceSaveErr);
            }

            // Get a list of Services
            agent.get('/api/services')
              .end(function (servicesGetErr, servicesGetRes) {
                // Handle Services save error
                if (servicesGetErr) {
                  return done(servicesGetErr);
                }

                // Get Services list
                var services = servicesGetRes.body;

                // Set assertions
                (services[0].user._id).should.equal(userId);
                (services[0].name).should.match('Service name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Service if not logged in', function (done) {
    agent.post('/api/services')
      .send(service)
      .expect(403)
      .end(function (serviceSaveErr, serviceSaveRes) {
        // Call the assertion callback
        done(serviceSaveErr);
      });
  });

  it('should not be able to save an Service if no name is provided', function (done) {
    // Invalidate name field
    service.name = '';

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

        // Save a new Service
        agent.post('/api/services')
          .send(service)
          .expect(400)
          .end(function (serviceSaveErr, serviceSaveRes) {
            // Set message assertion
            (serviceSaveRes.body.message).should.match('Please fill Service name');

            // Handle Service save error
            done(serviceSaveErr);
          });
      });
  });

  it('should be able to update an Service if signed in', function (done) {
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

        // Save a new Service
        agent.post('/api/services')
          .send(service)
          .expect(200)
          .end(function (serviceSaveErr, serviceSaveRes) {
            // Handle Service save error
            if (serviceSaveErr) {
              return done(serviceSaveErr);
            }

            // Update Service name
            service.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Service
            agent.put('/api/services/' + serviceSaveRes.body._id)
              .send(service)
              .expect(200)
              .end(function (serviceUpdateErr, serviceUpdateRes) {
                // Handle Service update error
                if (serviceUpdateErr) {
                  return done(serviceUpdateErr);
                }

                // Set assertions
                (serviceUpdateRes.body._id).should.equal(serviceSaveRes.body._id);
                (serviceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Services if not signed in', function (done) {
    // Create new Service model instance
    var serviceObj = new Service(service);

    // Save the service
    serviceObj.save(function () {
      // Request Services
      request(app).get('/api/services')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Service if not signed in', function (done) {
    // Create new Service model instance
    var serviceObj = new Service(service);

    // Save the Service
    serviceObj.save(function () {
      request(app).get('/api/services/' + serviceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', service.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Service with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/services/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Service is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Service which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Service
    request(app).get('/api/services/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Service with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Service if signed in', function (done) {
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

        // Save a new Service
        agent.post('/api/services')
          .send(service)
          .expect(200)
          .end(function (serviceSaveErr, serviceSaveRes) {
            // Handle Service save error
            if (serviceSaveErr) {
              return done(serviceSaveErr);
            }

            // Delete an existing Service
            agent.delete('/api/services/' + serviceSaveRes.body._id)
              .send(service)
              .expect(200)
              .end(function (serviceDeleteErr, serviceDeleteRes) {
                // Handle service error error
                if (serviceDeleteErr) {
                  return done(serviceDeleteErr);
                }

                // Set assertions
                (serviceDeleteRes.body._id).should.equal(serviceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Service if not signed in', function (done) {
    // Set Service user
    service.user = user;

    // Create new Service model instance
    var serviceObj = new Service(service);

    // Save the Service
    serviceObj.save(function () {
      // Try deleting Service
      request(app).delete('/api/services/' + serviceObj._id)
        .expect(403)
        .end(function (serviceDeleteErr, serviceDeleteRes) {
          // Set message assertion
          (serviceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Service error error
          done(serviceDeleteErr);
        });

    });
  });

  it('should be able to get a single Service that has an orphaned user reference', function (done) {
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

          // Save a new Service
          agent.post('/api/services')
            .send(service)
            .expect(200)
            .end(function (serviceSaveErr, serviceSaveRes) {
              // Handle Service save error
              if (serviceSaveErr) {
                return done(serviceSaveErr);
              }

              // Set assertions on new Service
              (serviceSaveRes.body.name).should.equal(service.name);
              should.exist(serviceSaveRes.body.user);
              should.equal(serviceSaveRes.body.user._id, orphanId);

              // force the Service to have an orphaned user reference
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

                    // Get the Service
                    agent.get('/api/services/' + serviceSaveRes.body._id)
                      .expect(200)
                      .end(function (serviceInfoErr, serviceInfoRes) {
                        // Handle Service error
                        if (serviceInfoErr) {
                          return done(serviceInfoErr);
                        }

                        // Set assertions
                        (serviceInfoRes.body._id).should.equal(serviceSaveRes.body._id);
                        (serviceInfoRes.body.name).should.equal(service.name);
                        should.equal(serviceInfoRes.body.user, undefined);

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
      Service.remove().exec(done);
    });
  });
});
