module.exports = function (upload) {
  var express = require('express');
  var router = express.Router();
  var User = require('../models/user');
  var passport = require('passport');
  var passportConfig = require('../config/passport');


  router.route('/signup')
  .get(function(req, res, next) {
    res.render('signup', { title: 'Sign Up' });
  })
  .post(upload.single('profileImg'), function(req, res, next) {
    // Get all form values
    var username   = req.body.username,
        name       = req.body.name,
        email      = req.body.email,
        password   = req.body.password,
        password2  = req.body.password,
        profileImg = req.file;

    if(profileImg) {
        console.log('uploading file...');
        // GET ALL FILE INFO
        var imgOriginName = profileImg.originalname,
            imgName       = profileImg.filename,
            imgMimeType   = profileImg.mimetype,
            imgPath       = profileImg.path,
            imgSize       = profileImg.size;
      } else {
        // SET A DEFAULT IMAGE
        var imgName = 'noImg.png';
      }

      // FORM VALIDATION
      req.checkBody('name', 'Name field is required!').notEmpty();
      req.checkBody('email', 'Email field is required!').notEmpty();
      req.checkBody('email', 'Email is not valid!').isEmail();
      req.checkBody('username', 'Username field is required!').notEmpty();
      req.checkBody('password', 'Password field is required!').notEmpty();
      req.checkBody('password2', 'Passwords do not match!').equals(password);

      // Errors handler
      var errors = req.validationErrors();
      if(errors){
        res.render('signup', {
          errors: errors,
          name: name,
          email: email,
          username: username,
          password: password
        });
      } else {
        var user = new User({
          name: name,
          email: email,
          username: username,
          password: password,
          profileImage: imgName
        });

        User.createUser(user, function(err, user) {
          if(err) throw err;
          console.log(user);
        });

        req.flash('success', 'You successfully signed up and may log in!');
        res.redirect('/');
      }
  });

  router.route('/login')
  .get(passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }), function(req, res, next) {
    console.log('You successfully logged in!');
    req.flash('success', 'You are now logged in');
    res.redirect('/');
  })
  .post(function(req, res, next) {

  });

  return router;
}
