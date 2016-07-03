// MAIN MODULE
angular.module('app', ['ngRoute', 'ngSanitize', '7minWorkout', 'mediaPlayer', 'ui.bootstrap', 'ngAnimate', 'LocalStorageModule'])
    .config(function($routeProvider, $sceDelegateProvider) {
        $routeProvider.when('/start', { templateUrl: 'partials/start.html' });
        $routeProvider.when('/workout', { templateUrl: 'partials/workout.html', controller: 'WorkoutController' });
        $routeProvider.when('/finish', { templateUrl: 'partials/finish.html' });
        $routeProvider.otherwise({ redirectTo: '/start'});

        // $routeProvider.html5Mode(true); // ukoliko nezelimo da se vidi #/url

        // StrictContextualEscaping, zastita ovde mora whitelist spoljnih resource
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*.youtube.com/**'
        ]);
    });

// SUB-MODULE
angular.module('7minWorkout', []);
