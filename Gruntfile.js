module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    connect: {
      main: {
        options: {
          keepalive: true,
          host: 'container-site.com',
          port: 9000,
          base: 'www.container-site.com',
          open :true
        }
      },
      site1: {
        options: {
          keepalive: true,
          host: 'pagetemplates-site1.com',
          port: 9001,
          base: 'www.pagetemplates-site1.com',
          middleware: _allowCrossOrigin
        }
      },
      site2: {
        options: {
          keepalive: true,
          host: 'pagetemplates-site2.com',
          port: 9002,
          base: 'www.pagetemplates-site2.com',
          middleware: _allowCrossOrigin
        }
      }
    }
  });

  function _allowCrossOrigin (connect, options, middlewares) {
    middlewares.unshift(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', '*');
      next();
    });

    return middlewares;
  }

  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['connect']);

};
