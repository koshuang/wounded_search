angular.module('app', ['ngResource']);

angular.module('app')
  .controller('HomeController', function(UserService) {
    var vm = this;
    var fuse;

    vm.search = search;

    activate();

    function activate() {
      fetchUsers();
    }

    function fetchUsers() {
      UserService.getUsers().then(function(response) {
        vm.users = response.data;
        vm.result = response.data;

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

  })
  .filter('userFilter', function() {
    return function(input) {
      return input ? '\u2713' : '\u2718';
    };
  })
  .factory('UserService', function($http) {
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http.get(
        'https://gist.githubusercontent.com/tony1223/098e45623c73274f7ae3/raw/2c1252bbbdf2f43d10f37d5591717b42787d8a99/gistfile1.json'
      );
    }
  });
