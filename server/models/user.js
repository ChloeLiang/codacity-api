const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      access: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// Override a method to change how mongoose handles things.
// Limit the data sent back to the user.
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  // Don't return password and tokens.
  return _.pick(userObject, ['_id', 'email']);
};

// Add instance methods to UserSchema.
UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt
    .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
    .toString();

  user.tokens = user.tokens.concat([{ access, token }]);

  // Return the Promise for chaining call in server.
  return user.save().then(() => {
    return token;
  });
};

// Log user out.
UserSchema.methods.removeToken = function(token) {
  const user = this;
  return user.updateOne({
    $pull: {
      tokens: { token },
    },
  });
};

// Model method: check user logged in.
UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

// Model method: find user by email and password.
UserSchema.statics.findByCredentials = function(email, password) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// Hash password before saving to database.
UserSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    const password = user.password;
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Must be placed after schema methods.
const User = mongoose.model('User', UserSchema);

module.exports = { User };
