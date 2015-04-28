(function(angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .service('PagesService', PagesService);

  PagesService.$inject = ['$q'];

  function PagesService($q) {
    var pages = [
        {
          directive: 'aboutus',
          path: 'pages/aboutus/main.directive.js',
          title: 'About Us',
          owner: 'site1',
          color: '#6ECFF6'
        },
        {
          directive: 'map',
          path: 'pages/map/main.directive.js',
          title: 'Map',
          owner: 'site1',
          color: '#F49AC2'
        },
        {
          directive: 'photos',
          path: 'pages/photos/main.directive.js',
          title: 'Photos',
          owner: 'site2',
          color: '#C4DF9B'
        },
        {
          directive: 'links',
          path: 'pages/links/main.directive.js',
          title: 'Links',
          owner: 'site2',
          color: '#FF6961'
        }
      ],
      vm = this;

    vm.getPages = getPages;

    /**
     * Gets all pages
     * @returns [{}] Promise which resolved to pages objects array
     */
    function getPages() {
      var deferred = $q.defer();

      deferred.resolve(pages);

      return deferred.promise;
    }
  }
})(angular);