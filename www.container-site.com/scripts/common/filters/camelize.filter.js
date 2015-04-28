(function (angular) {
  'use strict';

  angular
    .module('ngGarfield')
    .filter('camelize', camelize);

  /**
   * Converts directive markup names into their names as written in $injector (e.g. turn ng-my-directive into ngMyDirective)
   * @returns {Function}
   */
  function camelize () {
    return function(input) {
      return input.replace(/(-[a-z])/g, function (strToken) {
        return strToken.substr(1).toUpperCase();
      });
    };
  }
})(window.angular);