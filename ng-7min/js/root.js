'use strict';

angular.module('app')
  // ponovo koristimo ui.bootstrap (angularUI)
  .controller('RootController', ['$scope', '$modal', function ($scope, $modal) {
      $scope.showWorkoutHistory = function () {
          var dialog = $modal.open({
              templateUrl: 'partials/workout-history.html',
              controller: WorkoutHistoryController,
              size: 'lg'
          });
      };

      //  Inline ctrl definition
      var WorkoutHistoryController = function ($scope, $modalInstance, workoutHistoryTracker) {
          $scope.search = {};
          $scope.search.completed = '';
          $scope.history = workoutHistoryTracker.getHistory();

          $scope.ok = function () {
              $modalInstance.close();
          };
      };

      // inject property annotation DI
      WorkoutHistoryController['$inject'] = ['$scope', '$modalInstance', 'workoutHistoryTracker'];

  }]);
