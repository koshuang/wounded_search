angular.module('app', ['ngMaterial']);

angular.module('app')
  .config(config)
  .controller('HomeController', function($mdDialog, UserService) {
    var vm = this;
    var fuse;

    vm.search = search;
    vm.showHospital = showHospital;
    vm.hospital = {};

    activate();

    function activate() {
      fetchUsers();
    }

    function fetchUsers() {
      UserService.getUsers().then(function(response) {
        vm.lastmodify = response.data.lastmodify;
        vm.users = response.data.data;
        vm.result = response.data.data;

        fuse = new Fuse(vm.users, {
          keys: ['編號', '縣市別', '收治單位', '檢傷編號', '姓名', '性別', '國籍', '年齡',
            '醫療檢傷', '救護檢傷', '即時動向', '轉診要求', '刪除註記'
          ]
        });
      });
    }

    function search(name) {
      name = name || vm.searchText;

      if (!name) {
        vm.result = vm.users;
        return;
      }

      vm.result = fuse.search(name);
    }

    function showHospital(ev, name) {
      vm.hospital = _.find(hospitals, {
        '醫院': name
      });

      $mdDialog.show({
        resolve: {
          hospital: function() {
            return vm.hospital;
          }
        },
        controller: DialogController,
        templateUrl: 'hospital.html',
        parent: angular.element(document.body),
        targetEvent: ev
      });
    }
  })
  .factory('UserService', function($http) {
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http.get(
        'https://gist.githubusercontent.com/tony1223/098e45623c73274f7ae3/raw'
      );
    }
  });

function config($mdThemingProvider) {}

function DialogController($scope, $mdDialog, hospital) {
  $scope.hospital = hospital;

  $scope.close = function() {
    $mdDialog.cancel();
  };
}
