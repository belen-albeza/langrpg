'use strict';

exports.home = function (request, reply) {
  reply('Waka waka~, ' + request.auth.credentials.username);
};
