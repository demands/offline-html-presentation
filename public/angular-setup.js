var app = angular.module('example-app', ['ngResource', 'ngCachedResource']);

app.controller('ExampleController', function($resource, $cachedResource) {
  window.$resource = $resource;
  window.$cachedResource = $cachedResource;
});
