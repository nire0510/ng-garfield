/* global define,angular */
define(['text!site1/pages/map/view.html',
  'css!site1/pages/map/style.css'], function (tmpl) {
  'use strict';

  angular
    .module('ngGarfield')
    .lazy.directive('map', directive);

  function directive() {
    return {
      restrict: 'A',
      template: tmpl,
      link: _link
    };
  }

  function _link (scope, element, attrs) {

  }
});