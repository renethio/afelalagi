'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Akeray = mongoose.model('Akeray'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Akeray
 */
exports.create = function(req, res) {
  var akeray = new Akeray(req.body);
  akeray.user = req.user;

  akeray.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(akeray);
    }
  });
};

/**
 * Show the current Akeray
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var akeray = req.akeray ? req.akeray.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  akeray.isCurrentUserOwner = req.user && akeray.user && akeray.user._id.toString() === req.user._id.toString();

  res.jsonp(akeray);
};

/**
 * Update a Akeray
 */
exports.update = function(req, res) {
  var akeray = req.akeray;

  akeray = _.extend(akeray, req.body);

  akeray.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(akeray);
    }
  });
};

/**
 * Delete an Akeray
 */
exports.delete = function(req, res) {
  var akeray = req.akeray;

  akeray.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(akeray);
    }
  });
};

/**
 * List of Akerays
 */
exports.list = function(req, res) {
  Akeray.find().sort('-created').populate('user', 'displayName').exec(function(err, akerays) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(akerays);
    }
  });
};

/**
 * Akeray middleware
 */
exports.akerayByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Akeray is invalid'
    });
  }

  Akeray.findById(id).populate('user', 'displayName').exec(function (err, akeray) {
    if (err) {
      return next(err);
    } else if (!akeray) {
      return res.status(404).send({
        message: 'No Akeray with that identifier has been found'
      });
    }
    req.akeray = akeray;
    next();
  });
};
