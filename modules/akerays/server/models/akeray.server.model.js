'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Akeray Schema
 */
var AkeraySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Akeray name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Akeray', AkeraySchema);
