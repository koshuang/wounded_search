angular.module('app', ['ngMaterial', 'ngAria', 'infinite-scroll', 'ui.router',
  'angulartics', 'angulartics.google.analytics', 'nvd3'
]);

angular.module('app')
  .controller('HomeController', function($rootScope, $state, UserService, menu) {
    var vm = this;
    var indexes = {
      'home.search': 0,
      'home.status': 1
    };

    vm.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    vm.selectedTab = indexes[$state.current.name];
    vm.onSwipeLeft = onSwipeLeft;
    vm.onSwipeRight = onSwipeRight;

    vm.isOpen = isOpen;
    vm.toggleOpen = toggleOpen;
    vm.autoFocusContent = false;
    vm.menu = menu;


    function isOpen(section) {
      return menu.isSectionSelected(section);
    }

    function toggleOpen(section) {
      menu.toggleSelectSection(section);
    }

    function onSwipeLeft() {
      $rootScope.vm.selectedTab = --$rootScope.vm.selectedTab % 2;
      go($rootScope.vm.selectedTab);
    }

    function onSwipeRight() {
      $rootScope.vm.selectedTab = ++$rootScope.vm.selectedTab % 2;
      go($rootScope.vm.selectedTab);
    }

    function go(index) {
      var target = index === 0 ? 'home.search' : 'home.status';
      if (target !== $state.current.name) {
        $state.go(target);
      }
    }
  })
  .directive('menuToggle', ['$timeout', function($timeout) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'src/app/menu-toggle.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();
        $scope.isOpen = function() {
          return controller.isOpen($scope.section);
        };
        $scope.toggle = function() {
          controller.toggleOpen($scope.section);
        };
      }
    };
  }])
  .directive('menuLink', function() {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'src/app/menu-link.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.focusSection = function() {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
        };
      }
    };
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
  //take all whitespace out of string
  .filter('nospace', function() {
    return function(value) {
      return (!value) ? '' : value.replace(/ /g, '');
    };
  })
  //replace uppercase to regular case
  .filter('humanizeDoc', function() {
    return function(doc) {
      if (!doc) return;
      if (doc.type === 'directive') {
        return doc.name.replace(/([A-Z])/g, function($1) {
          return '-' + $1.toLowerCase();
        });
      }

      return doc.label || doc.name;
    };
  })
  .factory('menu', [
    '$location',
    '$rootScope',
    function($location) {

      var sections = [];

      sections.push({
        name: '最新消息',
        type: 'toggle',
        pages: [{
          name: 'IPAs',
          type: 'toggle',
          icon: '',
          pages: [{
            name: 'IPAs',
            type: 'toggle',
            state: '',
            icon: ''
          }]
        }]
      });

      var self;

      return self = {
        sections: sections,

        toggleSelectSection: function(section) {
          self.openedSection = (self.openedSection === section ? null :
            section);
        },
        isSectionSelected: function(section) {
          return self.openedSection === section;
        },

        selectPage: function(section, page) {
          page && page.url && $location.path(page.url);
          self.currentSection = section;
          self.currentPage = page;
        }
      };

      function sortByHumanName(a, b) {
        return (a.humanName < b.humanName) ? -1 :
          (a.humanName > b.humanName) ? 1 : 0;
      }

    }
  ])
  .config(function($urlRouterProvider, $stateProvider, $mdThemingProvider) {
    $urlRouterProvider
      .otherwise('/');

    // Use $stateProvider to configure your states.
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'src/app/home.html',
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

    $mdThemingProvider.theme('default')
      .primaryPalette('pink')
      .accentPalette('orange');
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
