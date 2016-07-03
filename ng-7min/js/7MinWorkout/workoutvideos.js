'use strict';

angular.module('7minWorkout')
  .controller('WorkoutVideosController', ['$scope', '$modal', function ($scope, $modal) {
      $scope.playVideo = function (videoId) {

          $scope.pauseWorkout();

          // setup modal dialog za popup
          var dialog = $modal.open({
              templateUrl: 'youtube-modal',
              controller: VideoPlayerController,
              // $new(true) - kreira novi scope koji nasledjuje od f() koji ga je invokovao
              // isolated scope - scope koji NE nasledjuje od parent scope
              scope:$scope.$new(true), // novi isolated $scope (default je $rootScope)
              // ovo je da bi omogucio da se passuje nesto ka parent scope
              resolve: {
                  // video se injectuje u VideoPlayerController
                  video: function () {
                      return '//www.youtube.com/embed/' + videoId;
                  }
              },
              size: 'lg'
              // result['..'] je object indexer syntax zbog toga sto je finally reserved word
          }).result['finally'](function () {
              // kada se zatvori dialog ovaj promise (result[...] se pokrece)
              $scope.resumeWorkout();
          });
      };

      // We have declared the controller inline as it has no use outside the dialog.
      // $modalInstance (se vraca iz $modal.open) je takodje servis
      // resolve: video se auto passuje ka ovom ctrl
      var VideoPlayerController = function ($scope, $modalInstance, video) {
          $scope.video = video;
          $scope.ok = function () {
              $modalInstance.close();
          };
      };

      // $inject Property Annotation DI
    //   VideoPlayerController['$inject'] = ['$scope', '$modalInstance', 'video'];
      VideoPlayerController.$inject = ['$scope', '$modalInstance', 'video'];

      var init = function () {
      };
      init();
  }]);
