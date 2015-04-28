/* global define,angular */
define(['text!site1/pages/aboutus/view.html',
  'css!site1/pages/aboutus/style.css'], function (tmpl) {
  'use strict';

  angular
    .module('ngGarfield')
    .lazy.directive('aboutus', directive);

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