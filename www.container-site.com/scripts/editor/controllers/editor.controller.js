(function(angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .controller('EditorCtrl', EditorCtrl);

  EditorCtrl.$inject = ['$scope', '$log', '$document', 'GarfieldService', 'PagesService'];

  function EditorCtrl($scope, $log, $document, GarfieldService, PagesService) {
    var vm = this;

    vm.activeDirective = null;

    // Activate controller:
    activate();

    /**
     * Activation method.
     * Retrieves all pages for our editor.
     */
    function activate() {
      PagesService.getPages().then(function(data) {
        vm.pages = data;
      });
    }

    /**
     * Injects selected page into container
     * @param {object} page The clicked page object which contains all necessary data for the injection
     */
    vm.selectPage = function (page) {
      var scope = $scope.$new(); // call $scope.$new() if you want to use a cloned of the parent or $scope.$new(true) if you want to create isolated scope:
      $log.log('Injecting page %s from %s (%s)', page.directive, page.owner, requirejs.s.contexts._.config.paths[page.owner]);

      vm.activeDirective = page.directive;
      $document[0].title = page.title;
      GarfieldService.inject(page.owner, page.path, page.directive, scope, '#page-editor', false);
    }
  }
})(angular);