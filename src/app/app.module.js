angular.module('app', ['ngMaterial', 'ngAria', 'infinite-scroll', 'ui.router',
  'angulartics', 'angulartics.google.analytics', 'nvd3'
]);

angular.module('app')
  .controller('HomeController', function($rootScope, $state, $mdUtil,
    $mdSidenav, UserService, data, menuService, $analytics) {
    var vm = this;
    var indexes = {
      'home.search': 0,
      'home.status': 1
    };
    var menu = menuService.create(data.lastmodify);

    vm.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

    vm.selectedTab = indexes[$state.current.name];
    vm.onSwipeLeft = onSwipeLeft;
    vm.onSwipeRight = onSwipeRight;

    vm.isOpen = isOpen;
    vm.toggleOpen = toggleOpen;
    vm.toggleMenu = buildToggleMenu('left');
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

    function buildToggleMenu(navID) {
      var debounceFn = $mdUtil.debounce(function() {
        $analytics.eventTrack('toggleMenu');

        $mdSidenav(navID)
          .toggle();
      }, 300);
      return debounceFn;
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
  .directive('menuContent', function() {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'src/app/menu-content.html',
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
  .factory('menuService', [
    '$location',
    '$rootScope',
    function($location, $rootScope) {
      return {
        create: function(lastmodify) {
          var sections = [];

          //   社會局社工科電話 <a href="tel:02-27206528">02-27206528</a><br><br>
          //   <a target="_blank" href="https://tw.news.yahoo.com/%E5%B9%AB%E5%8A%A9%E5%85%AB%E4%BB%99%E5%82%B7%E8%80%85-%E4%BD%A0%E5%8F%AF%E4%BB%A5%E5%81%9A%E5%BE%97%E6%9B%B4%E5%A4%9A-034650399.html">幫助八仙傷者 你可以做得更多</a><br><br>
          //   <a href="http://er.mohw.g0v.tw/#/dashboard/file/default.json">全國重度級急救責任醫院急診即時訊息</a>
          //   <small>資料來源：<a ng-href="{{vm.source.url}}" target="_blank">{{vm.source.name}}</a></small>
          //   <small>最後更新時間：{{vm.lastmodify}}</small>
          sections.push({
            name: '資訊',
            type: 'toggle',
            pages: [{
              name: '社會局社工科電話',
              content: '02-27206528',
              icon: 'fa fa-group',
              type: 'content',
            }, {
              name: '最後更新時間',
              content: lastmodify,
              type: 'content',
            }]
          });

          var self;

          return self = {
            sections: sections,

            toggleSelectSection: function(section) {
              self.openedSection = (self.openedSection === section ?
                null :
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
        }
      }

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
        resolve: {
          data: function(UserService) {
            return UserService.getUsers().then(function(response) {
              return response.data;
            });
          }
        },
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
