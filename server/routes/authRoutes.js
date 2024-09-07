const express = require('express');
const passport = require('passport');
const { googleAuth, getCurrentUser, loginSuccess, logout } = require('../controllers/authController');
const router = express.Router();

// start the OAuth Process
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

// Handle the callback after Google had authenticated the user:
router.get('/google/callback',
    passport.authenticate('google',{ failureRedirect: '/'}),
    loginSuccess
);

// Get the current user(authenticated route):
router.get('/current',passport.authenticate('jwt',{session:false}),getCurrentUser);

// logout:
router.get('/logout',logout);

module.exports=router;