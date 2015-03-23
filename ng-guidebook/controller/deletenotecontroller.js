// BRISANJE NOTE

Guidebook.controller('DeleteNoteController',
  function ($scope, $location, $routeParams, NoteModel) {
    var chapterId = $routeParams.chapterId;

    // model method
    NoteModel.deleteNote(chapterId, $routeParams.noteId);

    // nakon operacije vrati na chapter str
    $location.path('/chapter/' + chapterId);
 }
);
