const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('../config/ppConfig');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res) => {
  db.user.findOrCreate({
    where: {
      email: req.body.email
    }, defaults: {
      name: req.body.name,
      password: req.body.password
    }
  }).then(([user, created]) => {
    if (created) {
      console.log('user created');
      // use passport: only let user in if login was successful
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Successfully signed up!'
      })(req, res);
    } else {
      console.log('email already exists');
      req.flash('error', 'Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(err => {
    console.log('Error occured creating user');
    console.log(err);
    req.flash('error:', err.message);
    res.redirect('/auth/signup');
  })
})

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Login Successful',
  failureFlash: 'Login Failed'
}));

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/');
});

module.exports = router;
