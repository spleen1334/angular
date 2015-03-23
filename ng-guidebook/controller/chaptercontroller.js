Guidebook.controller('ChaptersController',
  // $location = browser url (window.location)
  function ($scope, $location, $routeParams, ChapterModel, NoteModel) {
    var chapters = ChapterModel.getChapters();

    // attach notes na chapter []
    for (var i=0; i<chapters.length; i++) {
      chapters[i].notes =
        NoteModel.getNotesForChapter(chapters[i].id);
    }

    // Ubaci chapters kao 2d array u $scope
    $scope.chapters = chapters;
    $scope.selectedChapterId = $routeParams.chapterId; // CURRENT CHAPTER za VIEW

    $scope.onDelete = function(noteId) {
      var confirmDelete = confirm('Are you sure you want to delete this note?');
        if (confirmDelete) {
          // $location.path
          // Return path of current url when called without any parameter.
          // Change path when called with parameter and return $location.
          // Slicno kao redirect u php(samo ovde menja samo url link, sve se
          // i dalje odvija na 1 str)
          $location.path('/deleteNote/' + $routeParams.chapterId +
                        '/' + noteId);
        }
    };

  }
);
