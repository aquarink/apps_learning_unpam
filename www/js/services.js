angular.module('starter.services', [])

.factory('learningService', function($http) { 
    var baseUrl = 'http://192.168.64.134/unpam_learn/data_ulearn/';
    // var baseUrl = 'http://json.pe.hu/data/';
    return {
        getAll: function() {
            return $http.get(baseUrl+'all_tutorial.php');
        },
        kelas: function(idUser) {
            return $http.get(baseUrl+'kelas.php?idUser='+idUser);
        },
        get_latihan: function(idUser) { 
            return $http.get(baseUrl+'all_latihan.php?idUser='+idUser);
        },
        update_read: function(idUser) { 
            return $http.get(baseUrl+'update_read_latihan.php?idUser='+idUser);
        },
        postLatihan: function(jawab, id_posting, id_dosen, id_user) {
            return $http.get(baseUrl+'post_latihan.php?jawab='+jawab+'&id_user='+id_user+'&id_dosen='+id_dosen+'&id_posting='+id_posting);
        },
        login: function(nim, pass) {
            return $http.get(baseUrl+'login.php?nim='+nim+'&pass='+pass);
        },
        latihan: function(nim, pass) {
            return $http.get(baseUrl+'login.php?nim='+nim+'&pass='+pass);
        },
        getId: function (idPost){
            return $http.get(baseUrl+'select.php?id='+idPost); 
        },
        listDosen: function (){
            return $http.get(baseUrl+'all_dosen.php'); 
        },
        create: function (datateman){
            return $http.post(baseUrl+'insert.php',datateman,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        update: function (datateman){
            return $http.post(baseUrl+'update.php',datateman,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        delete: function  (id){
            return $http.get(baseUrl+'delete.php?id='+id);
        }
    };
    
})

.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });
