angular.module('FundooDirectiveTutorial', [])

  // CTRL
  // VAR: rating
  // f(): saveRatingToServer
  .controller('FundooCtrl', function($scope, $window) {
    $scope.rating = 5;
    $scope.saveRatingToServer = function(rating) {
      $window.alert('Rating selected - ' + rating);
    };
  })

  // DIRECTIVE
  // $scope:
  //    - ratingValue = rating(ctrl) -OBJ
  //    - max = 10 (html) -VAL
  //    - readonly = za drugi custom <html> gde se samo prikazuje vrednost
  //    a nemoze se menjati -STRING
  //    - onRatingSelected = ctrl -F()
  .directive('fundooRating', function () {
    return {
      restrict: 'A',
      template: '<ul class="rating">' +
                  // NG-CLASS = dinamicki postavlja klasu
                  '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
                    '\u2605' +
                  '</li>' +
                '</ul>',
      scope: {
        ratingValue: '=', // vezan je za $scope.rating
        max: '=',
        readonly: '@',
        onRatingSelected: '&' // saveRatingToServer()
      },
      link: function (scope, elem, attrs) {

        // Updatuje stanje stars[]
        var updateStars = function() {
          scope.stars = [];
          // max = ng builtin
          for (var  i = 0; i < scope.max; i++) {
            // puni stars[] sa FILLED do ratingValue (npr 5 od 10 stars je
            // filled)
            scope.stars.push({filled: i < scope.ratingValue});
          }
        };

        // Selektovane stars EVENT CLICK
        scope.toggle = function(index) {
          // ukoliko je selektovan readonly@ element onda break
          if (scope.readonly && scope.readonly === 'true') {
            return;
          }

          // DO KOJE STAR JE SELEKTOVANO (6/10)
          scope.ratingValue = index + 1;
          scope.onRatingSelected({rating: index + 1}); // ctrl
        };

        // Prati ratingValue i kad god se izvrsi promena, start updateStars()
        scope.$watch('ratingValue', function(oldVal, newVal) {
          if (newVal) {
            updateStars();
          }
        });
      }
    };
  });
