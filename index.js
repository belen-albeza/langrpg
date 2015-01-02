var nconf = require('nconf');
var Hapi = require('hapi');
var Good = require('good');

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

// -----------------------------------------------------------------------------
// routes
// -----------------------------------------------------------------------------

server.route([{
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Waka waka');
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
