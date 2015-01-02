'use strict';

var nconf = require('nconf');
var bcrypt = require('bcrypt');
var level = require('levelup');

// load config
nconf.argv().env().file({ file: 'config.json' });

var db = level('./db/users', {
  createIfMissing: true,
  valueEncoding: 'json'
});

// return an existing user -and create a new one if necessary- from the DB
var getOrCreateUser = function (username, callback) {
  db.get(username, function (err, user) {
    if (err) { // user not found - create a new one
      user = { username: username, xp: 0 };
      db.put(username, user, function (err) {
        if (err) {
          callback(null);
        }
        else {
          callback(user);
        }
      })
    }
    else {
      callback(user);
    }
  });
};

exports.validateLogin = function (username, password, callback) {
  // get pre-approved accounts from conf
  var users = nconf.get('users');

  if (!users[username]) { // account doesn't exist
    callback(null, false);
  }
  else { // account exists -- check password
    bcrypt.compare(password, users[username], function (err, isValid) {
      getOrCreateUser(username, function (user) {
        callback(null, isValid, user || {});
      });
    });
  }
};
