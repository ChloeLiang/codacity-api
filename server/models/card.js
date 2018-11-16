const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  front: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  back: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
  },
  repetition: {
    type: Number,
    default: 0,
  },
  easiness: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 1,
  },
  _deck: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Card = mongoose.model('Card', CardSchema);

module.exports = { Card };
