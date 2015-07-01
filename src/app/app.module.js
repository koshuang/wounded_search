angular.module('app', ['ngMaterial', 'infinite-scroll', 'ui.router']);

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
        url: 'https://raw.githubusercontent.com/tpe-doit/color-explosion-20150628/master/gistfile1.json'
      });
    }
  })
  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider
      .otherwise('/');

    // Use $stateProvider to configure your states.
    $stateProvider
      .state('home', {
        url: '/',
        template: '<div ui-view></div>'
      })
      .state('home.search', {
        url: 'search',
        templateUrl: 'src/app/search.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      });
  })
  .run(function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      // fix ui-router when
      // http://stackoverflow.com/questions/27120308/angular-ui-router-urlrouterprovider-when-not-working-when-i-click-a-ui-sref
      var defaultRoutes = {
        'home': {
          targetState: 'home.search'
        },
      };

      if (defaultRoutes[toState.name]) {
        event.preventDefault();
        var route = defaultRoutes[toState.name];
        $state.go(route.targetState, route.data);
      }

    });
  });

function DialogController($scope, $mdDialog, hospital) {
  $scope.hospital = hospital;

  $scope.close = function() {
    $mdDialog.cancel();
  };
}
