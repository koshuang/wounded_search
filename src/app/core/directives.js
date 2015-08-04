angular.module('app')
  .directive('menuToggle', ['$timeout', function($timeout) {
    return {
      scope: {
        section: '='
      },
      templateUrl: 'src/app/core/menu-toggle.html',
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
      templateUrl: 'src/app/core/menu-link.html',
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
      templateUrl: 'src/app/core/menu-content.html',
      link: function($scope, $element) {
        var controller = $element.parent().controller();

        $scope.focusSection = function() {
          // set flag to be used later when
          // $locationChangeSuccess calls openPage()
          controller.autoFocusContent = true;
        };
      }
    };
  });
