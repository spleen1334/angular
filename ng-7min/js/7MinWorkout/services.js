angular.module('7minWorkout')
    .factory('workoutHistoryTracker', ['$rootScope', 'localStorageService', function($rootScope, localStorageService) {
        var maxHistoryItems = 20; // max to track
        var storageKey = 'workoutHistory'; // za local storage
        var workoutHistory = localStorageService.get(storageKey) || []; // array of exercises
        var currentWorkoutLog = null; // current exercise
        var service = {};

        service.startTracking = function() {

            currentWorkoutLog = {
                startedOn: new Date().toISOString(),
                completed: false,
                exercisesDone: 0
            };

            if (workoutHistory.length >= maxHistoryItems) {
                workoutHistory.shift();
            }
            workoutHistory.push(currentWorkoutLog);

            // local storage
            localStorageService.add(storageKey, workoutHistory);
        };

        service.endTracking = function(completed) {
            currentWorkoutLog.completed = completed;
            currentWorkoutLog.endedOn = new Date().toISOString();
            currentWorkoutLog = null;

            // update localstorage (localstorage nema koncept update, ovo overwrituje postojece podatke)
            localStorageService.add(storageKey, workoutHistory);
        };

        service.getHistory = function() {
            return workoutHistory;
        };

        // Event subscriber
        $rootScope.$on('$routeChangeSuccess', function(e, args) {
            if (currentWorkoutLog) {
                service.endTracking(false); // if route changes end tracking
            }
        });

        // Custom event
        $rootScope.$on(appEvents.workout.exerciseStarted, function(e, args) {
            currentWorkoutLog.lastExercise = args.title; // args = exercisePlan.details
            currentWorkoutLog.exercisesDone++; // counter

            localStorageService.add(storageKey, workoutHistory);
        });

        return service;
    }]);

// Service
angular.module('7minWorkout')
    .value("appEvents", {
        workout: { exerciseStarted: "event:workout:exerciseStarted" }
    });

/*
Service - nemaju scope, jedino je dozvoljeno da se injectuje $rootScope

'When the DOM is
removed, the linked scope is also destroyed whereas services being singleton are
only destroyed when the app is refreshed.'
*/
