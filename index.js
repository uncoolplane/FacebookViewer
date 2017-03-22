var express = require('express');
var path = require('path');
var app = express();
var port = 8001;

var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var session = require('express-session');
var secrets = require('./secret');

app.use(session({
  secret: secrets.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new FacebookStrategy({
  clientID: secrets.clientID,
  clientSecret: secrets.clientSecret,
  callbackURL: 'http://localhost:'+ port + '/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

//call facebook app for authentication --just middleware here, no callback
app.get('/auth/facebook', passport.authenticate('facebook'));

//facebook returns to this url to do something after authentication
//pass string, middleware, callback function
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
     successRedirect: '/',
     failureRedirect: '/auth/facebook'
  }),
  function(req, res, next) {
    console.log(req, res);
  }
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
})

app.listen(port, function() {
    console.log('Listening on port', port, 'for aliens');
})
