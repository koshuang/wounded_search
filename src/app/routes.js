angular.module('app')
  .config(function($urlRouterProvider, $stateProvider, $mdThemingProvider) {
    $urlRouterProvider
      .otherwise('/');

    // Use $stateProvider to configure your states.
    $stateProvider
      .state('home', {
        url: '/',
        resolve: {
          data: function(UserService) {
            return UserService.getUsers().then(function(response) {
              return response.data;
            });
          }
        },
        templateUrl: 'src/app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
      .state('home.search', {
        url: 'search',
        templateUrl: 'src/app/search/search.html',
        controller: 'SearchController',
        controllerAs: 'vm'
      })
      .state('home.status', {
        url: 'status',
        templateUrl: 'src/app/status/status.html',
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
  })
