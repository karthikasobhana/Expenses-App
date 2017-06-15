expenseApp = angular.module('expenseApp', ['ngRoute', 'ngMaterial'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/partials/dashboard.html',
        controller: 'mainCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });
