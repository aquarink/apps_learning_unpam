// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB("unpam_db11.db");
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS person (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,addr TEXT,tlp TEXT)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_tutor (id INTEGER PRIMARY KEY AUTOINCREMENT, id_json INTEGER, img VARCHAR, title VARCHAR, intro TEXT, isi TEXT, kategori VARCHAR, id_dosen INTEGER, nama_dosen VARCHAR, tanggal DATE, latihan TEXT)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_login (id INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, nim INTEGER, nama VARCHAR, tlp TEXT, alamat text, email VARCHAR)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_latihan (id INTEGER PRIMARY KEY AUTOINCREMENT, id_latihan INTEGER, id_posting INTEGER, id_mahasiswa INTEGER, id_dosen INTEGER, jawaban TEXT, koreksi TEXT, tanggal DATE, read_user INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tbl_dosen (id INTEGER PRIMARY KEY AUTOINCREMENT, id_dosen INTEGER, nama VARCHAR, matakuliah VARCHAR, no_hp VARCHAR, email VARCHAR, alamat text)");
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'profile'
      }
    }
  })

  .state('app.matakuliah', {
    url: '/matakuliah/:idUser',
    views: {
      'menuContent': {
        templateUrl: 'templates/matakuliah.html',
        controller: 'matakuliah'
      }
    }
  })

  .state('app.detail_matkul', {
    url: '/detail_matkul/:idPost',
    views: {
      'menuContent': {
        templateUrl: 'templates/detail_matkul.html',
        controller: 'detailDosen'
      }
    }
  })

  .state('app.modul_training', {
    url: '/modul_training/:idPost',
    views: {
      'menuContent': {
        templateUrl: 'templates/modul_training.html',
        controller: 'modulTraining'
      }
    }
  })

  .state('app.deteil_post', {
    url: '/home/:idPost/:idDosen/:idUser',
    views: {
      'menuContent': {
        templateUrl: 'templates/deteil_post.html',
        controller: 'detailPost'
      }
    }
  })

  .state('app.all_tutorial', {
    url: '/all_tutorial',
    views: {
      'menuContent': {
        templateUrl: 'templates/all_tutorial.html',
        controller: 'allPost'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'login'
      }
    }
  }) 

  .state('app.update', {
    url: '/update',
    views: {
      'menuContent': {
        templateUrl: 'templates/view_update.html',
        controller: 'view_update'
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'home'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
