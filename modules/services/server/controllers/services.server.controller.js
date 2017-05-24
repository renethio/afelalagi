'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Service = mongoose.model('Service'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Service
 */
exports.create = function(req, res) {
  var service = new Service(req.body);
  service.user = req.user;

  service.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(service);
    }
  });
};

/**
 * Show the current Service
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var service = req.service ? req.service.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  service.isCurrentUserOwner = req.user && service.user && service.user._id.toString() === req.user._id.toString();

  res.jsonp(service);
};

/**
 * Update a Service
 */
exports.update = function(req, res) {
  var service = req.service;

  service = _.extend(service, req.body);

  service.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(service);
    }
  });
};

/**
 * Delete an Service
 */
exports.delete = function(req, res) {
  var service = req.service;

  service.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(service);
    }
  });
};

/**
 * List of Services
 */
exports.list = function(req, res) {
  Service.find().sort('-created').populate('user', 'displayName').exec(function(err, services) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(services);
    }
  });
};

/**
 * Service middleware
 */
exports.serviceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Service is invalid'
    });
  }

  Service.findById(id).populate('user', 'displayName').exec(function (err, service) {
    if (err) {
      return next(err);
    } else if (!service) {
      return res.status(404).send({
        message: 'No Service with that identifier has been found'
      });
    }
    req.service = service;
    next();
  });
};
