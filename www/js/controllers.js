var con = angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $interval, $cordovaSQLite, $ionicPopup) {
	$interval(function () {
		$scope.showData();
	}, 1000);

	$scope.showData = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_login').then(function (res) {
			$scope.logins = [];
			for (var i = 0; i < res.rows.length; i++) {
				$scope.logins.push(res.rows.item(i)); 
			}
			$scope.idUser = $scope.logins[0].id_user;
		}, function (err) {
			console.log(err.message);
		}); 
	};

	$scope.exit = function() {
		$ionicPopup.confirm({
	        title: 'System warning',
	        template: 'Apakah anda ingin keluar?'
	      }).then(function(res) {
	        if (res) {
	          ionic.Platform.exitApp();
	        }
 		})
	}

	$scope.date = new Date();
	$interval(function () {
		$scope.date = new Date();
	}, 60000);
}) 

.controller('home', function($scope, $state, $interval, $ionicHistory, $location, $ionicPlatform, $ionicLoading, $ionicModal, $timeout, $ionicNavBarDelegate, $cordovaSQLite, $ionicPopup, learningService) {
	// $ionicNavBarDelegate.showBackButton(false);
	$scope.viewlogin = function(){ 
		// alert("test");
		$scope.modal.show();
	}
	$scope.show_loading = function() {
		$ionicLoading.show({
			template: 'Cek Login....'
		});
	};
	$scope.hide_loading = function(){
		$ionicLoading.hide();
	};

	$ionicModal.fromTemplateUrl('templates/login.html', {
	    scope: $scope,
	    animation: 'slide-in-up',
	    hardwareBackButtonClose: false
	}).then(function(modal) {
		$scope.modal = modal;
	});
 
	// $scope.show_loading();

	$timeout(function () {
		$scope.cek_login();
		$scope.hide_loading(); 
		
	}, 1000); 

	$interval(function () {
		$scope.updateLatihan();
	}, 3000);

	$ionicPlatform.registerBackButtonAction(function(event) {
	    if (true) { // your check here
	    	if ($state.is('app.home')) {
	    		$ionicPopup.confirm({
			        title: 'System warning',
			        template: 'Apakah anda ingin keluar?'
			      }).then(function(res) {
			        if (res) {
			          ionic.Platform.exitApp();
			        }
	     		})
	    	} else {
	    		// $rootScope.$viewHistory.backView.go()
	    		$ionicHistory.goBack(-1);
	    	}
	      
	    }
	  }, 100);

	$scope.cek_login = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_login').then(function (res) {
			$scope.datas = []; 
			if(res.rows.length <= 0) {
				// $state.go('app.home');
				$scope.modal.show();
			} else {
				$scope.modal.hide();
				$scope.idUser = $scope.logins[0].id_user;
			}
			$scope.hide_loading(); 
		}, function (err) { 
			$ionicLoading.hide(); 
			console.log(err.message);
		});
	}

	$scope.data = {};
	$scope.submit = function(){ 
		var nim = $scope.data.nim;
		var pass = $scope.data.pass;

		if((nim == null) || (pass == null)) {
			$ionicPopup.alert({
				title: "warning",
				template: "Harap isi semua inputan",
				okText: 'Ok',
				okType: 'button-positive'
			});
		} else {
			learningService.login(nim, pass).success(function(data) { 
				var log = []; 
				angular.forEach(data, function(value, key) {
					var status = value['status'];

					if(status == 1) {
						var query = "INSERT INTO tbl_login(id_user,nim,nama,alamat,email) VALUES (?,?,?,?,?)";
						log.push(value[key, 'id_user']);
						log.push(value[key, 'nim']);
						log.push(value[key, 'nama']);
						log.push(value[key, 'alamat']);
						log.push(value[key, 'email']);
						var nama 	= value['nama'];
						var id_user = value['id_user'];
						$cordovaSQLite.execute(db, query, log).then(function () {
							$ionicPopup.alert({
								title: "Hello",
								template: "Selamat Datang "+nama,
								okText: 'Ok',
								okType: 'button-positive'
							});
							$scope.idUser = id_user;
							$state.go('app.home');
							$scope.modal.hide();
						}, function (err) {
							console.log(err.message);
							alert("error");
						});
					} else {
						$ionicPopup.alert({
							title: "Warning",
							template: "data tidak ditemukan, harap periksa user dan password anda.",
							okText: 'Ok',
							okType: 'button-positive'
						});
					}
					
				});

			});
		}     
	};

	$scope.updateLatihan = function() {
		if(window.Connection) {
			if(navigator.connection.type != Connection.NONE) {
				$scope.delete();

				learningService.kelas($scope.idUser).success(function(data) {
					var log = [];
					angular.forEach(data, function(value, key) {
						var query = "INSERT INTO tbl_dosen(id_dosen, nama, matakuliah, no_hp, email, alamat) VALUES (?,?,?,?,?,?)";
						log.push(value[key, 'id_dosen']);
						log.push(value[key, 'nama_dosen']);
						log.push(value[key, 'matakuliah']);
						log.push(value[key, 'hanphone']);
						log.push(value[key, 'email']);
						log.push(value[key, 'alamat']);
					  	$cordovaSQLite.execute(db, query, log).then(function () {
					  		$scope.getList();
						}, function (err) {
						    console.log(err.message);
						    alert("error");
						});
							log = [];
					});
				})

				learningService.getAll().success(function(data) {
					var modul = [];
					angular.forEach(data, function(value, key) {
						var query = "INSERT INTO tbl_tutor(id_json,img,title,intro,isi,kategori,nama_dosen, tanggal, latihan, id_dosen) VALUES (?,?,?,?,?,?,?,?,?,?)";
						modul.push(value[key, 'id']);
						modul.push(value[key, 'img']);
						modul.push(value[key, 'title']);
						modul.push(value[key, 'intro']);
						modul.push(value[key, 'isi']);
						modul.push(value[key, 'kategori']);
						modul.push(value[key, 'nama_dosen']);
						modul.push(value[key, 'tanggal']);
						modul.push(value[key, 'latihan']);
						modul.push(value[key, 'id_dosen']);
						// alert(value[key, 'isi']);
					  	$cordovaSQLite.execute(db, query, modul).then(function () {
						}, function (err) {
					    	console.modul(err.message);
					    	alert("error");
						});

						modul = [];
					});
				})

				learningService.get_latihan($scope.idUser).success(function(data) {
					var latihan = [];
					angular.forEach(data, function(value, key) {
						var query = "INSERT INTO tbl_latihan(id_latihan, id_posting, id_mahasiswa, id_dosen, jawaban, koreksi, tanggal, read_user) VALUES (?,?,?,?,?,?,?,?)";
						latihan.push(value[key, 'id_latihan']);
						latihan.push(value[key, 'id_posting']);
						latihan.push(value[key, 'id_mahasiswa']);
						latihan.push(value[key, 'id_dosen']);
						latihan.push(value[key, 'jawaban']);
						latihan.push(value[key, 'koreksi']);
						latihan.push(value[key, 'tanggal']);
						latihan.push(value[key, 'read_by_user']);

					  	$cordovaSQLite.execute(db, query, latihan).then(function () {
						}, function (err) {
					    	console.latihan(err.message);
					    	alert("error update latihan");
						});

						latihan = []; 
					});  
				}).finally(function() {
						$scope.getList();
				});
			}
		}
		
	};

	$scope.logout = function(){
		$ionicPopup.alert({
			title: "Logout",
			template: "Anda ingin Logout?",
			buttons: [
				{ text: 'no', 
					onTap: function(e) { 
					} 
				},
				{
					text: 'yes',
					type: 'button-positive',
					onTap: function(e) {
						$scope.runLogout();
					}
				},
			]
		});
	};

	$scope.getList = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_latihan where read_user = "0" ').then(function (res) {
			$scope.cek_update = [];
			for (var i = 0; i < res.rows.length; i++) {
				$scope.cek_update.push(res.rows.item(i));
			}
			if(($scope.cek_update.length == null) || ($scope.cek_update.length < 1)){
				$scope.jumlah_update = 0;

			} else {
				$scope.jumlah_update = 1;
			}
		}, function (err) {
			console.log(err.message);
		});

		$timeout(function () {
			// if(($scope.cek_update.length == null) || ($scope.cek_update.length < 1)){
			// 	$scope.jumlah_update = 0;

			// } else {
			// 	$scope.jumlah_update = 1;
			// }
		}, 1000);
	};	

	$scope.runLogout = function() {
		$cordovaSQLite.execute(db, 'delete from tbl_login');		
		$ionicNavBarDelegate.showBackButton(false);
		// $state.go('app.login');
		$scope.modal.show();
	}

	$scope.delete = function(){
		$cordovaSQLite.execute(db, 'delete from tbl_dosen');
		$cordovaSQLite.execute(db, 'delete from tbl_tutor');
		$cordovaSQLite.execute(db, 'delete from tbl_latihan');
	};
	
}) 


