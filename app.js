angular.module('app', ['ngMaterial', 'infinite-scroll']);

angular.module('app')
  .controller('HomeController', function($mdDialog, UserService) {
    var vm = this;
    var PAGE_COUNT = 20;
    var paging = {
      current: 1,
      total: 1
    };
    var fuse;

    vm.loaded = false;
    vm.search = search;
    vm.loadMore = loadMore;
    vm.showService = showService;
    vm.hospitals = hospitals;
    vm.hospital = {};

    activate();

    function activate() {
      fetchUsers();
    }

    function fetchUsers() {
      UserService.getUsers().then(function(response) {
        var data = response.data;
        var hospital;

        vm.users = data.data;
        vm.allResult = vm.users;
        vm.lastmodify = data.lastmodify;
        vm.result = processPaging(vm.users);
        vm.source = getSource(data);

        processUsers(vm.users);

        vm.loaded = true;

        fuse = new Fuse(vm.users, {
          keys: ['編號', '縣市別', '收治單位', '檢傷編號', '姓名', '性別', '國籍', '年齡',
            '醫療檢傷', '救護檢傷', '即時動向', '轉診要求', '刪除註記'
          ]
        });
      });
    }

    function processUsers(users) {
      return _.each(users, function(user) {
        user.hospital = hospitals[user['收治單位']];
        user.service = _.find(services, {
          '醫院': user['收治單位']
        });
      });
    }

    function processPaging(users) {
      paging.current = 1;
      paging.total = Math.round(users.length / PAGE_COUNT);

      return users.slice(0, PAGE_COUNT);
    }

    function loadMore() {
      if (paging.current == paging.total) {
        return;
      }

      var next = vm.users.slice(paging.current * PAGE_COUNT, ++paging.current *
        PAGE_COUNT
      );

      vm.result = vm.result.concat(next);
    }

    function search() {
      vm.allResult = vm.searchText && vm.searchText.length <= 5 ? fuse.search(
        vm.searchText) : vm.users;
      vm.result = processPaging(vm.allResult);
      trackSearchKeyword(vm.searchText);
    }

    function trackSearchKeyword(keyword) {
      if (!keyword) {
        return;
      }

      ga('send', 'event', 'button', 'click', 'query', keyword);
    }

    function showService(ev, name) {
      vm.hospital = _.find(services, {
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

    function getSource(data) {
      var sources = data.source.split('http');

      return {
        name: sources[0].trim(),
        url: 'http' + sources[1]
      };
    }
  })
  .factory('UserService', function($http) {
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http({
        // url: 'http://tonyq.org/kptaipei/api-20150628.php',
        url: 'https://gist.githubusercontent.com/koshuang/e14f64b7bfc2c86417b2/raw/a40c5c341a630ff97397153e163af6c40f778140/wounded_list.json?t' +
          new Date().getTime()
      });
    }
  });

function DialogController($scope, $mdDialog, hospital) {
  $scope.hospital = hospital;

  $scope.close = function() {
    $mdDialog.cancel();
  };
}
