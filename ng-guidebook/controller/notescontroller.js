// OVO ASOCIRA NA BACKEND FUNKCIONISANJE
// jer se ove routes ne prikazuju

// KREIRAJ NOTE
Guidebook.controller('AddNoteController',
 function ($scope, $location, $routeParams, NoteModel) {
   var chapterId = $routeParams.chapterId;

   // vraca na prikaz notes
   $scope.cancel = function() {
     $location.path('/chapter/' + chapterId);

   };

   // Kreira novi note
   $scope.createNote = function() {
     NoteModel.addNote(chapterId, $scope.note.content);
     $location.path('/chapter/' + chapterId);

   };

 }
);

