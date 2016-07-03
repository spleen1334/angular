// MODULE
var weatherApp = angular.module('weatherApp', [
    'ngRoute',
    'ngResource'
]);

// ROUTES
weatherApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })
        .when('/forecast', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        })
        .when('/forecast/:days', {
            templateUrl: 'pages/forecast.html',
            controller: 'forecastController'
        });
});

// CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService) {

    $scope.city = cityService.city;

    $scope.$watch('city', function() {
        cityService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService', function($scope, $resource, $routeParams, cityService) {

    // VARS
    $scope.city = cityService.city;
    $scope.days = $routeParams.days || '2';

    // HTTP RESOURCE
    $scope.weatherAPI = $resource(
        'http://api.openweathermap.org/data/2.5/forecast/daily',
        { callback: 'JSON_CALLBACK' },
        { get: { method: 'JSONP' } }
    );

    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days});

    // LOG TEST
    console.log($scope.weatherResult);

    // METHODS
    // Ovo moze i preko units query parametra ($scope.units = 'metric')
    $scope.convertToCelsius = function(degK) {
        return Math.round(degK - 273.15);
    };

    $scope.convertToDate = function(dt) {
        return new Date(dt * 1000); // * 1000 jer api vraca u ms
    };

}]);

// SERVICES
weatherApp.service('cityService', function() {

    this.city = 'Belgrade, SRB';
});

// DIRECTIVES
weatherApp.directive('weatherReport', function() {
    return {
        restrict: 'E',
        templateUrl: 'pages/weatherReport.html',
        replace: true,
        scope: {
            weatherDay: '=',
            convertToStandard: '&',
            convertToDate: '&',
            dateFormat: '@'
        }
    };
});
