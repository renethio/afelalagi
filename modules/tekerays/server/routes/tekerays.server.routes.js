'use strict';

/**
 * Module dependencies
 */
var tekeraysPolicy = require('../policies/tekerays.server.policy'),
  tekerays = require('../controllers/tekerays.server.controller');

module.exports = function(app) {
  // Tekerays Routes
  app.route('/api/tekerays').all(tekeraysPolicy.isAllowed)
    .get(tekerays.list)
    .post(tekerays.create);

  app.route('/api/tekerays/:tekerayId').all(tekeraysPolicy.isAllowed)
    .get(tekerays.read)
    .put(tekerays.update)
    .delete(tekerays.delete);

  // Finish by binding the Tekeray middleware
  app.param('tekerayId', tekerays.tekerayByID);
};
