'use strict';

/**
 * Module dependencies
 */
var akeraysPolicy = require('../policies/akerays.server.policy'),
  akerays = require('../controllers/akerays.server.controller');

module.exports = function(app) {
  // Akerays Routes
  app.route('/api/akerays').all(akeraysPolicy.isAllowed)
    .get(akerays.list)
    .post(akerays.create);

  app.route('/api/akerays/:akerayId').all(akeraysPolicy.isAllowed)
    .get(akerays.read)
    .put(akerays.update)
    .delete(akerays.delete);

  // Finish by binding the Akeray middleware
  app.param('akerayId', akerays.akerayByID);
};
