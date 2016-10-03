
con.controller('login', function($scope, $ionicHistory, $ionicNavBarDelegate, $http, $state, $timeout, $ionicLoading, $ionicPopup, learningService, $cordovaSQLite ) 
{
	$ionicHistory.nextViewOptions({
		disableBack: true
	});
	
	$scope.show_loading = function() {
		$ionicLoading.show({
			template: 'Cek Login...'
		});
	};
	$scope.hide_loading = function(){
		$ionicLoading.hide();
	};

	$scope.show_loading();

	$scope.data = {};
	$timeout(function () {
		$cordovaSQLite.execute(db, 'SELECT * FROM tbl_login').then(function (res) {
			$scope.datas = [];
			if(res.rows.length > 0) {
				$state.go('app.home');
			} 
			$ionicLoading.hide();
		}, function (err) {
			console.log(err.message);
		});

		
	}, 1000);
	// $scope.hide_loading();
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
						var nama = value['nama'];
						$cordovaSQLite.execute(db, query, log).then(function () {
							$ionicPopup.alert({
								title: "Hello",
								template: "Selamat Datang "+nama,
								okText: 'Ok',
								okType: 'button-positive'
							});
							$state.go('app.home');
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
})

// controller Profile 
con.controller('profile', function($scope, $cordovaSQLite, $timeout) {
	
	$timeout(function () {
		$scope.showData = function() {
			$cordovaSQLite.execute(db, 'SELECT * FROM tbl_login').then(function (res) {
				$scope.datas = [];
				for (var i = 0; i < res.rows.length; i++) {
					$scope.datas.push(res.rows.item(i)); 
				}
			}, function (err) {
				console.log(err.message);
			});
		};
		$scope.showData();
	}, 1000);
})

con.controller('view_update', function($scope, $cordovaSQLite, $ionicNavBarDelegate, $ionicPlatform, $ionicModal, $ionicPopup, $stateParams, $timeout, learningService) {
	$ionicNavBarDelegate.showBackButton(true);

	$timeout(function () {
		$scope.idUser = $scope.logins[0].id_user;
		// $scope.updateLatihan();
		$scope.showDataLatihan();
		$scope.updateRead();
		// alert($scope.idUser);
	}, 1000);

	$scope.showDataLatihan = function() {
		$cordovaSQLite.execute(db, 'SELECT *, tbl_dosen.`nama` as nama_dosen  FROM tbl_tutor JOIN tbl_latihan ON tbl_tutor.`id_json` = tbl_latihan.`id_posting` '+
			'JOIN tbl_dosen ON tbl_latihan.`id_dosen` = tbl_dosen.`id_dosen` where tbl_latihan.`id_mahasiswa` = ' + $scope.idUser).then(function (res) {
			$scope.get_latihan = [];
			for (var i = 0; i < res.rows.length; i++) {
				$scope.get_latihan.push(res.rows.item(i)); 
				// alert();
			}
		}, function (err) { 
			console.log(err.message);
		});
	};

	$scope.updateRead = function(){
		if(window.Connection) {
			if(navigator.connection.type != Connection.NONE) {

				learningService.update_read($scope.idUser).success(function(data) {
				}).finally(function() {
				});
				
			}
		}
	};

	
	// }, 1000);
})