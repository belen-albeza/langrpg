'use strict';

var nconf = require('nconf');
// hapi + plugins
var Hapi = require('hapi');
var Good = require('good');
var AuthBasic = require('hapi-auth-basic');
// local
var users = require('./lib/users');
var site = require('./lib/site');

// -----------------------------------------------------------------------------
// setup server
// -----------------------------------------------------------------------------

// load config
nconf.argv().env().file({ file: 'config.json' });

// init server
var server = new Hapi.Server();
server.connection({
  host: nconf.get('host'),
  port: nconf.get('port')
});

// TODO: setup template engine

// -----------------------------------------------------------------------------
// hapi plugins
// -----------------------------------------------------------------------------

// logging plugin
server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      args: [{log: '*', response: '*'}]
    }]
  }
}, function (err) { if (err) throw err; });

// HTTP basic auth plugin
server.register(AuthBasic, function (err) {
  if (err) { throw err; }
  server.auth.strategy('simple', 'basic', { validateFunc: users.validateLogin })
});

// -----------------------------------------------------------------------------
// routes
// -----------------------------------------------------------------------------

server.route([{
  method: 'GET',
  path: '/',
  config: {
    auth: 'simple',
    handler: site.home
  }
}]);

// enable static files
server.route({
  path: '/{x*}',
  method: 'GET',
  handler: {
    directory: {
      path: './static',
      listing: false,
      index: false
    }
  }
});

// -----------------------------------------------------------------------------
// start server
// -----------------------------------------------------------------------------

server.start(function () {
  server.log('info', 'Server running at ' + server.info.uri);
});
