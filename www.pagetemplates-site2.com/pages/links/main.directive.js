/* global define,angular */
define(['text!site2/pages/links/view.html',
  'css!site2/pages/links/style.css',
  'site2/pages/links/links.service'], function (tmpl) {
  'use strict';

  angular
    .module('ngGarfield')
    .lazy.directive('links', directive);

  directive.$inject = ['LinksService'];

  function directive(LinksService) {
    return {
      restrict: 'A',
      template: tmpl,
      controller: _controller,
      controllerAs: 'ctrlLinks'
    };

    function _controller () {
      var vm = this;

      LinksService.getLinks().then(function (data) {
        vm.links = data;
      })
    }
  }
});