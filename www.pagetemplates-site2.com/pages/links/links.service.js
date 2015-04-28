(function (angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .lazy.service('LinksService', LinksService);

  LinksService.$inject = ['$q'];

  function LinksService($q) {
    var links = [
        {
          name: 'AngularJS Homepage',
          url: 'https://angularjs.org/'
        },
        {
          name: 'GruntJS',
          url: 'http://gruntjs.com/'
        },
        {
          name: 'Foundation',
          url: 'http://foundation.zurb.com/'
        },
        {
          name: 'NodeJS',
          url: 'https://nodejs.org/'
        },
        {
          name: 'Polymer',
          url: 'https://www.polymer-project.org/0.5/'
        },
        {
          name: 'Shraga',
          url: 'http://shraga.nirelbaz.com/'
        },
        {
          name: 'LinkedIn',
          url: 'http://il.linkedin.com/in/nire0510'
        }
      ],
      vm = this;

    vm.getLinks = getLinks;

    /**
     * Gets all links
     * @returns {Promise} Promise which resolved to links objects array
     */
    function getLinks () {
      var deferred = $q.defer();

      deferred.resolve(links);

      return deferred.promise;
    }
  }
})(window.angular);