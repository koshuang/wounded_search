'use strict';

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
    vm.share = share;

    function share() {
      window.open(
        'http://www.facebook.com/share.php?u=http://koshuang.github.io/wounded_search',
        '_blank');
      $analytics.eventTrack('share');
    }

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
  });
