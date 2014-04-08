var app = angular.module('example-app', ['ngResource', 'ngCachedResource']);

app.controller('ExampleController', function($scope, $resource, $cachedResource) {
  window.$resource = $resource;
  window.$cachedResource = $cachedResource;
  window.setColor = function(color) {
    $scope.color = color;
    $scope.$digest();
  };
});

