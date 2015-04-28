/* global require, requirejs */
(function(angular) {
  'use strict';

  angular.module('ngGarfield', ['ngRoute'])
    .config(['$routeProvider', '$provide', '$compileProvider', '$controllerProvider', '$filterProvider',
      function($routeProvider, $provide, $compileProvider, $controllerProvider, $filterProvider) {
        // Router:
        $routeProvider.
          when('/editor', {
            templateUrl: 'scripts/editor/views/editor.view.html',
            controller: 'EditorCtrl',
            controllerAs: 'editorCtrl'
          }).
          otherwise({
            redirectTo: '/editor'
          });

        // Almost the most important part here -
        // We need to keep references to AngularJS compilers, so we can use them later to compile external components lazily EVEN AFTER page fully loaded:
        angular.module('ngGarfield').lazy = {
          directive: function () {
            $compileProvider.directive.apply(null, arguments);
          },
          controller: function () {
            $controllerProvider.register.apply(null, arguments);
          },
          factory: function () {
            $provide.factory.apply(null, arguments);
          },
          service: function () {
            $provide.service.apply(null, arguments);
          },
          filter: function () {
            $filterProvider.register.apply(null, arguments);
          }
        };
      }
    ])
    .run(function() {
      // The first two rows are the paths of the css & text requirejs plugins, which are required for loading directives templates & stylesheets.
      // The last two rows are paths of the "external websites" which will our lazy resources will be later injected from:
      var _paths = {
        // Remove document.location.origin in your project!!!
        text: '/bower_components/requirejs-text/text',
        css: '/bower_components/require-css/css.min',
        site1: 'http://localhost:9001',
        site2: 'http://localhost:9002'
      };

      // Configure RequireJS - paths above and timeour:
      require.config({
        paths: _paths,
        waitSeconds: 15
      });

      // Allow cross origin requests of HTML files (text plugin adds *.js extension to files on cross origin requests):
      requirejs.config({
        config: {
          text: {
            useXhr: function (url, protocol, hostname, port) {
              return true;
            }
          }
        }
      });
    });

  // Manual AngularJS bootstrapping:
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['ngGarfield']);
  });
})(window.angular);