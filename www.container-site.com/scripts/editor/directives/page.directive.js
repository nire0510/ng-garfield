(function(angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .directive('page', page);

  function page() {
    return {
      templateUrl: 'scripts/editor/views/page.view.html',
      link: link,
      scope: {
        page: '='
      },
      restrict: 'E',
      replace: true
    };

    function link(scope, element, attrs) {

    }
  }

})(angular);