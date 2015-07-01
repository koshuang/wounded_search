angular.module('app')
  .controller('SearchController', function($mdDialog, $analytics, $timeout,
    UserService) {
    var vm = this;
    var PAGE_COUNT = 20;
    var paging = {
      current: 1,
      total: 1
    };
    var fuse;
    var keywordTimer;

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
            '醫療檢傷', '救護檢傷', '即時動向', '轉診要求'
          ]
        });
      });
    }

    function processUsers(users) {
      return _.each(users, function(user) {
        user['醫療檢傷'] = user['醫療檢傷'].trim();
        user['救護檢傷'] = user['救護檢傷'].trim();
        user['即時動向'] = user['即時動向'].trim();

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

      //Track keyword after user stop typing
      $timeout.cancel(keywordTimer);
      keywordTimer = $timeout(trackSearchKeyword.bind(null, vm.searchText),
        5000);
    }

    function trackSearchKeyword(keyword) {
      if (!keyword) {
        return;
      }

      $analytics.pageTrack('/search?q=' + keyword);

      $timeout.cancel(keywordTimer);
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
  });

function DialogController($scope, $mdDialog, hospital) {
  $scope.hospital = hospital;

  $scope.close = function() {
    $mdDialog.cancel();
  };
}
