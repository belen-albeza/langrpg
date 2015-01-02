'use strict';

var nconf = require('nconf');
var bcrypt = require('bcrypt');


// load config
nconf.argv().env().file({ file: 'config.json' });

exports.validateLogin = function (username, password, callback) {
  // get pre-approved accounts from conf
  var users = nconf.get('users');

  if (!users[username]) { // account doesn't exist
    callback(null, false);
  }
  else { // account exists -- check password
    bcrypt.compare(password, users[username], function (err, isValid) {
      callback(null, isValid, { username: username });
    });
  }
};
