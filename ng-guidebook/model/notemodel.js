Guidebook.service('NoteModel', function() {

  // NOTES ZA ODREDJENI CHAPTER
  this.getNotesForChapter = function(chapterId) {
    var chapter = JSON.parse(window.localStorage.getItem(chapterId));

    if (!chapter) {
      return [];
    }
    return chapter.notes;
  };


  // KREIRAJ NOVI NOTE
  this.addNote = function(chapterId, noteContent) {
    var now = new Date();
    var note = {
      content: noteContent,
      id: now
    };

    var chapter = JSON.parse(window.localStorage.getItem(chapterId));
    if (!chapter) {
      chapter = {
        id: chapterId,
        notes: []

      };
    }

    // Ubaci notes u array && Localstorage
    chapter.notes.push(note);
    window.localStorage.setItem(chapterId, JSON.stringify(chapter));

  };


  // DELETE NTOE
  this.deleteNote = function(chapterId, noteId) {
    var chapter = JSON.parse(window.localStorage.getItem(chapterId));

    if (!chapter || !chapter.notes) {
      return;
    }

    for (var i=0; i<chapter.notes.length; i++) {
      if (chapter.notes[i].id === noteId) {
        // izbaci iz array
        chapter.notes.splice(i, 1);
        // ubaci izmenjeni array u LS
        window.localStorage.setItem(chapterId, JSON.stringify(chapter));
        return;
      }

    }

  };

});
