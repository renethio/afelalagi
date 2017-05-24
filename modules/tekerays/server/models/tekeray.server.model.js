'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tekeray Schema
 */
var TekeraySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tekeray name',
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

mongoose.model('Tekeray', TekeraySchema);
