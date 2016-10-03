// controller AllPost
con.controller('allPost', function($scope, $timeout, $state, $ionicPopup, $cordovaSQLite, learningService, $ionicLoading){

	$scope.show_loading = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	$scope.hide_loading = function(){
		$ionicLoading.hide();
	};

	$scope.delete = function(){
		$cordovaSQLite.execute(db, 'delete from tbl_tutor');
		$scope.getList();
		alert("delete");
	};

	$scope.show_loading();
	$timeout(function () {
		$scope.addtosqlite = function() {
			if(window.Connection) {
				if(navigator.connection.type == Connection.NONE) {
					$ionicPopup.alert({
						title: "Information",
						template: "update gagal, mohon periksa koneksi internet anda.",
						okText: 'Ok',
						okType: 'button-positive'
					});
				} else {
					$scope.delete();
					learningService.getAll().success(function(data) {
					// $scope.artists= data;
					var log = [];
					angular.forEach(data, function(value, key) {
							// this.push(key + ' : ' + value);
							//img VARCHAR, title VARCHAR, intro TEXT, isi TEXT, kategori VARCHAR, nama_dosen VARCHAR,  view INTEGER
							var query = "INSERT INTO tbl_tutor(id_json,img,title,intro,isi,kategori,nama_dosen, tanggal, latihan) VALUES (?,?,?,?,?,?,?,?,?)";
							log.push(value[key, 'id']);
							log.push(value[key, 'img']);
							log.push(value[key, 'title']);
							log.push(value[key, 'intro']);
							log.push(value[key, 'isi']);
							log.push(value[key, 'kategori']);
							log.push(value[key, 'nama_dosen']);
							log.push(value[key, 'tanggal']);
							log.push(value[key, 'latihan']);
						  	// alert(value[key, 'title']);
						  // alert(log);
						  	$cordovaSQLite.execute(db, query, log).then(function () {
						  		$scope.getList();
							}, function (err) {
						    console.log(err.message);
						    alert("error");
							});
							log = [];
						});
						// alert();
					})
					
				}
			}
			$scope.$broadcast('scroll.refreshComplete');
		}
		// $scope.delete();
		$scope.addtosqlite();
		$scope.getList();
		$scope.hide_loading();
		// alert("load");
	}, 3000);

	$timeout(function () {
		// $scope.delete();
		// alert();
	}, 1000);

	$scope.getList = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_tutor').then(function (res) {
			$scope.posts = [];
			for (var i = 0; i < res.rows.length; i++) {
					$scope.posts.push(res.rows.item(i));

			}

		}, function (err) {
			console.log(err.message);
		});
	};
		
		$scope.reload = function (){
			$state.go('app.home');
		};
}) 

// controller Detail Posting
con.controller('detailPost', function($scope, $state, $stateParams, $cordovaSQLite, $ionicPopup, $sce, learningService){


	$scope.refreshItems = function(){
		alert("refreshItems");
	};
	$scope.delete = function(){
		$cordovaSQLite.execute(db, 'delete from tbl_latihan');
		// $scope.getList();
	};

	$scope.data_modul = function() {
		// alert($stateParams.idPost);
		// $cordovaSQLite.execute(db, 'SELECT * FROM tbl_tutor where id_json = '+ $stateParams.idPost).then(function (res) { 
		$cordovaSQLite.execute(db, 'SELECT *, tbl_dosen.`nama` as nama_dosen FROM tbl_tutor LEFT JOIN tbl_latihan ON tbl_tutor.`id_json` = tbl_latihan.`id_posting` LEFT JOIN tbl_dosen ON tbl_latihan.`id_dosen` = tbl_dosen.`id_dosen` WHERE tbl_tutor.`id_json` =  '+ $stateParams.idPost).then(function (res) {
			$scope.posts = [];
			for (var i = 0; i < res.rows.length; i++) {
					$scope.isi = $sce.trustAsHtml(res.rows.item(i).isi);
					$scope.posts.push(res.rows.item(i));
			}
		}, function (err) {
			console.log(err.message);
		});
		$scope.$broadcast('scroll.refreshComplete');
	};

	$scope.update_latihan = function(){
		learningService.get_latihan($stateParams.idUser).success(function(data) {
		// $scope.artists= data;
			var latihan = [];
			angular.forEach(data, function(value, key) {
				// this.push(key + ' : ' + value);
				//img VARCHAR, title VARCHAR, intro TEXT, isi TEXT, kategori VARCHAR, nama_dosen VARCHAR,  view INTEGER
				var query = "INSERT INTO tbl_latihan(id_latihan, id_posting, id_mahasiswa, id_dosen, jawaban, koreksi, tanggal, read_user) VALUES (?,?,?,?,?,?,?,?)";
				latihan.push(value[key, 'id_latihan']);
				latihan.push(value[key, 'id_posting']);
				latihan.push(value[key, 'id_mahasiswa']);
				latihan.push(value[key, 'id_dosen']);
				latihan.push(value[key, 'jawaban']);
				latihan.push(value[key, 'koreksi']);
				latihan.push(value[key, 'tanggal']);
				latihan.push(value[key, 'read_by_user']);

				// alert(value[key, 'isi']);
			  	$cordovaSQLite.execute(db, query, latihan).then(function () {
			  		// $scope.getList();
				}, function (err) {
			    	console.latihan(err.message);
			    	alert("error");
				});

				latihan = []; 
			}); 
			// alert();
		})
	};

	// $scope.idUser = $stateParams.idUser;
	// $scope.idDosen= $stateParams.idDosen;
	// alert($stateParams.idUser);

	// $scope.data_latihan = function() {
	// 	$cordovaSQLite.execute(db, 'SELECT * FROM tbl_latihan where id_posting = '+ $stateParams.idPost + ' and id_dosen = ' + $stateParams.idDosen).then(function (res) {
	// 		$scope.latihans = [];
	// 		for (var i = 0; i < res.rows.length; i++) {
	// 				$scope.latihans.push(res.rows.item(i));
	// 		}
	// 	}, function (err) {
	// 		console.log(err.message);
	// 	});
	// };


	$scope.data = {};

	$scope.data.iddosen 	= $stateParams.idDosen;
	$scope.data.iduser 		= $stateParams.idUser;
	$scope.data.idposting 	= $stateParams.idPost;

	$scope.submit = function(){ 
		var jawab 		= $scope.data.jawab;
		var id_dosen 	= $scope.data.iddosen;
		var id_user 	= $scope.data.iduser;
		var id_posting 	= $scope.data.idposting;

		// alert(jawab+" == "+ id_dosen +" == "+ id_user +" == "+ id_posting);

		if(window.Connection) {
			if(navigator.connection.type == Connection.NONE) {
				$scope.hide_loading();
				$ionicPopup.alert({
					title	: "Information",
					template: "update gagal, mohon periksa koneksi internet anda.",
					okText	: 'Ok',
					okType	: 'button-positive'
				});
			} else {
				
				learningService.postLatihan(jawab, id_posting, id_dosen, id_user).success(function(data) {
					// $scope.artists= data;
					// var log = [];
					// alert(data); 
					angular.forEach(data, function(value, key) {
						// alert(); 
							// log = [];
						$ionicPopup.alert({
							title	: "Information",
							template: value[key, 'status'],
							okText	: 'Ok',
							okType	: 'button-positive'
						});
					});
				}).finally(function() {
						// alert(); 
						$scope.delete();
						$scope.update_latihan();
						$scope.data_modul();
						
						// $window.location.reload(true);
				});

				// $timeout(function () {
				// 	$state.go($state.current, {}, { reload: true });
				// 	alert();
				// }, 2000);
				
			}
			// $scope.refreshItems();
		}
		// $scope.data_modul();
		// $state.go('app.profile');
	}

	$scope.data_modul();
})

// controller List Dosen
con.controller('matakuliah', function($scope, $stateParams, $ionicNavBarDelegate, $ionicLoading, $state, $interval, $timeout, $cordovaSQLite, learningService, $ionicPopup){
	$ionicNavBarDelegate.showBackButton(true);

	$scope.show_loading = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	$scope.hide_loading = function(){
		$ionicLoading.hide();
	};

	$scope.show_loading();
	$timeout(function () {
		var artists = [];

		$scope.update();
		$scope.getList();
		$scope.hide_loading();
		
	}, 1000);
	
	$scope.getList = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_dosen').then(function (res) {
			$scope.dosens = [];
			for (var i = 0; i < res.rows.length; i++) {
					$scope.dosens.push(res.rows.item(i));
			}
		}, function (err) {
			console.log(err.message);
		});
	};	

	$scope.update = function(){
		$scope.getList();
		$scope.$broadcast('scroll.refreshComplete');
	};
}) 


// controller Detail Dosen modulTraining
con.controller('detailDosen', function($scope, $stateParams, $timeout, $state, $ionicPopup, $cordovaSQLite, learningService, $ionicLoading){

	$scope.show_loading = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	$scope.hide_loading = function(){
		$ionicLoading.hide();
	};

	$scope.show_loading();

	$timeout(function () {		
		$scope.get_dosen();
		$scope.get_tutor();
		$scope.hide_loading();
	}, 3000);

	$scope.get_tutor = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_tutor where id_dosen =' + $stateParams.idPost).then(function (res) {
			$scope.posts = [];
			for (var i = 0; i < res.rows.length; i++) {
				$scope.posts.push(res.rows.item(i));
			}
		}, function (err) {
			console.log(err.message);
		});
	};
	

	$scope.get_dosen = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_dosen where id_dosen= '+ $stateParams.idPost).then(function (res) {
			$scope.dosens = [];
			for (var i = 0; i < res.rows.length; i++) {
				$scope.dosens.push(res.rows.item(i));
			}
		}, function (err) {
			console.log(err.message);
		});
	};
})

// controller Module Training
con.controller('modulTraining', function($scope, $stateParams, $timeout, $state, $ionicPopup, $cordovaSQLite, learningService, $ionicLoading){
	$scope.show_loading = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});
	};
	$scope.hide_loading = function(){
		$ionicLoading.hide();
	};

	$scope.delete = function(){
		$cordovaSQLite.execute(db, 'delete from tbl_tutor');
		$scope.getList();
		alert("delete");
	};

	$scope.show_loading();
	$timeout(function () {
		$scope.addtosqlite = function() {
			if(window.Connection) {
				if(navigator.connection.type == Connection.NONE) {
					$ionicPopup.alert({
						title: "Information",
						template: "update gagal, mohon periksa koneksi internet anda.",
						okText: 'Ok',
						okType: 'button-positive'
					});
				} else {
					// $scope.delete();
					learningService.getAll().success(function(data) {
					// $scope.artists= data;
					var log = [];
					angular.forEach(data, function(value, key) {
							var query = "INSERT INTO tbl_tutor(id_json,img,title,intro,isi,kategori,nama_dosen, tanggal, latihan, id_dosen) VALUES (?,?,?,?,?,?,?,?,?,?)";
							log.push(value[key, 'id']);
							log.push(value[key, 'img']);
							log.push(value[key, 'title']);
							log.push(value[key, 'intro']);
							log.push(value[key, 'isi']);
							log.push(value[key, 'kategori']);
							log.push(value[key, 'nama_dosen']);
							log.push(value[key, 'tanggal']);
							log.push(value[key, 'latihan']);
							log.push(value[key, 'id_dosen']);

							log = [];
						});
					})
					
				}
			}
			$scope.$broadcast('scroll.refreshComplete');
		}
		// $scope.delete();
		$scope.addtosqlite();
		$scope.getList();
		$scope.hide_loading();
		// alert("load");
	}, 3000);

	$timeout(function () {
		// $scope.delete();
		// alert();
	}, 1000);

	$scope.getList = function() {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_tutor where id_dosen =' + $stateParams.idPost).then(function (res) {
			$scope.posts = [];
			for (var i = 0; i < res.rows.length; i++) {
					$scope.posts.push(res.rows.item(i));

			}

		}, function (err) {
			console.log(err.message);
		});
	};
		
		$scope.reload = function (){
			$state.go('app.home');
		};
})
