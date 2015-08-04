angular.module('app', ['ngMaterial', 'ngAria', 'infinite-scroll', 'ui.router',
  'angulartics', 'angulartics.google.analytics', 'nvd3'
]);

angular.module('app')
  .config(function($urlRouterProvider, $stateProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
  });
