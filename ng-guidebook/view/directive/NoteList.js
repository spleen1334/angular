// DIREKTIVE
Guidebook.directive('gbNoteList', function() {
  return {
    // RESTRICT = gde se renderuje
    // E > element <gb-note-list>
    // C > class <div class="gb-note-list">
    // M > comment <!-- directive:gb-note-list -->
    restrict: 'E',
    templateUrl: 'view/directives/notelist.html',
    // $scope restrikcija
    // Simboli:
    // = - pass value as it is (za f() i [])
    // @ - render as string
    // & - render as expression
    scope: {
      show: '=show', // ng-show ?
      notes: '=', // notes=chapter.notes
      orderValue: '@orderBy', // ng filter | orderBy: id ?
      onDelete: '=deleteNoteHandler' // ctrl.onDelete()
    }

  };

});
