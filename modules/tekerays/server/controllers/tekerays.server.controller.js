'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tekeray = mongoose.model('Tekeray'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Tekeray
 */
exports.create = function(req, res) {
  var tekeray = new Tekeray(req.body);
  tekeray.user = req.user;

  tekeray.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tekeray);
    }
  });
};

/**
 * Show the current Tekeray
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tekeray = req.tekeray ? req.tekeray.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tekeray.isCurrentUserOwner = req.user && tekeray.user && tekeray.user._id.toString() === req.user._id.toString();

  res.jsonp(tekeray);
};

/**
 * Update a Tekeray
 */
exports.update = function(req, res) {
  var tekeray = req.tekeray;

  tekeray = _.extend(tekeray, req.body);

  tekeray.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tekeray);
    }
  });
};

/**
 * Delete an Tekeray
 */
exports.delete = function(req, res) {
  var tekeray = req.tekeray;

  tekeray.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tekeray);
    }
  });
};

/**
 * List of Tekerays
 */
exports.list = function(req, res) {
  Tekeray.find().sort('-created').populate('user', 'displayName').exec(function(err, tekerays) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tekerays);
    }
  });
};

/**
 * Tekeray middleware
 */
exports.tekerayByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tekeray is invalid'
    });
  }

  Tekeray.findById(id).populate('user', 'displayName').exec(function (err, tekeray) {
    if (err) {
      return next(err);
    } else if (!tekeray) {
      return res.status(404).send({
        message: 'No Tekeray with that identifier has been found'
      });
    }
    req.tekeray = tekeray;
    next();
  });
};
