var passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    User          = require('../models/user');

passport.use(new LocalStrategy(function(username, password, done) {
  
}));