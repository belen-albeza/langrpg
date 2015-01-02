'use strict';

exports.home = function (request, reply) {
  reply.view('home', {
    user: request.auth.credentials
  });
};
