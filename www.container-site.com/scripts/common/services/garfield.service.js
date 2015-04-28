/* global requirejs */
(function(angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .service('GarfieldService', GarfieldService);

  GarfieldService.$inject = ['$compile', '$injector', '$filter'];

  function GarfieldService($compile, $injector, $filter) {
    /**
     * Generic directive compiler
     * @param {string} strPageOwner Name of page owner. Will be later translated to owner's website base URL
     * @param {string} strDirectivePath Path of directive file
     * @param {string} strDirectiveName Directive name as registered in file
     * @param {scope} objScope AngularJS scope which will be attached to the compiled directive
     * @param {string} strContainerSelector Selector of the container element
     * @param {boolean} blnAppend Set true if you wish to append the compiled directive to the container or false if you want to set it as the containers only content
     */
    this.inject = function (strPageOwner, strDirectivePath, strDirectiveName, objScope, strContainerSelector, blnAppend) {
      var strDirectiveFileFullPath = [requirejs.s.contexts._.config.paths[strPageOwner], strDirectivePath].join('/');

      // We add directiveFolder to the scope, so that directives will be able to use their original URLs to add external resources, such as images:
      objScope.directiveFolder = strDirectiveFileFullPath.substr(0, strDirectiveFileFullPath.lastIndexOf('/'));

      // Check if directive already exists in Angular's compiler:
      if ($injector.has($filter('camelize')(strDirectiveName) + 'Directive')) {
        // If it exists, call injector:
        compile();
      }
      else {
        // If it doesn't, load it asynchronously and then inject it into page:
        require([strDirectiveFileFullPath], function () {
          compile();
        });
      }

      function compile () {
        var $directive = angular.element('<div ' + strDirectiveName + '></div>'),
          $container = angular.element(document.querySelector(strContainerSelector));

        // Compile the directive and attach its scope:
        $compile($directive)(objScope);
        // Append or set directive's content in container:
        blnAppend ? $container.append($directive) : $container.empty().append($directive);
      }
    }
  }
})(angular);