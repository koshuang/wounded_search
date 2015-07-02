angular.module('app', ['ngMaterial', 'infinite-scroll', 'ui.router',
  'angulartics', 'angulartics.google.analytics', 'nvd3'
]);

angular.module('app')
  .controller('HomeController', function($rootScope, $state, UserService) {
    var indexes = {
      'home.search': 0,
      'home.status': 1
    };

    $rootScope.vm.selectedTab = indexes[$state.current.name];
  })
  .factory('UserService', function($http) {
    var cache;
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http({
        url: 'https://raw.githubusercontent.com/tpe-doit/color-explosion-20150628/master/gistfile1.json',
        cache: true
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
        template: '<div ui-view></div>',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('home.search', {
        url: 'search',
        templateUrl: 'src/app/search.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      })
      .state('home.status', {
        url: 'status',
        templateUrl: 'src/app/status.html',
        controller: 'StatusController',
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
