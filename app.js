angular.module('app', ['ngResource']);

angular.module('app')
  .controller('HomeController', function(UserService) {
    var vm = this;

    UserService.getUsers().then(function(response) {
      console.log(response);
    });

    vm.test = '1';
  })
  .factory('UserService', function($http) {
    return {
      getUsers: getUsers
    };

    function getUsers() {
      return $http.get(
        'https://gist.githubusercontent.com/tony1223/098e45623c73274f7ae3/raw/2c1252bbbdf2f43d10f37d5591717b42787d8a99/gistfile1.json'
      );
    }
  });
