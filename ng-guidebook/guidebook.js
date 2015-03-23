// INICIJALIZACIJA MODULA APPLIKACIJE
var Guidebook = angular.module('Guidebook', ['ngRoute'])

// KONFIGURACIJA ROUTES
.config(function( $routeProvider ){
  $routeProvider
    .when('/', {
      controller: 'ChaptersController',
      templateUrl: 'view/chapters.html'
    })
    .when('/chapter/:chapterId', {
      controller: 'ChaptersController',
      templateUrl: 'view/chapters.html'
    })
    .when('/addNote/:chapterId', {
      controller: 'AddNoteController',
      templateUrl: 'view/addnote.html'
    })
    .when('/deleteNote/:chapterId/:noteId', {
      controller: 'DeleteNoteController',
      templateUrl: 'view/addnote.html'
    })
    .otherwise({redirectTo: '/'});
});

