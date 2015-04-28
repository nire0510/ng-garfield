(function (angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .lazy.service('PhotosService', PhotosService);

  PhotosService.$inject = ['$q'];

  function PhotosService($q) {
    var photos = [
        {
          name: 'facebook',
          path: 'images/facebook.png'
        },
        {
          name: 'google',
          path: 'images/google.png'
        },
        {
          name: 'linkedin',
          path: 'images/linkedin.png'
        },
        {
          name: 'pinterest',
          path: 'images/pinterest.png'
        },
        {
          name: 'tumblr',
          path: 'images/tumblr.png'
        },
        {
          name: 'twitter',
          path: 'images/twitter.png'
        }
      ],
      vm = this;

    vm.getPhotos = getPhotos;

    /**
     * Gets all photos
     * @returns {Promise} Promise which resolved to photos objects array
     */
    function getPhotos() {
      var deferred = $q.defer();

      deferred.resolve(photos);

      return deferred.promise;
    }
  }
})(window.angular);