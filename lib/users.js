'use strict';

exports.validateLogin = function (username, password, callback) {
  callback(null, username === password, {});
};
