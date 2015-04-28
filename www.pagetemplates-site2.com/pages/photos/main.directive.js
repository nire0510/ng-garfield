/* global define,angular */
define(['text!site2/pages/photos/view.html',
  'css!site2/pages/photos/style.css',
  'site2/pages/photos/photos.service'], function (tmpl) {
  'use strict';

  angular
    .module('ngGarfield')
    .lazy.directive('photos', directive);

  directive.$inject = ['PhotosService'];

  function directive(PhotosService) {
    return {
      restrict: 'A',
      template: tmpl,
      controller: _controller,
      controllerAs: 'ctrlPhotos'
    };

    function _controller () {
      var vm = this;

      PhotosService.getPhotos().then(function (data) {
        vm.photos = data;
      })
    }
  }
});